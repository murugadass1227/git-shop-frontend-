import { test } from '@playwright/test';

test('inspect navbar sidebar layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

  const menuButton = page.getByRole('button', { name: 'Open menu' });
  await menuButton.click();

  const sheet = page.getByRole('dialog').first();
  await sheet.waitFor({ state: 'visible' });

  await page.screenshot({ path: 'sidebar-open.png', fullPage: true });

  const firstSectionButton = sheet.locator('button').filter({ has: page.locator('svg') }).nth(1);
  await firstSectionButton.click();

  const activeSectionButton = sheet.locator('button').filter({ has: page.locator('svg') }).nth(1);
  await activeSectionButton.waitFor({ state: 'visible' });

  await page.screenshot({ path: 'sidebar-third-column.png', fullPage: true });

  const details = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement | null;
    const menuHeading = Array.from(document.querySelectorAll('h2')).find((el) => el.textContent?.trim() === 'Menu');
    const sectionButtons = Array.from(dialog?.querySelectorAll('button') ?? []).filter((button) =>
      button.textContent?.trim() &&
      button.querySelector('svg')
    ) as HTMLElement[];

    const activeSection = sectionButtons.find((button) => {
      const style = window.getComputedStyle(button);
      return style.boxShadow !== 'none' || style.backgroundImage.includes('gradient');
    }) ?? null;

    const groupButtons = sectionButtons.slice(sectionButtons.length > 8 ? 8 : 0);
    const activeGroup = groupButtons.find((button) => {
      const style = window.getComputedStyle(button);
      return style.boxShadow !== 'none' || style.backgroundImage.includes('gradient');
    }) ?? null;

    const grids = Array.from(dialog?.querySelectorAll('div') ?? []).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display === 'grid';
    }) as HTMLElement[];

    const childGrid = grids.find((grid) => {
      const links = grid.querySelectorAll('a');
      return links.length >= 4 && Array.from(links).every((link) => link.textContent?.trim());
    }) ?? null;

    const childCards = Array.from(childGrid?.querySelectorAll('a') ?? []).slice(0, 6).map((card) => {
      const rect = (card as HTMLElement).getBoundingClientRect();
      return {
        text: card.textContent?.replace(/\s+/g, ' ').trim(),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });

    return {
      menuFound: Boolean(menuHeading),
      dialogBackground: dialog ? window.getComputedStyle(dialog).backgroundImage : null,
      dialogBgColor: dialog ? window.getComputedStyle(dialog).backgroundColor : null,
      activeSectionText: activeSection?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
      activeSectionStyles: activeSection
        ? {
            backgroundImage: window.getComputedStyle(activeSection).backgroundImage,
            backgroundColor: window.getComputedStyle(activeSection).backgroundColor,
            borderColor: window.getComputedStyle(activeSection).borderColor,
            boxShadow: window.getComputedStyle(activeSection).boxShadow,
          }
        : null,
      activeGroupText: activeGroup?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
      activeGroupStyles: activeGroup
        ? {
            backgroundImage: window.getComputedStyle(activeGroup).backgroundImage,
            backgroundColor: window.getComputedStyle(activeGroup).backgroundColor,
            borderColor: window.getComputedStyle(activeGroup).borderColor,
            boxShadow: window.getComputedStyle(activeGroup).boxShadow,
          }
        : null,
      childCardCount: childCards.length,
      childCards,
      childGridWidth: childGrid ? Math.round(childGrid.getBoundingClientRect().width) : null,
    };
  });

  console.log(JSON.stringify(details, null, 2));
});
