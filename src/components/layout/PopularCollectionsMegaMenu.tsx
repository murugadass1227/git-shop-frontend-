'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { popularCollections } from '@/data/popularCollections';

export function PopularCollectionsMegaMenu() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeCollection = useMemo(
    () => popularCollections.find((item) => item.id === activeId) ?? popularCollections[0],
    [activeId],
  );

  return (
    <div
      className="relative hidden lg:block border-t border-slate-200/80 bg-white/95 backdrop-blur-xl"
      onMouseLeave={() => setActiveId(null)}
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center justify-center gap-1 overflow-x-auto py-2">
          {popularCollections.map((item) => {
            const isActive = activeCollection?.id === item.id && activeId !== null;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveId(item.id)}
                className={`relative whitespace-nowrap px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-pink-700'
                    : 'text-slate-700 hover:text-pink-700'
                }`}
              >
                <span>{item.title}</span>
                <span
                  className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-pink-600 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {activeId && activeCollection && (
        <div className="absolute left-0 right-0 top-full z-[70] border-y border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 xl:grid-cols-[2fr_2fr_1.35fr]">
            <div className="xl:col-span-2">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                    Popular Collections
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{activeCollection.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">{activeCollection.description}</p>
                </div>
                <Link
                  href={activeCollection.href}
                  className="shrink-0 rounded-full border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50"
                >
                  Explore All
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeCollection.groups.map((group) => (
                  <div key={group.title}>
                    <h4 className="border-l-4 border-pink-500 pl-3 text-sm font-bold text-slate-900">
                      {group.title}
                    </h4>
                    <div className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block text-sm text-slate-600 transition-colors hover:text-pink-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={activeCollection.href}
              className="group overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 shadow-sm"
            >
              <div className="relative h-56">
                <img
                  src={activeCollection.image}
                  alt={activeCollection.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-200">
                    {activeCollection.highlight}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold">{activeCollection.title}</h4>
                  <p className="mt-2 text-sm text-white/90">{activeCollection.description}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
