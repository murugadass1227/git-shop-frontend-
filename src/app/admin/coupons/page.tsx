'use client';

import { BadgePercent, Gift, PackageOpen } from 'lucide-react';

const couponTypes = [
  {
    title: 'Discount codes',
    description: 'Create promo codes for flat or percentage-based discounts.',
    icon: BadgePercent,
    sample: 'WELCOME10, GIFT200',
  },
  {
    title: 'Festival offers',
    description: 'Launch Diwali, New Year, Valentine or seasonal campaign offers.',
    icon: Gift,
    sample: 'FESTIVE15, LOVE25',
  },
  {
    title: 'Bulk order discounts',
    description: 'Offer special pricing for bulk gifting and corporate orders.',
    icon: PackageOpen,
    sample: 'BULK500, CORPORATE20',
  },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Coupon system</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create promo campaigns and offer rules</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Admin can create discount codes, festival offers and bulk order discounts from this page.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {couponTypes.map((item) => {
          const Icon = item.icon;

          return (
            <section key={item.title} className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              <div className="mt-4 rounded-2xl bg-pink-50/70 px-4 py-3 text-sm font-medium text-slate-700">{item.sample}</div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
