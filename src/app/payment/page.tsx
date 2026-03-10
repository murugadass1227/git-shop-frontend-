'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { orderService } from '@/services/orderService';
import { setCart, clearCart } from '@/store/cartSlice';
import { RootState } from '@/store/store';
import type { CartItem } from '@/services/cartService';
import type { ShippingAddress } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faWallet, faMoneyBillWave, faLock } from '@fortawesome/free-solid-svg-icons';

const CHECKOUT_KEY = 'gondget_checkout';

type CheckoutData = {
  shippingAddress: ShippingAddress;
  items: CartItem[];
  total: number;
};

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const [data, setData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;
    try {
      const raw = sessionStorage.getItem(CHECKOUT_KEY);
      if (!raw) {
        router.replace('/checkout');
        return;
      }
      setData(JSON.parse(raw) as CheckoutData);
    } catch {
      router.replace('/checkout');
    }
  }, [mounted, token, router]);

  useEffect(() => {
    if (mounted && !token) {
      router.replace('/register');
    }
  }, [mounted, token, router]);

  const handlePay = async () => {
    if (!data || !token) return;
    setLoading(true);
    try {
      await orderService.create(data.shippingAddress);
      dispatch(clearCart());
      if (typeof window !== 'undefined') sessionStorage.removeItem(CHECKOUT_KEY);
      router.push('/account?order=success');
    } catch (err) {
      alert((err as Error).message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { shippingAddress, items, total } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Link href="/checkout" className="text-pink-600 hover:text-pink-700 hover:underline transition-colors">Checkout</Link>
          <span>/</span>
          <span className="font-medium text-slate-800">Payment</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Payment</h1>

        <div className="space-y-6">
          {/* Order summary */}
          <div className="rounded-xl border border-pink-200/80 bg-white p-4 sm:p-6 shadow-sm hover-lift-3d transition-all duration-300">
            <h2 className="font-semibold text-slate-800 mb-3">Order summary</h2>
            <ul className="space-y-2">
              {items.map((item) => {
                const p = item.productId as { _id: string; name: string; price: number };
                return (
                  <li key={p._id} className="flex justify-between text-sm gap-2">
                    <span className="min-w-0 truncate">{p.name} × {item.quantity}</span>
                    <span className="shrink-0">₹{p.price * item.quantity}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 pt-3 border-t border-pink-100 text-base font-bold text-slate-800">Total: ₹{total}</p>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl border border-pink-200/80 bg-white p-4 sm:p-6 shadow-sm hover-lift-3d transition-all duration-300">
            <h2 className="font-semibold text-slate-800 mb-2">Delivery to</h2>
            <p className="text-sm text-slate-600">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
              <br />
              Phone: {shippingAddress.phone}
            </p>
          </div>

          {/* Payment method */}
          <div className="rounded-xl border border-pink-200/80 bg-white p-4 sm:p-6 shadow-sm hover-lift-3d transition-all duration-300">
            <h2 className="font-semibold text-slate-800 mb-4">Select payment method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-pink-600 bg-pink-50' : 'border-pink-200 hover:border-pink-300'}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5 text-pink-600" />
                <span className="font-medium text-slate-800">Card (Credit / Debit)</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-pink-600 bg-pink-50' : 'border-pink-200 hover:border-pink-300'}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="sr-only" />
                <FontAwesomeIcon icon={faWallet} className="h-5 w-5 text-pink-600" />
                <span className="font-medium text-slate-800">UPI</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-pink-600 bg-pink-50' : 'border-pink-200 hover:border-pink-300'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                <FontAwesomeIcon icon={faMoneyBillWave} className="h-5 w-5 text-pink-600" />
                <span className="font-medium text-slate-800">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>

          {/* Pay button */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-50 min-h-[48px] text-sm sm:text-base touch-manipulation"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                  Pay ₹{total}
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
              <FontAwesomeIcon icon={faLock} className="h-3 w-3" /> Secure payment
            </p>
          </div>

          <p className="text-center">
            <Link href="/checkout" className="text-sm text-pink-600 hover:text-pink-700 hover:underline transition-colors">← Back to checkout</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
