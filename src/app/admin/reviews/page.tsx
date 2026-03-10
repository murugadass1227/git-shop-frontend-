'use client';

import { CheckCheck, MessageSquareQuote, Trash2 } from 'lucide-react';

const reviewActions = [
  {
    title: 'Approve reviews',
    description: 'Publish valid customer reviews so they appear on the storefront.',
    icon: CheckCheck,
  },
  {
    title: 'Delete reviews',
    description: 'Remove spam, abusive or irrelevant review content from the store.',
    icon: Trash2,
  },
];

const sampleReviews = [
  { name: 'Asha', product: 'Couple Name Lamp', status: 'Pending approval' },
  { name: 'Rakesh', product: 'Premium Gift Hamper', status: 'Approved' },
  { name: 'Lavanya', product: 'Photo Frame', status: 'Flagged' },
];

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Review management</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Moderate published customer feedback</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Admin can approve reviews and delete reviews from this dedicated moderation page.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {reviewActions.map((action) => {
          const Icon = action.icon;

          return (
            <section key={action.title} className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <MessageSquareQuote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Review moderation queue</h3>
            <p className="mt-1 text-sm text-slate-500">Sample items waiting for admin action.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {sampleReviews.map((review) => (
            <div key={`${review.name}-${review.product}`} className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
              <p className="text-sm font-semibold text-slate-900">{review.name}</p>
              <p className="mt-1 text-sm text-slate-500">{review.product}</p>
              <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-700">{review.status}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
