'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  style: 'sale' | 'default';
  image?: string;
};

const defaultSlides: Slide[] = [
  {
    id: '1',
    title: 'UP TO 50% OFF',
    subtitle: 'End of Season Sale',
    ctaText: 'SHOP NOW',
    ctaHref: '/products?sort=price_asc',
    style: 'sale',
    image: '/assets/banners/banner1.jpeg',
  },
  {
    id: '2',
    title: 'Personalised Photo Gifts',
    subtitle: 'Mugs, Frames & More',
    ctaText: 'Explore',
    ctaHref: '/products?category=Mugs',
    style: 'default',
    image: '/assets/banners/banner2.jpg',
  },
  {
    id: '3',
    title: 'Corporate Gifting',
    subtitle: 'Award & Recognition Gifts',
    ctaText: 'View Range',
    ctaHref: '/products?category=Corporate',
    style: 'default',
    image: '/assets/banners/banner3.jpeg',
  },
  {
    id: '4',
    title: 'Gift for Every Occasion',
    subtitle: 'Birthday, Anniversary & More',
    ctaText: 'Shop Occasions',
    ctaHref: '/products?occasion=Birthday',
    style: 'default',
    image: '/assets/banners/banner4.webp',
  },
  {
    id: '5',
    title: 'Customised Gifts',
    subtitle: 'Add Your Photo & Message',
    ctaText: 'Personalise',
    ctaHref: '/products?customizable=true',
    style: 'default',
    image: '/assets/banners/banner5.webp',
  },
  {
    id: '6',
    title: 'Order Now',
    subtitle: 'Fast delivery on personalised gifts',
    ctaText: 'View All',
    ctaHref: '/products',
    style: 'default',
    image: '/assets/banners/banner6.webp',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slides = defaultSlides;

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const visibleSlides = Array.from({ length: 3 }, (_, offset) => slides[(current + offset) % slides.length]);

  return (
    <section className="w-full bg-[#f6f1ed] py-3 sm:py-4">
      <div className="mx-auto w-full max-w-[1600px] px-0 sm:px-3">
        <div className="relative overflow-hidden rounded-[22px] bg-white/60 p-1.5 shadow-lg shadow-rose-100/30 sm:rounded-[28px] sm:p-2.5">
          <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2 xl:grid-cols-[0.9fr_1.35fr_0.9fr] xl:gap-2.5">
            {visibleSlides.map((slide, index) => (
              <Link
                key={`${slide.id}-${index}`}
                href={slide.ctaHref || '/products'}
                className={`group relative overflow-hidden rounded-[18px] bg-slate-200 sm:rounded-[22px] ${
                  index > 0 ? 'hidden md:block' : ''
                } ${index > 1 ? 'hidden xl:block' : ''}`}
              >
                {slide.image && (
                  <>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div
                      className={`absolute inset-0 ${
                        index === 1
                          ? 'bg-gradient-to-r from-white/85 via-white/40 to-rose-200/20'
                          : 'bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent'
                      }`}
                      aria-hidden
                    />
                  </>
                )}

                <div
                  className={`relative flex min-h-[240px] flex-col justify-end p-4 sm:min-h-[280px] sm:p-6 lg:min-h-[320px] xl:min-h-[360px] ${
                    index === 1 ? 'items-start justify-center text-left' : 'items-start text-left'
                  }`}
                >
                  <div className={`max-w-[18rem] ${index === 1 ? 'sm:max-w-[24rem]' : ''}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${index === 1 ? 'text-rose-500' : 'text-white/80'}`}>
                      {slide.style === 'sale' ? 'Special Gifts' : 'Featured Collection'}
                    </p>
                    <h2
                      className={`mt-2 font-bold leading-tight ${
                        index === 1
                          ? 'text-3xl text-slate-900 sm:text-4xl lg:text-5xl'
                          : 'text-xl text-white sm:text-2xl lg:text-3xl'
                      }`}
                    >
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className={`mt-2 ${index === 1 ? 'text-sm text-slate-700 sm:text-lg' : 'text-sm text-white/90 sm:text-base'}`}>
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaText && (
                      <span
                        className={`mt-5 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold shadow-md transition sm:text-sm ${
                          index === 1
                            ? 'bg-orange-500 text-white group-hover:bg-orange-600'
                            : 'bg-white/90 text-slate-900 group-hover:bg-white'
                        }`}
                      >
                        {slide.ctaText}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white sm:left-4"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white sm:right-4"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-slate-700 sm:h-6 sm:w-6" />
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition ${
                  i === current ? 'w-7 bg-rose-500' : 'w-2 bg-rose-200 hover:bg-rose-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
