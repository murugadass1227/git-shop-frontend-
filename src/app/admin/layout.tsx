'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, LogOut, Search, Store } from 'lucide-react';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { setAuth, logout } from '@/store/authSlice';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { adminNavigation, adminNavigationSections } from '@/components/admin/adminNavigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((s: RootState) => s.auth);
  const [checking, setChecking] = useState(true);
  const isAdminLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isAdminLoginPage) {
      setChecking(false);
      return;
    }
    if (!token) {
      router.replace('/admin/login');
      setChecking(false);
      return;
    }
    if (user?.role === 'admin') {
      setChecking(false);
      return;
    }
    authService
      .getMe()
      .then((me) => {
        const nextUser = { id: me.id, name: me.name, email: me.email, phone: me.phone, avatar: me.avatar, role: (me.role ?? 'user') as 'user' | 'admin' };
        dispatch(setAuth({ user: nextUser, token: token! }));
        if (me.role !== 'admin') {
          router.replace('/');
        }
      })
      .catch(() => {
        dispatch(logout());
        router.replace('/admin/login');
      })
      .finally(() => setChecking(false));
  }, [token, isAdminLoginPage, router, dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#fff8fc] text-slate-900">
      <div className="flex h-full">
        <aside className="hidden h-screen w-[290px] shrink-0 border-r border-pink-100/80 bg-[#fff5fa] lg:flex lg:flex-col">
          <div className="border-b border-pink-100/80 px-6 pb-5 pt-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-400 text-white shadow-lg shadow-pink-200">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Gondget Admin</p>
                <p className="text-xs text-slate-500">Management system</p>
              </div>
            </Link>
          </div>

          <div className="border-b border-pink-100/80 px-5 py-4">
            <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-pink-400" />
              <input
                type="text"
                placeholder="Search modules"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-5">
              {adminNavigationSections.map((section) => (
                <div key={section}>
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{section}</p>
                  <div className="mt-2 space-y-1.5">
                    {adminNavigation
                      .filter((item) => item.section === section)
                      .map((item) => {
                        const Icon = item.icon;
                        const isHashLink = item.href.includes('#');
                        const isProductsModule = item.id === 'products' && (pathname === '/admin/add-product' || pathname.startsWith('/admin/products'));
                        const isActive = isHashLink
                          ? pathname === '/admin' && item.href.startsWith('/admin#')
                          : pathname === item.href || pathname.startsWith(`${item.href}/`) || isProductsModule;

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-200'
                                : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                isActive ? 'bg-white/15 text-white' : 'bg-pink-50 text-pink-500'
                              }`}
                            >
                              <Icon className="h-[18px] w-[18px]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-semibold">{item.label}</span>
                                <ChevronRight
                                  className={`h-4 w-4 shrink-0 ${
                                    isActive ? 'text-white/80' : 'text-slate-300 transition-transform group-hover:translate-x-0.5'
                                  }`}
                                />
                              </div>
                              <p className={`mt-0.5 truncate text-xs ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{item.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="border-t border-pink-100/80 bg-white/70 p-4">
            <div className="rounded-[26px] border border-pink-100 bg-white p-4 shadow-sm">
              <button type="button" className="flex w-full items-center gap-3 text-left">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-sm font-semibold text-white">
                  {(user?.name ?? user?.email ?? 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.name ?? 'Admin user'}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email ?? 'admin@gondget.com'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                <Link
                  href="/"
                  className="rounded-2xl border border-pink-200 px-4 py-2.5 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                >
                  Store
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#fffafd]">
          <AdminTopbar pathname={pathname} user={user} onLogout={handleLogout} />
          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8">
            {children}
            <div className="mt-6 rounded-2xl border border-pink-100 bg-white/70 px-4 py-3 text-center text-xs text-slate-400">
              Gondget Admin Workspace • Lite pink dashboard theme
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
