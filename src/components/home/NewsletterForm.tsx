'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to API
    setEmail('');
  };

  return (
    <section className="border-t border-slate-200 bg-violet-600 py-8 sm:py-10 text-white overflow-x-hidden">
      <div className="mx-auto w-full max-w-xl px-3 sm:px-4 text-center">
        <h2 className="text-lg sm:text-xl font-bold">Subscribe to our newsletter</h2>
        <p className="mt-2 text-violet-100 text-sm sm:text-base">Get offers and gift ideas in your inbox.</p>
        <form className="mt-4 sm:mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border-0 px-4 py-2.5 sm:py-3 text-slate-800 placeholder:text-slate-400 text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
          />
          <button type="submit" className="rounded-lg bg-white px-5 sm:px-6 py-2.5 sm:py-3 font-medium text-violet-600 hover:bg-violet-50 text-sm sm:text-base min-h-[44px] touch-manipulation shrink-0">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
