'use client';

import { Clock3, MapPinned, Truck } from 'lucide-react';

const deliveryRules = [
  {
    title: 'Product preparation time',
    description: 'Set prep windows per product so custom gifts and ready-stock items ship correctly.',
    value: 'Same day / 1 day / 3 days',
    icon: Clock3,
  },
  {
    title: 'Delivery distance rules',
    description: 'Control serviceability by local radius, city zone or restricted delivery areas.',
    value: '0-5 km, 5-15 km, 15+ km',
    icon: MapPinned,
  },
  {
    title: 'Delivery charges',
    description: 'Apply base delivery fee, long-distance fee or free-shipping thresholds.',
    value: 'Flat, slab, or free over threshold',
    icon: Truck,
  },
];

export default function AdminDeliveryPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Delivery management</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Configure delivery rules for product preparation and shipping</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Admin can define product preparation time, delivery distance rules and delivery charges from this page.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {deliveryRules.map((rule) => {
          const Icon = rule.icon;

          return (
            <section key={rule.title} className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{rule.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{rule.description}</p>
              <div className="mt-4 rounded-2xl bg-pink-50/70 px-4 py-3 text-sm font-medium text-slate-700">{rule.value}</div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
