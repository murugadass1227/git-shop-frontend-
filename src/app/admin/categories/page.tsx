'use client';

import { useEffect, useMemo, useState } from 'react';
import { Boxes, Package, RefreshCcw, Sparkles, Tag } from 'lucide-react';
import { adminService, type AdminCategoryRecord } from '@/services/adminService';

const previewCategories: AdminCategoryRecord[] = [
  {
    category: 'Birthday gifts',
    productCount: 8,
    customizableCount: 5,
    averagePrice: 899,
    latestUpdatedAt: '2026-03-09T09:00:00.000Z',
    sampleProducts: ['Photo mug', 'LED frame', 'Memory box', 'Name keychain'],
  },
  {
    category: 'Anniversary gifts',
    productCount: 6,
    customizableCount: 4,
    averagePrice: 1249,
    latestUpdatedAt: '2026-03-08T14:30:00.000Z',
    sampleProducts: ['Couple lamp', 'Scrapbook', 'Heart cushion'],
  },
  {
    category: 'Festival hampers',
    productCount: 4,
    customizableCount: 1,
    averagePrice: 1499,
    latestUpdatedAt: '2026-03-07T12:00:00.000Z',
    sampleProducts: ['Diwali hamper', 'Sweet combo', 'Dry fruits basket'],
  },
];

function formatDate(value?: string) {
  if (!value) return 'No updates yet';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategoryRecord[]>(previewCategories);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await adminService.getCategories();
      setCategories(data.categories);
      setError('');
    } catch {
      setError('Live category data is unavailable right now. Preview values are shown for the UI.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const totalProducts = categories.reduce((sum, item) => sum + item.productCount, 0);
    const customizableProducts = categories.reduce((sum, item) => sum + item.customizableCount, 0);
    const busiestCategory = [...categories].sort((a, b) => b.productCount - a.productCount)[0];

    return {
      totalCategories,
      totalProducts,
      customizableProducts,
      busiestCategory: busiestCategory?.category ?? 'No categories yet',
    };
  }, [categories]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Category management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Real-time category wise product overview</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This page fetches live admin category data and shows which products are available inside each category, along with count, average price and customizable items.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadCategories(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh categories'}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total categories</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalCategories}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <Boxes className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total products</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalProducts}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Customizable products</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.customizableProducts}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Top category</p>
                <p className="mt-2 truncate text-2xl font-semibold text-slate-900">{stats.busiestCategory}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Category list</h3>
            <p className="mt-1 text-sm text-slate-500">Real-time categories with product names fetched from the admin API.</p>
          </div>
          <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
            {loading ? 'Loading categories...' : `${categories.length} categories`}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {categories.map((item) => (
            <article key={item.category} className="rounded-[24px] border border-pink-100 bg-pink-50/35 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{item.category}</h4>
                  <p className="mt-1 text-sm text-slate-500">Updated {formatDate(item.latestUpdatedAt)}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-pink-700">
                  {item.productCount} products
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Customizable</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.customizableCount}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average price</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(item.averagePrice)}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preview items</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.sampleProducts.length}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700">Products in this category</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.sampleProducts.length > 0 ? (
                    item.sampleProducts.map((productName) => (
                      <span key={`${item.category}-${productName}`} className="rounded-full bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                        {productName}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">No products available</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
