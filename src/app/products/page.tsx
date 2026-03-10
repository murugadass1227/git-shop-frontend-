import { Suspense } from 'react';
import { productService, type Product } from '@/services/productService';
import { ProductListClient } from './ProductListClient';
import { AddProductLink } from '@/components/AddProductLink';

type Props = {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    occasion?: string;
    customizable?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

type ListData = { items: Product[]; total: number; page: number; totalPages: number };
const emptyListData: ListData = { items: [], total: 0, page: 1, totalPages: 0 };

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  let data = emptyListData;
  let categories: string[] = [];
  let occasions: string[] = [];
  try {
    const [listRes, cats, occs] = await Promise.all([
      productService.list({
        category: params.category,
        search: params.search,
        sort: params.sort || undefined,
        page: params.page ? parseInt(params.page, 10) : undefined,
        occasion: params.occasion,
        customizable: params.customizable === 'true',
        minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
      }).catch(() => emptyListData),
      productService.categories().catch(() => []),
      productService.occasions().catch(() => []),
    ]);
    data = listRes;
    categories = cats;
    occasions = occs;
  } catch {
    // Backend may be down (ECONNREFUSED) – show empty state
  }

  const title = params.search
    ? `Search: "${params.search}"`
    : params.category
      ? params.category
      : params.occasion
        ? `${params.occasion} Gifts`
        : params.customizable === 'true'
          ? 'Personalized Gifts'
      : 'Shop';
  const subtitle = params.search
    ? `${data.total} result${data.total !== 1 ? 's' : ''}`
    : 'Filter by category, occasion, price. Find your perfect personalised gift.';

  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 py-8 sm:py-10 overflow-x-hidden min-h-screen bg-gradient-to-b from-[#fef7f5] via-[#fdf4f2] to-white">
      <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-rose-500/90 font-medium">Gift Shop</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words tracking-tight">{title}</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600/90 max-w-xl">{subtitle}</p>
        </div>
        <AddProductLink />
      </div>

      <Suspense fallback={<p className="text-slate-500 text-sm mt-6 animate-pulse">Loading products...</p>}>
        <ProductListClient
          initialData={data}
          categories={categories}
          occasions={occasions}
          currentCategory={params.category}
          currentOccasion={params.occasion}
          currentSearch={params.search}
          currentSort={params.sort}
          currentCustomizable={params.customizable}
          currentMinPrice={params.minPrice}
          currentMaxPrice={params.maxPrice}
          currentPage={params.page ? parseInt(params.page, 10) : 1}
        />
      </Suspense>
    </div>
  );
}
