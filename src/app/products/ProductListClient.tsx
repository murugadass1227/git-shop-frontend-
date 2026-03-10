'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/lib/api';
import { RootState } from '@/store/store';
import { setWishlist } from '@/store/wishlistSlice';
import { wishlistService, wishlistResponseToItems } from '@/services/wishlistService';

type Data = { items: Product[]; total: number; page: number; totalPages: number };

export function ProductListClient({
  initialData,
  categories,
  occasions,
  currentCategory,
  currentOccasion,
  currentSearch,
  currentSort,
  currentCustomizable,
  currentMinPrice,
  currentMaxPrice,
  currentPage,
}: {
  initialData: Data;
  categories: string[];
  occasions: string[];
  currentCategory?: string;
  currentOccasion?: string;
  currentSearch?: string;
  currentSort?: string;
  currentCustomizable?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);

  const handleWishlistToggle = async (product: Product) => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent('/products'));
      return;
    }
    const inWishlist = wishlistItems.some((i) => i.id === product._id);
    try {
      if (inWishlist) {
        const res = await wishlistService.removeItem(product._id);
        dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
      } else {
        const res = await wishlistService.addItem(product._id);
        dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
      }
    } catch {
      /* wishlist API error */
    }
  };

  const setParam = (key: string, value: string | undefined) => {
    const p = new URLSearchParams(searchParams?.toString() || '');
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    router.push(`/products?${p}`);
  };

  return (
    <>
      <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500 w-full sm:w-auto">Category</span>
          <button
            onClick={() => setParam('category', undefined)}
            className={`premium-pill px-3.5 sm:px-4 py-2 text-xs sm:text-sm touch-manipulation ${!currentCategory ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setParam('category', c)}
              className={`premium-pill px-3.5 sm:px-4 py-2 text-xs sm:text-sm touch-manipulation ${currentCategory === c ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'}`}
            >
              {c}
            </button>
          ))}
        </div>
        {occasions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500 w-full sm:w-auto">Occasion</span>
            <button
              onClick={() => setParam('occasion', undefined)}
              className={`premium-pill px-3.5 sm:px-4 py-2 text-xs sm:text-sm touch-manipulation ${!currentOccasion ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'}`}
            >
              All
            </button>
            {occasions.map((o) => (
              <button
                key={o}
                onClick={() => setParam('occasion', o)}
                className={`premium-pill px-3.5 sm:px-4 py-2 text-xs sm:text-sm touch-manipulation ${currentOccasion === o ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'}`}
              >
                {o}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500 w-full sm:w-auto">Style</span>
          <button
            onClick={() => setParam('customizable', undefined)}
            className={`premium-pill px-3.5 sm:px-4 py-2 text-xs sm:text-sm touch-manipulation ${
              currentCustomizable !== 'true'
                ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setParam('customizable', 'true')}
            className={`premium-pill px-3.5 sm:px-4 py-2 text-xs sm:text-sm touch-manipulation ${
              currentCustomizable === 'true'
                ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-rose-50/50'
            }`}
          >
            Personalized only
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500">Price</label>
            <input
              type="number"
              placeholder="Min"
              value={currentMinPrice ?? ''}
              onChange={(e) => setParam('minPrice', e.target.value || undefined)}
              className="premium-input w-20 sm:w-24 px-3 py-2 text-xs sm:text-sm min-h-[38px] bg-white"
            />
            <span className="text-slate-400 font-medium">–</span>
            <input
              type="number"
              placeholder="Max"
              value={currentMaxPrice ?? ''}
              onChange={(e) => setParam('maxPrice', e.target.value || undefined)}
              className="premium-input w-20 sm:w-24 px-3 py-2 text-xs sm:text-sm min-h-[38px] bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500">Sort</label>
            <select
              value={currentSort || ''}
              onChange={(e) => setParam('sort', e.target.value || undefined)}
              className="premium-input px-3 sm:px-4 py-2 text-xs sm:text-sm min-h-[38px] bg-white min-w-[140px]"
            >
              <option value="">Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>
      </div>

      {currentSearch && (
        <p className="mt-4 text-sm text-slate-600 font-medium">
          Search: &quot;{currentSearch}&quot; — {initialData.total} result{initialData.total !== 1 ? 's' : ''}
        </p>
      )}

      {initialData.items.length === 0 ? (
        <div className="mt-10 sm:mt-12 text-center px-4 py-12 rounded-2xl bg-slate-50/80 border border-slate-100">
          <p className="text-slate-600 text-sm sm:text-base">No products found. Try changing filters or run backend seed.</p>
        </div>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {initialData.items.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              inWishlist={wishlistItems.some((i) => i.id === p._id)}
              onWishlistClick={handleWishlistToggle}
            />
          ))}
        </div>
      )}

      {initialData.totalPages > 1 && (
        <div className="mt-8 sm:mt-10 flex flex-wrap justify-center items-center gap-3">
          {currentPage > 1 && (
            <button
              onClick={() => {
                const p = new URLSearchParams(searchParams?.toString() || '');
                p.set('page', String(currentPage - 1));
                router.push(`/products?${p}`);
              }}
              className="premium-pill premium-input px-4 sm:px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-rose-50 hover:border-rose-200 touch-manipulation min-h-[44px] border bg-white"
            >
              Previous
            </button>
          )}
          <span className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-600">
            Page {currentPage} of {initialData.totalPages}
          </span>
          {currentPage < initialData.totalPages && (
            <button
              onClick={() => {
                const p = new URLSearchParams(searchParams?.toString() || '');
                p.set('page', String(currentPage + 1));
                router.push(`/products?${p}`);
              }}
              className="premium-pill premium-input px-4 sm:px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-rose-50 hover:border-rose-200 touch-manipulation min-h-[44px] border bg-white"
            >
              Next
            </button>
          )}
        </div>
      )}
    </>
  );
}
