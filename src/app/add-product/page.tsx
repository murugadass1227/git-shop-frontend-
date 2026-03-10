'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function AddProductPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/products');
      return;
    }

    router.replace('/admin/add-product');
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7fb]">
      <div className="animate-pulse text-slate-600">Redirecting to admin workspace...</div>
    </div>
  );
}
