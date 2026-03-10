'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  PackagePlus,
  Search,
  Store,
  UserCircle2,
} from 'lucide-react';
import { getAvatarUrl } from '@/lib/api';
import { adminNavigation } from './adminNavigation';

type AdminTopbarProps = {
  pathname: string;
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  onLogout: () => void;
};

const pageContent: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/admin': {
    eyebrow: 'Admin panel',
    title: 'Store operations dashboard',
    description: 'Monitor products, orders, customers and campaigns from one polished workspace.',
  },
  '/admin/dashboard': {
    eyebrow: 'Admin panel',
    title: 'Store operations dashboard',
    description: 'Monitor products, orders, customers and campaigns from one polished workspace.',
  },
  '/admin/add-product': {
    eyebrow: 'Catalog workspace',
    title: 'Add new product',
    description: 'Create a live product, upload media and enable customization from the admin flow.',
  },
  '/admin/profile': {
    eyebrow: 'Admin profile',
    title: 'Admin profile settings',
    description: 'Manage your admin identity, security preferences and workspace shortcuts.',
  },
};

function resolvePageMeta(pathname: string) {
  if (pageContent[pathname]) {
    return pageContent[pathname];
  }

  const navItem = adminNavigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  if (navItem) {
    return {
      eyebrow: 'Admin panel',
      title: navItem.label,
      description: navItem.description,
    };
  }

  return pageContent['/admin/dashboard'];
}

export function AdminTopbar({ pathname, user, onLogout }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  const meta = useMemo(() => resolvePageMeta(pathname), [pathname]);
  const userLabel = user?.name?.trim() || user?.email || 'Admin user';
  const userInitial = userLabel.charAt(0).toUpperCase();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-pink-100/80 bg-[#fff9fc]/95 backdrop-blur-xl">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">{meta.eyebrow}</p>
            <h1 className="mt-1 truncate text-[30px] font-semibold leading-tight text-slate-900">{meta.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-pink-100 bg-white px-4 shadow-sm lg:w-[340px]">
                <Search className="h-4 w-4 shrink-0 text-pink-400" />
                <input
                  type="text"
                  placeholder="Search admin modules..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-500 shadow-sm transition hover:bg-pink-50 lg:flex"
                aria-label="Help"
              >
                <CircleHelp className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-500 shadow-sm transition hover:bg-pink-50"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <button
                type="button"
                className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-500 shadow-sm transition hover:bg-pink-50 sm:flex"
                aria-label="Inbox"
              >
                <Mail className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-semibold text-white">
                  2
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="hidden items-center gap-2 rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-medium text-pink-700 shadow-sm md:flex">
                <CalendarDays className="h-4 w-4 text-pink-500" />
                March 2026
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white px-3 py-2.5 shadow-sm transition hover:border-pink-200 hover:bg-pink-50"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-11 w-11 rounded-2xl object-cover ring-2 ring-pink-100" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-400 text-sm font-semibold text-white shadow-lg shadow-pink-200">
                      {userInitial}
                    </div>
                  )}

                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="truncate text-sm font-semibold text-slate-900">{userLabel}</p>
                    <p className="truncate text-xs text-slate-500">Admin user</p>
                  </div>

                  <ChevronDown className={`h-4 w-4 text-slate-400 transition ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-72 overflow-hidden rounded-[28px] border border-pink-100 bg-white shadow-[0_22px_60px_-30px_rgba(15,23,42,0.35)]">
                    <div className="border-b border-pink-100 bg-gradient-to-br from-pink-50 via-white to-rose-50 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Signed in as</p>
                      <p className="mt-2 truncate text-base font-semibold text-slate-900">{userLabel}</p>
                      <p className="truncate text-sm text-slate-500">{user?.email || 'admin@gondget.com'}</p>
                    </div>

                    <div className="p-3">
                      <div className="space-y-1.5">
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-slate-900"
                        >
                          <LayoutDashboard className="h-4 w-4 text-pink-500" />
                          Dashboard
                        </Link>
                        <Link
                          href="/admin/products"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-slate-900"
                        >
                          <Package className="h-4 w-4 text-pink-500" />
                          Product management
                        </Link>
                        <Link
                          href="/admin/add-product"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-slate-900"
                        >
                          <PackagePlus className="h-4 w-4 text-pink-500" />
                          Add new product
                        </Link>
                        <Link
                          href="/admin/profile"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-slate-900"
                        >
                          <UserCircle2 className="h-4 w-4 text-pink-500" />
                          Profile settings
                        </Link>
                        <Link
                          href="/"
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-slate-900"
                        >
                          <Store className="h-4 w-4 text-pink-500" />
                          Visit storefront
                        </Link>
                      </div>

                      <div className="mt-3 border-t border-pink-100 pt-3">
                        <button
                          type="button"
                          onClick={onLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {adminNavigation.map((item) => {
            const isHashLink = item.href.includes('#');
            const isProductsModule = item.id === 'products' && (pathname === '/admin/add-product' || pathname.startsWith('/admin/products'));
            const isActive = isHashLink
              ? pathname === '/admin' && item.href.startsWith('/admin#')
              : pathname === item.href || pathname.startsWith(`${item.href}/`) || isProductsModule;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                    : 'border-pink-200 bg-white text-slate-600 hover:bg-pink-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin/add-product"
            className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium transition ${
              pathname === '/admin/add-product'
                ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                : 'border-pink-200 bg-white text-slate-600 hover:bg-pink-50'
            }`}
          >
            Add product
          </Link>
        </div>
      </div>
    </header>
  );
}
