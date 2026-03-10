'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { orderService, type Order } from '@/services/orderService';
import { RootState } from '@/store/store';

function AccountContent() {
  const searchParams = useSearchParams();
  const token = useSelector((s: RootState) => s.auth.token);
  const user = useSelector((s: RootState) => s.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const orderSuccess = searchParams?.get('order') === 'success';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!token) return;
    orderService.list().then(setOrders).catch(() => setOrders([]));
  }, [token]);

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-12 sm:py-16 overflow-x-hidden">
        <div className="h-8 w-8 mx-auto border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-12 sm:py-16 text-center overflow-x-hidden">
        <p className="text-slate-600 text-sm sm:text-base">Please log in to view your account.</p>
        <Link href="/login" className="mt-4 inline-block text-violet-600 font-medium hover:underline touch-manipulation">Login</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Account</h1>
      {orderSuccess && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 sm:p-4 text-green-800 text-sm sm:text-base">
          Order placed successfully. Thank you!
        </p>
      )}
      <div className="mt-4 sm:mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Profile</h2>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">{user?.name}</p>
        {(user?.email || user?.phone) && (
          <p className="text-slate-600 text-sm sm:text-base break-all">{user?.email ?? user?.phone}</p>
        )}
        <Link href="/profile" className="mt-3 inline-block text-sm font-medium text-violet-600 hover:text-violet-700">
          View full profile →
        </Link>
      </div>
      <div className="mt-6 sm:mt-8">
        <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Order history</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-slate-600 text-sm sm:text-base">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-slate-800 text-sm sm:text-base">
                    Order #{order._id.slice(-6)}
                  </span>
                  <span className="text-slate-600 text-sm sm:text-base">₹{order.total}</span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Status: {order.status} • {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-12 text-center text-muted-foreground">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
