'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

export default function SmartGiftFinderPage() {
  const occasions = [
    { label: 'Birthday', href: '/products?occasion=Birthday' },
    { label: 'Anniversary', href: '/products?occasion=Anniversary' },
    { label: 'Wedding', href: '/products?occasion=Wedding' },
    { label: 'Corporate', href: '/products?category=Corporate' },
    { label: 'Valentine', href: '/products?occasion=Valentine' },
  ];
  const types = [
    { label: 'Photo Mugs', href: '/products?category=Mugs' },
    { label: 'Photo Frames', href: '/products?category=Frames' },
    { label: '3D Crystals', href: '/products?category=Crystals' },
    { label: 'Personalised T-Shirts', href: '/products?category=Apparel' },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-slate-800">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="h-6 w-6 sm:h-7 sm:w-7 text-pink-500 shrink-0" />
        Smart Gift Finder
      </h1>
      <p className="mt-2 text-slate-600 text-sm sm:text-base">
        Choose an occasion or product type to find the perfect gift.
      </p>
      <section className="mt-6 sm:mt-8">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">By Occasion</h2>
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3">
          {occasions.map((o) => (
            <Link key={o.href} href={o.href} className="rounded-xl bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 shadow-sm ring-1 ring-pink-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-300 touch-manipulation hover-lift-3d transition-all duration-300">
              {o.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-6 sm:mt-8">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">By Product Type</h2>
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-2 sm:gap-3">
          {types.map((t) => (
            <Link key={t.href} href={t.href} className="rounded-xl bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 shadow-sm ring-1 ring-pink-200 hover:bg-pink-50 hover:text-pink-700 hover:ring-pink-300 touch-manipulation hover-lift-3d transition-all duration-300">
              {t.label}
            </Link>
          ))}
        </div>
      </section>
      <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500">
        <Link href="/products" className="font-medium text-pink-600 hover:text-pink-700 hover:underline transition-colors touch-manipulation">View all products →</Link>
      </p>
    </div>
  );
}
