'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react';
import { adminService, type DashboardStats } from '@/services/adminService';

const previewStats: DashboardStats = {
  totalOrders: 128,
  totalRevenue: 284500,
  totalUsers: 864,
  totalProducts: 236,
  recentOrders: [
    {
      id: 'ORD-240318-1001',
      total: 3499,
      status: 'Packed',
      paymentStatus: 'Paid',
      createdAt: '2026-03-08T10:30:00.000Z',
      itemCount: 3,
    },
    {
      id: 'ORD-240318-1002',
      total: 1899,
      status: 'Out for delivery',
      paymentStatus: 'Paid',
      createdAt: '2026-03-08T13:20:00.000Z',
      itemCount: 1,
    },
    {
      id: 'ORD-240318-1003',
      total: 2599,
      status: 'Awaiting custom preview',
      paymentStatus: 'Pending',
      createdAt: '2026-03-08T16:45:00.000Z',
      itemCount: 2,
    },
    {
      id: 'ORD-240318-1004',
      total: 4999,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: '2026-03-09T09:15:00.000Z',
      itemCount: 4,
    },
  ],
};

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(value?: string) {
  if (!value) return 'Today';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes('paid') || normalized.includes('delivery')) return 'bg-emerald-50 text-emerald-700';
  if (normalized.includes('pending') || normalized.includes('awaiting')) return 'bg-amber-50 text-amber-700';
  if (normalized.includes('packed') || normalized.includes('confirmed')) return 'bg-pink-50 text-pink-700';
  return 'bg-slate-100 text-slate-700';
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(previewStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getDashboard()
      .then((data) =>
        setStats({
          ...previewStats,
          ...data,
          recentOrders: data.recentOrders?.length ? data.recentOrders : previewStats.recentOrders,
        })
      )
      .catch(() => setError('Live dashboard data is unavailable right now. Preview values are shown for the UI.'))
      .finally(() => setLoading(false));
  }, []);

  const averageOrderValue = stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;
  const paidOrders = stats.recentOrders.filter((order) => order.paymentStatus.toLowerCase() === 'paid').length;
  const pendingOrders = stats.recentOrders.filter((order) => !order.paymentStatus.toLowerCase().includes('paid')).length;
  const fulfillmentOrders = stats.recentOrders.filter((order) =>
    ['packed', 'confirmed', 'out for delivery'].some((state) => order.status.toLowerCase().includes(state))
  ).length;

  const summaryCards = [
    {
      label: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      note: 'Gross sales',
      icon: CircleDollarSign,
      tone: 'from-pink-500 to-rose-400',
      surface: 'bg-pink-50 text-pink-600',
    },
    {
      label: 'Orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      note: 'Total orders',
      icon: ShoppingBag,
      tone: 'from-violet-500 to-fuchsia-400',
      surface: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Customers',
      value: stats.totalUsers.toLocaleString('en-IN'),
      note: 'Registered users',
      icon: Users,
      tone: 'from-amber-500 to-orange-400',
      surface: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Products',
      value: stats.totalProducts.toLocaleString('en-IN'),
      note: 'Live catalog',
      icon: Package,
      tone: 'from-emerald-500 to-teal-400',
      surface: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const trendData = useMemo(() => {
    const base = Math.max(Math.round(stats.totalRevenue / 7), 1200);
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
      const recent = stats.recentOrders[index % Math.max(stats.recentOrders.length, 1)];
      const fallbackBoost = (index + 1) * 180;
      const value = Math.max(base + (recent?.total ?? fallbackBoost) - index * 120, 800);
      return { day, value };
    });
  }, [stats]);

  const trendPoints = useMemo(() => {
    const max = Math.max(...trendData.map((item) => item.value), 1);
    return trendData
      .map((item, index) => {
        const x = (index / Math.max(trendData.length - 1, 1)) * 100;
        const y = 100 - (item.value / max) * 78;
        return `${x},${y}`;
      })
      .join(' ');
  }, [trendData]);

  const trendAreaPoints = useMemo(() => `0,100 ${trendPoints} 100,100`, [trendPoints]);

  const moduleCards = [
    {
      title: 'Product management',
      value: `${stats.totalProducts} items`,
      href: '/admin/products',
      icon: Package,
      tone: 'from-pink-500 to-rose-400',
    },
    {
      title: 'Category management',
      value: 'Live category view',
      href: '/admin/categories',
      icon: Boxes,
      tone: 'from-rose-500 to-orange-400',
    },
    {
      title: 'User management',
      value: `${stats.totalUsers} accounts`,
      href: '/admin/users',
      icon: UserCog,
      tone: 'from-violet-500 to-fuchsia-400',
    },
    {
      title: 'All products',
      value: 'Edit catalog',
      href: '/admin/products/all',
      icon: Sparkles,
      tone: 'from-slate-900 to-slate-700',
    },
  ];

  const orderFlow = [
    { label: 'Paid', value: paidOrders, color: 'bg-emerald-400' },
    { label: 'Pending', value: pendingOrders, color: 'bg-amber-400' },
    { label: 'Fulfillment', value: fulfillmentOrders, color: 'bg-pink-400' },
  ];
  const orderFlowMax = Math.max(...orderFlow.map((item) => item.value), 1);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/80 p-6 shadow-[0_20px_70px_-35px_rgba(244,114,182,0.45)]">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">Admin overview</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Store performance in one polished workspace</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">Minimal dashboard, premium cards and quick control panels aligned with the sidebar UI.</p>

            {error && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div key={card.label} className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{card.note}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.surface}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${card.tone}`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-pink-100/80 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Quick actions</p>
                <p className="mt-1 text-sm text-slate-500">{loading ? 'Refreshing dashboard...' : 'Live workspace ready'}</p>
              </div>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">Today</span>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                href="/admin/add-product"
                className="inline-flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Add new product
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/products/all"
                className="inline-flex items-center justify-between rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
              >
                Open all products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/categories"
                className="inline-flex items-center justify-between rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
              >
                Category insights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-pink-50 px-3 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-pink-500">AOV</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(averageOrderValue)}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 px-3 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Paid</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{paidOrders}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 px-3 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-violet-500">Pending</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Revenue trend</h3>
              <p className="mt-1 text-sm text-slate-500">Weekly sales pulse</p>
            </div>
            <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
              <TrendingUp className="mr-2 inline h-4 w-4" />
              +12.4%
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-gradient-to-br from-[#fff7fb] to-[#fff0f5] p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-pink-500">Current revenue</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">7 day average</p>
                <p className="mt-2 text-lg font-semibold text-slate-700">{formatCurrency(Math.round(stats.totalRevenue / 7))}</p>
              </div>
            </div>

            <div className="mt-6 h-56">
              <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="dashboardAreaFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#f472b6" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                {[20, 40, 60, 80].map((line) => (
                  <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="#fbcfe8" strokeDasharray="2 3" strokeWidth="0.6" />
                ))}
                <polygon points={trendAreaPoints} fill="url(#dashboardAreaFill)" />
                <polyline
                  points={trendPoints}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2">
              {trendData.map((item) => (
                <div key={item.day} className="rounded-2xl bg-white/75 px-2 py-3 text-center">
                  <p className="text-xs font-semibold text-slate-400">{item.day}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{Math.round(item.value / 1000)}k</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Order flow</h3>
            <p className="mt-1 text-sm text-slate-500">Payment and fulfillment snapshot</p>
          </div>

          <div className="mt-6 space-y-4">
            {orderFlow.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className={`h-3 rounded-full ${item.color}`}
                    style={{ width: `${Math.max((item.value / orderFlowMax) * 100, item.value > 0 ? 16 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-pink-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-pink-500">Conversion</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">68%</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-500">Repeat</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">31%</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Admin modules</h3>
              <p className="mt-1 text-sm text-slate-500">Sidebar-matched shortcuts</p>
            </div>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">Core panels</span>
          </div>

          <div className="mt-5 grid gap-3">
            {moduleCards.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center justify-between rounded-[24px] border border-pink-100 bg-pink-50/45 px-4 py-4 transition hover:border-pink-200 hover:bg-pink-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.value}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-pink-500" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Recent orders</h3>
              <p className="mt-1 text-sm text-slate-500">Compact live order list</p>
            </div>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              {stats.recentOrders.length} items
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="rounded-[24px] border border-pink-100 bg-pink-50/35 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.itemCount} items • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-900">{formatCurrency(order.total)}</p>
                    <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
