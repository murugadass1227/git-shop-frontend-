'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  ImagePlus,
  Layers3,
  PackagePlus,
  PencilLine,
  Settings2,
  Tags,
  Trash2,
} from 'lucide-react';

const productSummaryCards = [
  { label: 'Live products', value: '236', tone: 'bg-pink-50 text-pink-600', icon: Layers3 },
  { label: 'Draft products', value: '18', tone: 'bg-amber-50 text-amber-600', icon: PencilLine },
  { label: 'Low stock alerts', value: '12', tone: 'bg-rose-50 text-rose-600', icon: BadgePercent },
  { label: 'Customizable items', value: '74', tone: 'bg-fuchsia-50 text-fuchsia-600', icon: Settings2 },
];

const managementActions = [
  {
    title: 'Add products',
    description: 'Create new gift items with name, description, category and stock details.',
    icon: PackagePlus,
    href: '/admin/add-product',
    cta: 'Open add product',
  },
  {
    title: 'All products',
    description: 'Show every added product in one admin list and quickly search the catalog.',
    icon: Boxes,
    href: '/admin/products/all',
    cta: 'Open all products',
  },
  {
    title: 'Edit products',
    description: 'Update existing product info, featured status, stock and item visibility.',
    icon: PencilLine,
    href: '/admin/products/all',
    cta: 'Open product list',
  },
  {
    title: 'Delete products',
    description: 'Remove discontinued items and clean up outdated catalog entries.',
    icon: Trash2,
    href: '/admin/products/all',
    cta: 'Manage deletions',
  },
  {
    title: 'Upload product images',
    description: 'Attach gallery images, thumbnails and personalization preview assets.',
    icon: ImagePlus,
    href: '/admin/add-product',
    cta: 'Upload images',
  },
  {
    title: 'Set product price',
    description: 'Configure selling price, compare price and offer pricing for products.',
    icon: BadgePercent,
    href: '/admin/products/all',
    cta: 'Update pricing',
  },
  {
    title: 'Add product tags',
    description: 'Assign tags for search, collections, occasions and merchandising filters.',
    icon: Tags,
    href: '/admin/products/all',
    cta: 'Manage tags',
  },
  {
    title: 'Define customization fields',
    description: 'Add text, photo, engraving and gift note inputs for personalized items.',
    icon: Settings2,
    href: '/admin/add-product',
    cta: 'Setup fields',
  },
];

const customizationExamples = [
  'Name engraving',
  'Photo upload',
  'Gift note',
  'Color selection',
  'Packaging preference',
  'Date / occasion input',
];

export default function AdminProductManagementPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Product management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Dedicated product control page for admin operations</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This page is specifically for product management. Admin can add, edit, delete products, upload product images, set price, add tags and define customization fields from here.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/admin/add-product"
              className="inline-flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
            >
              Add new product
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/products/all"
              className="inline-flex items-center justify-between rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-medium text-pink-700"
            >
              All products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {productSummaryCards.map((card) => {
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

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Admin can manage these product operations</h3>
            <p className="mt-1 text-sm text-slate-500">Each requested product-management action now has its own card on this page.</p>
          </div>
          <div className="rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
            8 actions
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {managementActions.map((action) => {
            const Icon = action.icon;

            return (
              <div key={action.title} className="rounded-[24px] border border-pink-100 bg-pink-50/40 p-5">
                <div className="flex items-start justify-between gap-3">
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

                <div className="mt-5">
                  <Link
                    href={action.href}
                    className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                  >
                    {action.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
          <h3 className="text-xl font-semibold text-slate-900">Customization fields setup</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Personalized products need flexible input options. Use this area to define the kind of custom fields available per product.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {customizationExamples.map((item) => (
              <div key={item} className="rounded-2xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-pink-100 bg-slate-900 p-6 text-white shadow-[0_18px_50px_-35px_rgba(15,23,42,0.85)]">
          <h3 className="text-xl font-semibold">Quick admin workflow</h3>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
            <p>1. Add the product with title, description, category and stock details.</p>
            <p>2. Upload product images, assign tags and set the selling price.</p>
            <p>3. Enable customization fields for personalized gift items.</p>
            <p>4. Edit or delete products later from the product list page.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
