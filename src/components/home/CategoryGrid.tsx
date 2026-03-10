'use client';

import Link from 'next/link';

const CATEGORIES = [
  { name: 'Birthday', image: '/assets/category/c1.webp', href: '/products?occasion=Birthday', bg: 'bg-pink-100' },
  { name: 'Anniversary', image: '/assets/category/c2.webp', href: '/products?occasion=Anniversary', bg: 'bg-slate-200' },
  { name: 'Trophies', image: '/assets/category/c3.webp', href: '/products?category=Corporate', bg: 'bg-amber-100' },
  { name: 'Mini You Series', image: '/assets/category/c4.webp', href: '/products?category=Novelty', bg: 'bg-sky-100' },
  { name: 'Corporate Gifts', image: '/assets/category/c5.webp', href: '/products?category=Corporate', bg: 'bg-slate-300' },
  { name: 'Personalized Gifts', image: '/assets/category/c6.webp', href: '/products?customizable=true', bg: 'bg-slate-700' },
  { name: '3D Crystals', image: '/assets/category/c7.webp', href: '/products?category=Crystals', bg: 'bg-pink-100' },
  { name: 'Handmade Gifts', image: '/assets/category/c8.webp', href: '/products', bg: 'bg-orange-100' },
] as const;

// Fallback when image fails to load
function CategoryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain p-2"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.display = 'none';
          const fallback = el.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'block';
        }}
      />
      <span className="hidden text-4xl text-slate-500" aria-hidden>🎁</span>
    </>
  );
}

export function CategoryGrid() {
  return (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 lg:text-3xl">
          Buy Custom Personalized & Corporate Gifts
        </h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Gondget - A Bit of You in Every Gift
        </p>
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center touch-manipulation"
            >
              <div
                className={`flex aspect-square w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px] mx-auto items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl ${cat.bg} transition group-hover:ring-2 group-hover:ring-violet-400`}
              >
                <CategoryImage src={cat.image} alt={cat.name} />
              </div>
              <span className={`mt-1.5 sm:mt-2 text-center text-xs sm:text-sm font-medium group-hover:text-violet-600 ${cat.bg === 'bg-slate-700' ? 'text-white' : 'text-slate-800'}`}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
