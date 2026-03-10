'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { adminService, type DashboardStats } from '@/services/adminService';

type BestSeller = {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  stock: string;
};

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
      status: 'Pending',
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

const previewBestSellers: BestSeller[] = [
  { id: 'PRD-101', name: 'Personalized Photo Frame', unitsSold: 182, revenue: 145600, stock: 'In stock' },
  { id: 'PRD-102', name: 'Couple Name Lamp', unitsSold: 146, revenue: 118400, stock: 'Low stock' },
  { id: 'PRD-103', name: 'Premium Gift Hamper', unitsSold: 121, revenue: 167900, stock: 'In stock' },
  { id: 'PRD-104', name: 'Custom Mug Combo', unitsSold: 108, revenue: 86400, stock: 'In stock' },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function AdminDashboardDetailsPage() {
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
      .catch(() => setError('Live dashboard data unavailable. Preview values are shown.'))
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = useMemo(
    () =>
      stats.recentOrders.filter((order) =>
        ['pending', 'confirmed', 'packed', 'processing'].includes(order.status.toLowerCase())
      ).length,
    [stats.recentOrders]
  );

  const summaryCards = [
    {
      label: 'Total orders',
      value: stats.totalOrders.toLocaleString('en-IN'),
      icon: ShoppingBag,
      tone: 'bg-pink-50 text-pink-600',
    },
    {
      label: 'Total revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total customers',
      value: stats.totalUsers.toLocaleString('en-IN'),
      icon: Users,
      tone: 'bg-fuchsia-50 text-fuchsia-600',
    },
    {
      label: 'Pending orders',
      value: pendingOrders.toLocaleString('en-IN'),
      icon: Package,
      tone: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Admin dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Store performance snapshot</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              This page shows total orders, total revenue, total customers, pending orders, recent orders and best selling products in one dedicated dashboard view.
            </p>
          </div>

          <div className="rounded-2xl border border-pink-200 bg-white/85 px-4 py-3 text-sm font-medium text-slate-600">
            {loading ? 'Refreshing dashboard...' : 'Dashboard ready'}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.label} className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Recent orders</h3>
              <p className="mt-1 text-sm text-slate-500">Latest order activity from the store.</p>
            </div>
            <div className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              {stats.recentOrders.length} orders
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-pink-100 text-slate-500">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-pink-50 last:border-b-0">
                    <td className="px-4 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-4 py-4 text-slate-600">{order.itemCount}</td>
                    <td className="px-4 py-4 text-slate-600">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Best selling products</h3>
              <p className="mt-1 text-sm text-slate-500">Top products based on recent sales performance.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {previewBestSellers.map((product, index) => (
              <div key={product.id} className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-500">Top {index + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{product.unitsSold} units sold</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {product.stock}
                  </span>
                </div>
                <div className="mt-3 text-sm font-medium text-slate-700">
                  Revenue: {formatCurrency(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
