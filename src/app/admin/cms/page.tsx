'use client';

import { FilePenLine, Shield, ScrollText, Undo2 } from 'lucide-react';

const editablePages = [
  { title: 'About us', description: 'Brand story, mission, values and company overview.', icon: FilePenLine },
  { title: 'Privacy policy', description: 'Data handling, consent and privacy information.', icon: Shield },
  { title: 'Terms and conditions', description: 'Usage terms, policies and service rules.', icon: ScrollText },
  { title: 'Refund policy', description: 'Return eligibility, refund flow and timelines.', icon: Undo2 },
];

export default function AdminCmsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">CMS management</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Edit store content and policy pages</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Editable pages include About us, Privacy policy, Terms and conditions and Refund policy.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {editablePages.map((page) => {
          const Icon = page.icon;

          return (
            <section key={page.title} className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{page.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
