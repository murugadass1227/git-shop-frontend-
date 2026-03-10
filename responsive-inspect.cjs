const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:3001';
const outDir = path.join(process.cwd(), 'responsive-artifacts');

const viewports = [
  { name: '390x844', width: 390, height: 844 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1280x800', width: 1280, height: 800 },
];

const sectionTargets = [
  { key: 'top', text: null },
  { key: 'popular-collections', text: 'Popular Collections' },
  { key: 'featured-products', text: 'Featured Products' },
  { key: 'footer', text: 'Social Media' },
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollToText(page, text) {
  if (!text) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wait(400);
    return true;
  }

  const locator = page.getByText(text, { exact: true }).first();
  const count = await locator.count();
  if (!count) return false;
  await locator.scrollIntoViewIfNeeded();
  await wait(500);
  return true;
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const overflow = {
      clientWidth: doc.clientWidth,
      scrollWidth: Math.max(doc.scrollWidth, body?.scrollWidth || 0),
      hasHorizontalOverflow: Math.max(doc.scrollWidth, body?.scrollWidth || 0) > doc.clientWidth,
    };

    const header = document.querySelector('header');
    const headerRect = header ? header.getBoundingClientRect() : null;

    const pickByText = (text) => {
      const nodes = Array.from(document.querySelectorAll('body *'));
      const match = nodes.find((node) => node.textContent && node.textContent.trim() === text);
      if (!match) return null;
      const rect = match.getBoundingClientRect();
      return {
        text,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    };

    return {
      overflow,
      header: headerRect
        ? {
            top: headerRect.top,
            left: headerRect.left,
            width: headerRect.width,
            height: headerRect.height,
            bottom: headerRect.bottom,
          }
        : null,
      sections: {
        popularCollections: pickByText('Popular Collections'),
        featuredProducts: pickByText('Featured Products'),
        footerSocial: pickByText('Social Media'),
      },
    };
  });
}

async function run() {
  await ensureDir(outDir);
  const browser = await chromium.launch({
    headless: true,
    executablePath: EDGE_PATH,
  });

  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      screen: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await wait(2000);

    const metrics = await collectMetrics(page);
    const viewportDir = path.join(outDir, viewport.name);
    await ensureDir(viewportDir);

    for (const target of sectionTargets) {
      await scrollToText(page, target.text);
      await page.screenshot({
        path: path.join(viewportDir, `${target.key}.png`),
        fullPage: false,
      });
    }

    await page.screenshot({
      path: path.join(viewportDir, 'fullpage.png'),
      fullPage: true,
    });

    results.push({
      viewport,
      metrics,
    });

    await context.close();
  }

  await fs.promises.writeFile(
    path.join(outDir, 'report.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );

  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
