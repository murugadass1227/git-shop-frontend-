'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { cartService, type CartItem } from '@/services/cartService';
import { setCart, removeFromCart, updateQuantity } from '@/store/cartSlice';
import { RootState } from '@/store/store';

export function CartClient() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const reduxItems = useSelector((s: RootState) => s.cart.items);
  const [cart, setCartState] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(!!token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace('/register');
      return;
    }
  }, [mounted, token, router]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    cartService
      .get()
      .then((c) => {
        setCartState(c);
        const apiItems = c.items || [];
        if (apiItems.length > 0) {
          dispatch(setCart({ items: apiItems }));
        }
        // If API cart is empty, don't clear Redux - keep items added from home/products so cart page can show them
      })
      .catch(() => setCartState(null))
      .finally(() => setLoading(false));
  }, [token, dispatch]);

  const updateQty = async (productId: string, quantity: number) => {
    if (token) {
      try {
        const c = await cartService.updateItem(productId, quantity);
        setCartState(c);
        dispatch(setCart({ items: c.items || [] }));
      } catch {
        /* update failed */
      }
    } else {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  };

  const remove = async (productId: string) => {
    if (token) {
      try {
        const c = await cartService.removeItem(productId);
        setCartState(c);
        dispatch(setCart({ items: c.items || [] }));
      } catch {
        /* remove failed */
      }
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  if (!mounted || !token) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return <p className="mt-6 sm:mt-8 text-slate-600 text-sm sm:text-base">Loading cart...</p>;
  }

  // Show API cart when it has items; otherwise show Redux cart so navbar count and cart page match
  const apiItems = cart?.items || [];
  const items = apiItems.length > 0 ? apiItems : reduxItems;
  const total = items.reduce((sum, i) => sum + (i.productId as { price?: number })?.price! * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mt-6 sm:mt-8 rounded-xl border border-pink-200 bg-pink-50/80 p-8 sm:p-12 text-center animate-fade-scale-in">
        <FontAwesomeIcon icon={faBagShopping} className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-pink-400" />
        <p className="mt-2 text-slate-600 text-sm sm:text-base">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block rounded-lg bg-pink-600 px-5 sm:px-6 py-2.5 sm:py-3 font-medium text-white hover:bg-pink-700 text-sm sm:text-base touch-manipulation hover-lift-3d transition-all duration-300">Shop gifts</Link>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      <ul className="divide-y divide-pink-200">
        {items.map((item) => {
          const p = item.productId as { _id: string; name: string; price: number };
          return (
            <li key={p._id} className="flex flex-wrap items-center gap-3 sm:gap-4 py-3 sm:py-4 hover-lift-3d transition-all duration-300 rounded-xl px-2 -mx-2">
              <div className="w-full min-w-0 font-medium text-slate-800 text-sm sm:text-base sm:w-48 sm:flex-1">{p.name}</div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => updateQty(p._id, Math.max(0, item.quantity - 1))}
                  className="rounded border border-pink-200 px-2.5 py-1.5 text-sm hover:bg-pink-50 touch-manipulation min-h-[36px] min-w-[36px] transition-colors"
                >
                  −
                </button>
                <span className="w-7 sm:w-8 text-center text-xs sm:text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQty(p._id, item.quantity + 1)}
                  className="rounded border border-pink-200 px-2.5 py-1.5 text-sm hover:bg-pink-50 touch-manipulation min-h-[36px] min-w-[36px] transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-pink-600 text-sm sm:text-base font-semibold">₹{p.price * item.quantity}</div>
              <button
                onClick={() => remove(p._id)}
                className="rounded p-2 text-red-600 hover:bg-red-50 touch-manipulation min-h-[36px] min-w-[36px] transition-colors"
                title="Remove"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col items-stretch sm:items-end gap-4 border-t border-pink-200 pt-4 sm:pt-6">
        <p className="text-base sm:text-lg font-bold text-slate-800">Total: ₹{total}</p>
        <button
          onClick={() => router.push('/checkout')}
          className="w-full sm:w-auto rounded-lg bg-pink-600 px-5 sm:px-6 py-2.5 sm:py-3 font-medium text-white hover:bg-pink-700 text-sm sm:text-base touch-manipulation min-h-[44px] hover-lift-3d transition-all duration-300"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
