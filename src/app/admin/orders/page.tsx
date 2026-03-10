'use client';

import { FileText, ImagePlus, RefreshCcw, ShoppingBag, XCircle } from 'lucide-react';

const orderActions = [
  {
    title: 'View order details',
    description: 'Open line items, payment method, shipping address and fulfillment timeline.',
    icon: ShoppingBag,
  },
  {
    title: 'View customer uploaded images',
    description: 'Check artwork, reference photos and personalization uploads attached to orders.',
    icon: ImagePlus,
  },
  {
    title: 'Update order status',
    description: 'Move orders through pending, packed, shipped, delivered or completed states.',
    icon: RefreshCcw,
  },
  {
    title: 'Generate invoice',
    description: 'Prepare printable invoice records for store operations and customer sharing.',
    icon: FileText,
  },
  {
    title: 'Cancel order',
    description: 'Stop processing and mark eligible orders as cancelled with internal notes.',
    icon: XCircle,
  },
];

const recentOrderRows = [
  { id: 'ORD-240401-1001', customer: 'Keerthana', status: 'Pending', total: '₹3,499' },
  { id: 'ORD-240401-1002', customer: 'Hari', status: 'Packed', total: '₹1,899' },
  { id: 'ORD-240401-1003', customer: 'Ameer', status: 'Shipped', total: '₹4,250' },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Order management</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage order flow, customer uploads and invoicing</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This page covers order details, uploaded customer images, status changes, invoice generation and order cancellation.
        </p>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <h3 className="text-xl font-semibold text-slate-900">Admin actions</h3>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {orderActions.map((action) => {
            const Icon = action.icon;

            return (
              <div key={action.title} className="rounded-[24px] border border-pink-100 bg-pink-50/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{action.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <h3 className="text-xl font-semibold text-slate-900">Sample order queue</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-pink-100 text-slate-500">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrderRows.map((row) => (
                <tr key={row.id} className="border-b border-pink-50 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-slate-900">{row.id}</td>
                  <td className="px-4 py-4 text-slate-600">{row.customer}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">{row.status}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
