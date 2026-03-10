'use client';

import { History, Mail, Phone, Users } from 'lucide-react';

const customerFeatures = [
  {
    title: 'View customers',
    description: 'See registered users, loyalty status and active customer segments.',
    icon: Users,
  },
  {
    title: 'View order history',
    description: 'Check previous orders, repeat purchases and customer buying patterns.',
    icon: History,
  },
  {
    title: 'Contact details',
    description: 'Access email, phone number and communication details for follow-ups.',
    icon: Phone,
  },
];

const sampleCustomers = [
  { name: 'Nivetha R', orders: '12 orders', email: 'nivetha@example.com', phone: '+91 98765 43210' },
  { name: 'Pranav K', orders: '7 orders', email: 'pranav@example.com', phone: '+91 98765 12345' },
  { name: 'Sana F', orders: '4 orders', email: 'sana@example.com', phone: '+91 91234 56789' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">Customer management</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Customer overview, order history and contact details</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Admin can view customers, inspect order history and access contact details from this dedicated page.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {customerFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <section key={feature.title} className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </section>
          );
        })}
      </div>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <h3 className="text-xl font-semibold text-slate-900">Customer list preview</h3>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {sampleCustomers.map((customer) => (
            <div key={customer.email} className="rounded-[24px] border border-pink-100 bg-pink-50/50 p-5">
              <p className="text-lg font-semibold text-slate-900">{customer.name}</p>
              <p className="mt-2 text-sm text-slate-500">{customer.orders}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-500" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-pink-500" />
                  {customer.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
