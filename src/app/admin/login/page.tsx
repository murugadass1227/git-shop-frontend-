'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { authService } from '@/services/authService';
import { setAuth, logout } from '@/store/authSlice';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone.trim() || !password) {
      setError('Please enter email/phone and password');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(emailOrPhone.trim(), password);
      dispatch(setAuth({ user: { ...res.user, role: res.user.role ?? 'user' }, token: res.token }));
      if (res.user.role === 'admin') {
        router.push('/admin');
      } else {
        setError('Access denied. Admin only.');
        dispatch(logout());
      }
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.22),_transparent_35%),linear-gradient(180deg,_#fff7fb_0%,_#fff1f6_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-[36px] border border-pink-100 bg-white/80 p-10 shadow-[0_30px_80px_-45px_rgba(244,114,182,0.55)] lg:block">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
            <Sparkles className="h-4 w-4" />
            Light pink admin workspace
          </div>
          <h1 className="mt-6 text-4xl font-semibold text-slate-900">Manage your gift shop with a clean dashboard UI.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Orders, products, user roles, personalized inputs, delivery flow and homepage content all have a dedicated admin-facing workspace.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              'Dashboard analytics and revenue snapshots',
              'Product, category and coupon controls',
              'Customer, review and user management',
              'Custom input, delivery and CMS operations',
            ].map((item) => (
              <div key={item} className="rounded-[24px] bg-pink-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-pink-500" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-[32px] border border-pink-100 bg-white p-6 shadow-[0_30px_80px_-45px_rgba(244,114,182,0.55)] sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-200">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-slate-900">Admin login</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to access the Gondget control center.</p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email or phone</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="admin@gondget.com"
                className="w-full rounded-2xl border border-pink-100 bg-pink-50/60 px-4 py-3 outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-pink-100 bg-pink-50/60 px-4 py-3 outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in to admin panel'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            <Link href="/" className="text-pink-600 hover:text-pink-700">Back to store</Link>
            {' · '}
            <Link href="/login" className="text-pink-600 hover:text-pink-700">User login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
