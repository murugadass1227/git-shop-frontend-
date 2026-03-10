'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Mail, MapPinHouse, Phone, RefreshCcw, ShieldCheck, ShoppingBag, UserCircle2, Users } from 'lucide-react';
import { getAvatarUrl } from '@/lib/api';
import { adminService, type AdminUserRecord } from '@/services/adminService';

const previewUsers: AdminUserRecord[] = [
  {
    id: 'preview-admin-1',
    name: 'Murugadass M',
    email: 'admin@gondget.com',
    phone: '+91 98765 43210',
    role: 'admin',
    addressCount: 1,
    orderCount: 12,
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-09T09:00:00.000Z',
  },
  {
    id: 'preview-user-1',
    name: 'Nivetha R',
    email: 'nivetha@example.com',
    phone: '+91 91234 56789',
    role: 'user',
    addressCount: 2,
    orderCount: 7,
    createdAt: '2026-02-22T09:00:00.000Z',
    updatedAt: '2026-03-08T09:00:00.000Z',
  },
];

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(previewUsers);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadUsers = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setError('');
    } catch {
      setError('Live user data is unavailable right now. Preview values are shown for the UI.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === 'admin').length;
    const customerCount = totalUsers - adminCount;
    const totalOrders = users.reduce((sum, user) => sum + user.orderCount, 0);

    return { totalUsers, adminCount, customerCount, totalOrders };
  }, [users]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-rose-100/70 p-6 shadow-[0_20px_60px_-30px_rgba(244,114,182,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">User management</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Real-time user details for admin operations</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This page fetches the latest users from the admin API so you can review account type, contact details, order activity and address availability in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh users'}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total users</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalUsers}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Admin accounts</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.adminCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Customer accounts</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.customerCount}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <UserCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total order links</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalOrders}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-pink-100 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(244,114,182,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">User details list</h3>
            <p className="mt-1 text-sm text-slate-500">Latest admin and customer accounts fetched from the live admin endpoint.</p>
          </div>
          <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
            {loading ? 'Loading users...' : `${users.length} records`}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {users.map((user) => {
            const avatarUrl = user.avatar ? getAvatarUrl(user.avatar) : null;

            return (
              <div key={user.id} className="rounded-[24px] border border-pink-100 bg-pink-50/35 p-5">
                <div className="flex items-start gap-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-16 w-16 rounded-[22px] object-cover ring-2 ring-white" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-pink-500 to-rose-400 text-xl font-semibold text-white shadow-md">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-900">{user.name}</h4>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-4 w-4 text-pink-500" />
                        <span className="truncate">{user.email || 'No email available'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4 text-pink-500" />
                        <span>{user.phone || 'No phone available'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <ShoppingBag className="h-4 w-4 text-pink-500" />
                        <span>{user.orderCount} linked orders</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPinHouse className="h-4 w-4 text-pink-500" />
                        <span>{user.addressCount} saved addresses</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-pink-500" />
                        Joined {formatDate(user.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
                        <RefreshCcw className="h-3.5 w-3.5 text-pink-500" />
                        Updated {formatDate(user.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
