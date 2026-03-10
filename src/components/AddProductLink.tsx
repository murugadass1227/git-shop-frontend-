'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function AddProductLink() {
  const user = useSelector((s: RootState) => s.auth.user);
  if (user?.role !== 'admin') return null;
  return (
    <Link
      href="/admin/add-product"
      className="premium-pill shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:from-rose-700 hover:to-rose-600 touch-manipulation transition-all duration-300"
    >
      Add product
    </Link>
  );
}
