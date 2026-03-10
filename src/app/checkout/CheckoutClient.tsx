'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { cartService, type CartItem } from '@/services';
import { RootState } from '@/store/store';

export function CheckoutClient() {
  const router = useRouter();
  const token = useSelector((s: RootState) => s.auth.token);
  const reduxItems = useSelector((s: RootState) => s.cart.items);
  const [mounted, setMounted] = useState(false);
  const [cart, setCartState] = useState<{ items: CartItem[] } | null>(null);
  const [form, setForm] = useState({ address: '', city: '', state: '', pincode: '', phone: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;
    cartService.get().then((c) => setCartState(c)).catch(() => setCartState({ items: [] }));
  }, [mounted, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentItems = (cart?.items?.length ? cart.items : reduxItems);
    if (!token || !currentItems.length) return;
    const { address, city, state, pincode, phone } = form;
    if (!address || !city || !state || !pincode || !phone) {
      alert('Please fill all address fields.');
      return;
    }
    const total = currentItems.reduce((sum, i) => sum + (i.productId as { price?: number })?.price! * i.quantity, 0);
    const checkoutData = {
      shippingAddress: { address, city, state, pincode, phone },
      items: currentItems,
      total,
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('gondget_checkout', JSON.stringify(checkoutData));
    }
    router.push('/payment');
  };

  if (!mounted) {
    return (
      <div className="mt-6 sm:mt-8 rounded-xl border border-pink-200 bg-pink-50/80 p-6 sm:p-8 flex items-center justify-center min-h-[120px]">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mt-6 sm:mt-8 rounded-xl border border-pink-200 bg-pink-50/80 p-6 sm:p-8 text-center animate-fade-scale-in">
        <p className="text-slate-600 text-sm sm:text-base">Please log in to checkout.</p>
        <Link href="/login" className="mt-4 inline-block text-pink-600 font-medium hover:text-pink-700 hover:underline touch-manipulation transition-colors">Login</Link>
      </div>
    );
  }

  const apiItems = cart?.items || [];
  const items = apiItems.length > 0 ? apiItems : reduxItems;
  const total = items.reduce((sum, i) => sum + (i.productId as { price?: number })?.price! * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mt-6 sm:mt-8 rounded-xl border border-pink-200 bg-pink-50/80 p-6 sm:p-8 text-center animate-fade-scale-in">
        <p className="text-slate-600 text-sm sm:text-base">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block text-pink-600 font-medium hover:text-pink-700 hover:underline touch-manipulation transition-colors">Shop gifts</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 lg:grid-cols-2">
      <div className="space-y-3 sm:space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Shipping address</h2>
        <input
          required
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm min-h-[44px] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 outline-none transition-colors"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm min-h-[44px] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 outline-none transition-colors"
          />
          <input
            required
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm min-h-[44px] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 outline-none transition-colors"
          />
        </div>
        <input
          required
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
          className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm min-h-[44px] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 outline-none transition-colors"
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-pink-200 px-3 py-2.5 text-sm min-h-[44px] focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 outline-none transition-colors"
        />
      </div>
      <div>
        <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Order summary</h2>
        <ul className="mt-3 sm:mt-4 space-y-2">
          {items.map((item) => {
            const p = item.productId as { _id: string; name: string; price: number };
            return (
              <li key={p._id} className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="min-w-0 truncate">{p.name} × {item.quantity}</span>
                <span className="shrink-0">₹{p.price * item.quantity}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-base sm:text-lg font-bold">Total: ₹{total}</p>
        <button
          type="submit"
          className="mt-4 sm:mt-6 w-full rounded-lg bg-pink-600 py-3 font-medium text-white hover:bg-pink-700 min-h-[48px] text-sm sm:text-base touch-manipulation hover-lift-3d transition-all duration-300"
        >
          Proceed to payment
        </button>
      </div>
    </form>
  );
}
