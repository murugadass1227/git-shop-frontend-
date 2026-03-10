'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { logout } from '@/store/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faSearch,
  faShoppingCart,
  faUser,
  faRightFromBracket,
  faPhone,
  faBars,
  faHeart,
  faStar,
  faGift,
  faTag,
  faBox,
  faChevronRight,
  faUsers,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { getAvatarUrl } from '@/lib/api';
import { popularCollections } from '@/data/popularCollections';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PopularCollectionsMegaMenu } from './PopularCollectionsMegaMenu';
import { NavbarSidebar } from '@/components/layout/NavbarSidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function Navbar() {
  const supportPhoneDisplay = '(+91) 8010 99 7066';
  const supportPhoneHref = 'tel:+918010997066';
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const cartCount = useSelector((s: RootState) => s.cart.count);
  const wishlistCount = useSelector((s: RootState) => s.wishlist.items.length);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subSidebarSection, setSubSidebarSection] = useState<string | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAsLoggedIn = mounted && user;
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;
  const collectionIcons: Record<string, IconDefinition> = {
    birthday: faGift,
    anniversary: faHeart,
    corporate: faBox,
    personalized: faStar,
    occasions: faTag,
    'mini-you': faUsers,
  };

  const sidebarSectionsWithSub = popularCollections.map((section) => ({
    ...section,
    label: section.title,
    icon: collectionIcons[section.id] ?? faGift,
  }));

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    try {
      await authService.logout();
    } catch {
      // clear local session even if API fails
    }
    dispatch(logout());
    router.push('/');
    setMobileMenuOpen(false);
    setSidebarOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/products?occasion=Birthday', label: 'Occasions' },
    { href: '/products?customizable=true', label: 'Personalized' },
    { href: '/products?category=Corporate', label: 'Corporate Gifts' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-xl overflow-visible transition-all duration-300 animate-navbar-glow">
      {/* Main navbar - mobile first */}
      <div className="mx-auto w-full max-w-[1600px] px-3 py-2 sm:px-6 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0 flex-nowrap">
          {/* Menu - all screens */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          {/* Logo - compact on mobile */}
          <Link
            href="/"
            className="flex shrink-0 items-center min-w-0 max-w-[110px] sm:max-w-none transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
          >
            <Image
              src="/assets/logo/logo-gnd.png"
              alt="Presto"
              width={140}
              height={40}
              className="h-7 w-auto object-contain sm:h-8 md:h-9"
              priority
            />
          </Link>

          {/* Search bar - only from 640px (sm) */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 min-w-0 max-w-xl mx-2 md:mx-4 rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm transition-all duration-300 focus-within:border-rose-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-400/15 focus-within:shadow-md"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Gifts..."
              className="w-full min-w-0 bg-transparent px-3 py-2.5 md:px-4 md:py-3 text-sm outline-none placeholder:text-slate-400 text-slate-800 transition-colors duration-200"
            />
            <button
              type="submit"
              className="shrink-0 px-3 md:px-4 text-slate-500 transition-all duration-200 hover:text-rose-600 hover:scale-110"
            >
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </form>

          {/* Mobile: search icon only (< 640px) */}
          <Link
            href="/products"
            className="sm:hidden flex shrink-0 items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-pink-100 hover:text-pink-600 transition-all duration-200 active:scale-95"
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
          </Link>

          {/* Bulk Order & Smart Gift Finder - only from 1024px (lg) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/bulk-order"
              className="flex items-center gap-2 rounded-full border-2 border-pink-200 bg-pink-50/90 px-3 py-2 text-sm font-medium text-pink-800 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-pink-300 hover:bg-pink-100 hover:shadow-lg hover-lift-3d active:scale-[0.98] xl:px-4 xl:py-2.5"
            >
              <FontAwesomeIcon icon={faBox} className="h-4 w-4 text-pink-600" />
              <span className="hidden xl:inline">Bulk Order</span>
            </Link>
            <Link
              href="/smart-gift-finder"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-rose-700 hover:to-rose-600 hover:shadow-xl hover:shadow-rose-500/30 hover-lift-3d active:scale-[0.98] xl:px-4 xl:py-2.5"
            >
              <FontAwesomeIcon icon={faGift} className="h-4 w-4" />
              <span className="hidden xl:inline">Smart Gift Finder</span>
            </Link>
          </div>

          {/* Right icons - fewer on mobile */}
          <div className="flex items-center gap-0.5 sm:gap-1 lg:ml-2 xl:ml-3 lg:border-l lg:border-pink-200/80 lg:pl-3 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95"
              asChild
            >
              <a href={supportPhoneHref} title={`Call ${supportPhoneDisplay}`} aria-label={`Call ${supportPhoneDisplay}`}>
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </Button>
            {showAsLoggedIn ? (
              <Button variant="ghost" size="icon" className="hidden sm:flex relative text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" asChild>
                <Link href="/wishlist" title="Wishlist" aria-label="Wishlist">
                  <FontAwesomeIcon icon={faHeart} className="h-4 w-4 sm:h-5 sm:w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] items-center justify-center rounded-full bg-pink-500 text-[9px] sm:text-[10px] font-bold text-white shadow-md ring-2 ring-white animate-in zoom-in-50 duration-200">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" title="Wishlist" aria-label="Wishlist" onClick={() => router.push('/register')}>
                <FontAwesomeIcon icon={faHeart} className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            {showAsLoggedIn ? (
              <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" asChild>
                <Link href="/cart" title="Cart" aria-label="Cart">
                  <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 sm:h-5 sm:w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] items-center justify-center rounded-full bg-pink-500 text-[9px] sm:text-[10px] font-bold text-white shadow-md ring-2 ring-white animate-in zoom-in-50 duration-200">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" title="Cart" aria-label="Cart" onClick={() => router.push('/register')}>
                <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" asChild title="Admin">
                <Link href="/admin" aria-label="Admin dashboard">
                  <FontAwesomeIcon icon={faGear} className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-pink-600 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" asChild>
              <Link href={showAsLoggedIn ? "/profile" : "/login"} title={showAsLoggedIn ? "Profile" : "Login"} aria-label={showAsLoggedIn ? "Profile" : "Login"}>
                {showAsLoggedIn && avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-pink-200" />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex text-slate-600 hover:text-pink-700 hover:bg-pink-100/80 transition-all duration-200 active:scale-95" title="More" aria-label="More">
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 sm:h-5 sm:w-5 rotate-90" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-1 border-t border-pink-200/80 pt-4 lg:hidden animate-in fade-in slide-in-from-top-2 duration-300">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-slate-700 font-medium transition-all duration-200 hover:bg-pink-100 hover:text-pink-700 animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showAsLoggedIn ? (
              <Link href="/cart" className="rounded-xl px-3 py-2.5 text-slate-700 font-medium transition-all duration-200 hover:bg-pink-100 hover:text-pink-700" onClick={() => setMobileMenuOpen(false)}>
                Cart {cartCount > 0 && <span className="text-pink-600 font-semibold">({cartCount})</span>}
              </Link>
            ) : (
              <button type="button" className="rounded-xl px-3 py-2.5 text-slate-700 font-medium transition-all duration-200 hover:bg-pink-100 hover:text-pink-700 w-full text-left" onClick={() => { setMobileMenuOpen(false); router.push('/register'); }}>
                Cart
              </button>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="rounded-xl px-3 py-2.5 text-slate-700 font-medium transition-all duration-200 hover:bg-pink-100 hover:text-pink-700" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            <Link href={showAsLoggedIn ? "/profile" : "/login"} className="rounded-xl px-3 py-2.5 text-slate-700 font-medium transition-all duration-200 hover:bg-pink-100 hover:text-pink-700" onClick={() => setMobileMenuOpen(false)}>
              {showAsLoggedIn ? "Profile" : "Login"}
            </Link>
          </div>
        )}
      </div>
      
      <PopularCollectionsMegaMenu />

      <NavbarSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        subSidebarSection={subSidebarSection}
        setSubSidebarSection={setSubSidebarSection}
        userRole={user?.role}
        showAsLoggedIn={Boolean(showAsLoggedIn)}
        avatarUrl={avatarUrl}
        sidebarSectionsWithSub={sidebarSectionsWithSub}
        profileHref={showAsLoggedIn ? '/profile' : '/login'}
        onRequestLogout={() => setLogoutDialogOpen(true)}
      />

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
