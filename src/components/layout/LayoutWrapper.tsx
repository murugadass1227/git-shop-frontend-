'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCart } from '@/store/cartSlice';
import { setWishlist } from '@/store/wishlistSlice';
import { cartService } from '@/services/cartService';
import { wishlistService, wishlistResponseToItems } from '@/services/wishlistService';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  const isAdminArea = pathname?.startsWith('/admin') ?? false;
  const isLegacyAdminProductPage = pathname === '/add-product';
  const shouldHideLayout = isLoginPage || isRegisterPage || isAdminArea || isLegacyAdminProductPage;

  useEffect(() => {
    if (!token) return;
    cartService.get().then((c) => dispatch(setCart({ items: c?.items ?? [] }))).catch(() => {});
    wishlistService.get().then((res) => dispatch(setWishlist({ items: wishlistResponseToItems(res) }))).catch(() => {});
  }, [token, dispatch]);

  return (
    <div className="min-w-0 overflow-x-hidden flex flex-col min-h-screen">
      {!shouldHideLayout && <Navbar />}
      <main className={shouldHideLayout ? '' : 'flex-1 min-w-0 w-full overflow-x-hidden pt-14 sm:pt-16 lg:pt-28'}>
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
}
