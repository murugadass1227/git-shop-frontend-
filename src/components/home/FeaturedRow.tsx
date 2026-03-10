import Link from 'next/link';
import type { Product } from '@/lib/api';
import { Gift } from 'lucide-react';

export function FeaturedRow({ products, categories }: { products: Product[]; categories: string[] }) {
  const items = products.length > 0 ? products : categories.map((c) => ({ _id: c, name: c, price: 0, category: c, images: [], description: '', customizable: false, occasions: [] } as Product & { _id: string }));

  return (
    <section className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          Featured & Categories
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {items.slice(0, 8).map((item) => {
            const isCategory = !item.price && 'category' in item && item._id === item.category;
            const href = isCategory ? `/products?category=${encodeURIComponent(item.name)}` : `/products/${item._id}`;
            const image = item.images?.[0];
            return (
              <Link
                key={item._id}
                href={href}
                className="group flex flex-col items-center"
              >
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50 transition group-hover:border-violet-300 group-hover:bg-violet-50 sm:h-28 sm:w-28">
                  {image ? (
                    <img src={image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <Gift className="h-10 w-10 text-slate-400 group-hover:text-violet-400 sm:h-12 sm:w-12" />
                  )}
                </div>
                <span className="mt-2 max-w-[100px] truncate text-center text-sm font-medium text-slate-700 group-hover:text-violet-600">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
