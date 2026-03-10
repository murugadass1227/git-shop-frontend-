'use client';

import Link from 'next/link';
import { ArrowRight, FileImage, ImagePlus, ListFilter, Type, CircleDot } from 'lucide-react';

const supportedFields = [
  {
    title: 'Text field',
    description: 'Collect names, gift notes, engraving content and short personalized messages.',
    icon: Type,
  },
  {
    title: 'Dropdown field',
    description: 'Let customers select options like size, color theme, packaging or style.',
    icon: ListFilter,
  },
  {
    title: 'Radio button field',
    description: 'Allow a single clear choice for finish, urgency, gender or occasion type.',
    icon: CircleDot,
  },
  {
    title: 'File upload field',
    description: 'Accept one photo, logo or artwork file for personalized gift products.',
    icon: FileImage,
  },
  {
    title: 'Multiple image upload field',
    description: 'Collect multiple reference images for collages, albums and memory products.',
    icon: ImagePlus,
  },
];

const setupSteps = [
  'Select the product that needs customization.',
  'Choose the supported field type.',
  'Set label, placeholder, validation and required status.',
  'Preview the customer form before publishing.',
];

export default function AdminCustomizationFieldsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Customization field management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create product-wise input fields for personalized orders</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Admin can create customization inputs for each product from this page. Supported field types are text, dropdown, radio button, file upload and multiple image upload.
            </p>
          </div>

          <Link href="/admin/add-product" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
            Assign fields to product
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <h3 className="text-xl font-semibold text-slate-900">Supported fields</h3>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {supportedFields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.title} className="rounded-[24px] border border-pink-100 bg-pink-50/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{field.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{field.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-slate-900 p-6 text-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.85)]">
        <h3 className="text-xl font-semibold">Admin flow</h3>
        <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
          {setupSteps.map((step, index) => (
            <p key={step}>{index + 1}. {step}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
