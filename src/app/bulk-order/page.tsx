'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faEnvelope, faPhone, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BulkOrderPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-pink-50/70 via-white to-rose-50/40">
      <div className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-4 sm:py-12">
        <div className="rounded-[2rem] border border-rose-100 bg-white/90 p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              <FontAwesomeIcon icon={faBoxOpen} className="h-3.5 w-3.5" />
              Bulk Order
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-4xl">Corporate, event and return gift orders made easy.</h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Share your quantity, budget and timeline. Our team will help you shortlist personalized gifts for teams,
              clients, weddings and special occasions.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:+918010997070"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
              >
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                Call sales team
              </a>
              <a
                href="mailto:support@gondget.com?subject=Bulk%20Order%20Enquiry"
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
              >
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                Email enquiry
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Corporate gifting', text: 'Employee kits, festive hampers and client appreciation gifts.', icon: faUsers },
            { title: 'Event return gifts', text: 'Wedding, birthday and celebration favors in larger quantities.', icon: faBoxOpen },
            { title: 'Custom branding', text: 'Add logos, names, messages and packaging preferences.', icon: faEnvelope },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-rose-100 bg-white/90 p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[2rem] border border-rose-100 bg-white/95 p-6 shadow-sm sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Tell us what you need</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Fill this quick form and our team will get back with suitable gift options and pricing.
            </p>
          </div>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-6 text-center">
              <p className="text-base font-semibold text-emerald-700">Bulk order enquiry received.</p>
              <p className="mt-2 text-sm text-emerald-700/80">Our team will contact you soon with the next steps.</p>
              <Button asChild className="mt-4 bg-rose-500 hover:bg-rose-600">
                <Link href="/products">Browse products meanwhile</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="bulk-name">Name</Label>
                  <Input id="bulk-name" placeholder="Your name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bulk-phone">Phone</Label>
                  <Input id="bulk-phone" type="tel" placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="bulk-email">Email</Label>
                  <Input id="bulk-email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bulk-quantity">Approx quantity</Label>
                  <Input id="bulk-quantity" type="number" min="10" placeholder="e.g. 100" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bulk-note">Requirements</Label>
                <textarea
                  id="bulk-note"
                  rows={5}
                  required
                  placeholder="Tell us about the occasion, budget, preferred products or customization needs."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
                  Submit enquiry
                </Button>
                <span className="text-xs text-slate-500 sm:text-sm">Sales support: (+91) 8010 99 7070</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
