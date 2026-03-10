'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGift,
  faHeart,
  faStar,
  faShoppingCart,
  faChevronRight,
  faTruck,
  faShieldHalved,
  faHeadphones,
  faAward,
} from '@fortawesome/free-solid-svg-icons';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { PopularCollectionsSection } from '@/components/home/PopularCollectionsSection';
import { featuredProducts } from '@/data/featuredProducts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addToCart, setCart } from '@/store/cartSlice';
import { setWishlist, toggleWishlist } from '@/store/wishlistSlice';
import { cartService } from '@/services/cartService';
import { wishlistService, wishlistResponseToItems } from '@/services/wishlistService';
import { collectionGuides } from '@/data/collectionGuides';

const collectionGuideImages = [
  '/assets/banners/banner1.jpeg',
  '/assets/banners/banner2.jpg',
  '/assets/banners/banner3.jpeg',
  '/assets/banners/banner4.webp',
  '/assets/banners/banner5.webp',
  '/assets/banners/banner6.webp',
  '/assets/category/c1.webp',
  '/assets/category/c2.webp',
  '/assets/category/c3.webp',
  '/assets/category/c4.webp',
  '/assets/category/c5.webp',
  '/assets/category/c6.webp',
  '/assets/category/c7.webp',
  '/assets/category/c8.png',
  '/assets/trading products/t1.jpg',
  '/assets/trading products/t2.jpg',
  '/assets/trading products/t3.jpg',
  '/assets/trading products/t4.png',
  '/assets/trading products/t5.JPG',
  '/assets/trading products/t6.JPG',
  '/assets/trading products/t7.jpg',
  '/assets/trading products/t8.jpg',
];

const womensDayGiftTabs = [
  {
    id: 'wife',
    label: 'Gifts For Wife',
    items: [
      { title: 'Romantic Banner Gift', image: '/assets/banners/banner1.jpeg', href: '/products?search=Wife%20Gifts' },
      { title: 'Photo Frame Surprise', image: '/assets/category/c1.webp', href: '/products?category=Frames&search=Wife%20Gifts' },
      { title: 'Premium Custom Mug', image: '/assets/trading products/t1.jpg', href: '/products?category=Mugs&search=Wife%20Gifts' },
      { title: 'Memory Lamp', image: '/assets/trading products/t2.jpg', href: '/products?search=Photo%20Lamps' },
      { title: 'Personalized Keepsake', image: '/assets/category/c5.webp', href: '/products?customizable=true&search=Wife%20Gifts' },
      { title: 'Special Day Combo', image: '/assets/banners/banner5.webp', href: '/products?occasion=Anniversary&search=Wife%20Gifts' },
      { title: 'Elegant Crystal Gift', image: '/assets/category/c7.webp', href: '/products?category=Crystals&search=Wife%20Gifts' },
      { title: 'Customized Home Accent', image: '/assets/category/c8.png', href: '/products?search=Home%20Decor&customizable=true' },
      { title: 'Luxury Gift Box', image: '/assets/banners/banner4.webp', href: '/products?search=Premium%20Gifts' },
      { title: 'Festive Surprise', image: '/assets/banners/banner6.webp', href: '/products?search=Festival%20Gifts' },
    ],
  },
  {
    id: 'girlfriend',
    label: 'Gifts For Girlfriend',
    items: [
      { title: 'Cute Couple Pick', image: '/assets/banners/banner2.jpg', href: '/products?search=Girlfriend%20Gifts' },
      { title: 'Love Theme Gift', image: '/assets/category/c2.webp', href: '/products?occasion=Anniversary&search=Girlfriend%20Gifts' },
      { title: 'Mini Gift Box', image: '/assets/trading products/t3.jpg', href: '/products?search=Mini%20Gifts' },
      { title: 'Personalized Acrylic', image: '/assets/trading products/t4.png', href: '/products?customizable=true&search=Girlfriend%20Gifts' },
      { title: 'Trend Gift Card', image: '/assets/category/c7.webp', href: '/products?search=Photo%20Gifts' },
      { title: 'Surprise Celebration', image: '/assets/banners/banner4.webp', href: '/products?occasion=Birthday&search=Girlfriend%20Gifts' },
    ],
  },
  {
    id: 'mom',
    label: 'Gifts For Mom',
    items: [
      { title: 'Elegant Home Gift', image: '/assets/banners/banner3.jpeg', href: '/products?search=Mother%20Gifts' },
      { title: 'Personalized Memory', image: '/assets/category/c3.webp', href: '/products?customizable=true&search=Mother%20Gifts' },
      { title: 'Decor Accent', image: '/assets/category/c8.png', href: '/products?search=Home%20Decor' },
      { title: 'Thoughtful Keepsake', image: '/assets/trading products/t5.JPG', href: '/products?search=Photo%20Frames' },
      { title: 'Premium Thank You Gift', image: '/assets/trading products/t6.JPG', href: '/products?search=Thank%20You%20Gifts' },
      { title: 'Warm Celebration Pick', image: '/assets/banners/banner2.jpg', href: '/products?occasion=Birthday&search=Mother%20Gifts' },
    ],
  },
  {
    id: 'sister',
    label: 'Gifts For Sister',
    items: [
      { title: 'Fun Celebration Gift', image: '/assets/banners/banner6.webp', href: '/products?search=Sister%20Gifts' },
      { title: 'Trendy Birthday Pick', image: '/assets/category/c4.webp', href: '/products?occasion=Birthday&search=Sister%20Gifts' },
      { title: 'Creative Photo Gift', image: '/assets/category/c6.webp', href: '/products?search=Photo%20Gifts' },
      { title: 'Cute Desk Accessory', image: '/assets/trading products/t7.jpg', href: '/products?search=Mini%20Gifts' },
      { title: 'Best Friend Style Gift', image: '/assets/trading products/t8.jpg', href: '/products?search=Best%20Friend%20Gifts' },
    ],
  },
];

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const cartCount = useSelector((s: RootState) => s.cart.count);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const [activeWomensDayTab, setActiveWomensDayTab] = useState(womensDayGiftTabs[0].id);
  const activeWomensDayItems = womensDayGiftTabs.find((tab) => tab.id === activeWomensDayTab)?.items ?? womensDayGiftTabs[0].items;

  const handleAddToCart = (product: any) => {
    if (!token) {
      router.push('/register');
      return;
    }
    const idStr = String(product._id ?? product.id ?? product.name);
    const cartItem = {
      productId: {
        _id: idStr,
        name: product.name,
        price: product.price,
        category: 'General',
        images: [product.images?.[0] ?? product.image],
        description: product.description ?? product.name,
        customizable: product.customizable ?? true,
        occasions: product.occasions ?? ['Birthday', 'Anniversary'],
      },
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
    /* Only sync to API when product has a real MongoDB _id (24-char hex). Home page featured products use numeric ids and are cart-local only. */
    const isRealProductId = typeof idStr === 'string' && /^[a-fA-F0-9]{24}$/.test(idStr);
    if (isRealProductId) {
      cartService.addItem(idStr, 1).then((c) => { dispatch(setCart({ items: c.items || [] })); }).catch(() => {});
    }
  };

  const handleToggleWishlist = async (product: { _id?: string; id?: string | number; name: string; image: string; price: number; originalPrice?: number; rating?: number; reviews?: number; badge?: string }) => {
    if (!token) {
      router.push('/register');
      return;
    }
    const idStr = product._id ?? product.id?.toString?.() ?? product.name;
    const isRealId = typeof idStr === 'string' && /^[a-fA-F0-9]{24}$/.test(idStr);
    const wasInList = wishlistItems.some((i) => i.id === idStr);

    if (!isRealId) {
      dispatch(
        toggleWishlist({
          id: idStr,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          rating: product.rating,
          reviews: product.reviews,
          badge: product.badge,
        })
      );
      return;
    }
    try {
      if (wasInList) {
        const res = await wishlistService.removeItem(idStr);
        dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
      } else {
        const res = await wishlistService.addItem(idStr);
        dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
      }
    } catch {
      /* wishlist API error – no toast */
    }
  };

  const categories = [
    { name: "Birthday Gifts", icon: "🎂", color: "bg-pink-100 text-pink-600", image: "/assets/category/c1.webp" },
    { name: "Anniversary", icon: "💑", color: "bg-red-100 text-red-600", image: "/assets/category/c2.webp" },
    { name: "Wedding", icon: "💒", color: "bg-pink-100 text-pink-600", image: "/assets/category/c3.webp" },
    { name: "Corporate", icon: "💼", color: "bg-blue-100 text-blue-600", image: "/assets/category/c4.webp" },
    { name: "Personalized", icon: "🎁", color: "bg-green-100 text-green-600", image: "/assets/category/c5.webp" },
    { name: "Kids", icon: "🧸", color: "bg-yellow-100 text-yellow-600", image: "/assets/category/c6.webp" },
    { name: "Photo Gifts", icon: "📷", color: "bg-indigo-100 text-indigo-600", image: "/assets/category/c7.webp" },
    { name: "Home Decor", icon: "🏠", color: "bg-orange-100 text-orange-600", image: "/assets/category/c8.png" }
  ];

  const bestSellers = [
    {
      title: "Corporate Favorites",
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
      description: "Executive gifts that make a statement"
    },
    {
      title: "Personalized Frames",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
      description: "Custom frames with your favorite memories"
    },
    {
      title: "Premium Mugs",
      image:
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
      description: "Hand-painted mugs for every mood"
    },
    {
      title: "Curated Sets",
      image:
        "https://images.unsplash.com/photo-1481833810009-32d3099c2947?auto=format&fit=crop&w=800&q=80",
      description: "Gift boxes ready to delight"
    },
    {
      title: "Daily Essentials",
      image:
        "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80",
      description: "Practical yet thoughtful picks"
    },
    {
      title: "Celebration Tokens",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
      description: "Fun gifts for every celebration"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroCarousel />

      

       {/* Categories */}
       <section className="py-10 sm:py-14 md:py-16">
        <div className="w-full px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2 sm:mb-4">Shop by Category</h2>
          <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-12">Find the perfect gift for every occasion</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover-lift-3d"
              >
                <div className="aspect-square relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{category.icon}</div>
                    <div className="font-semibold text-xs sm:text-sm">{category.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 md:py-16">
        <div className="w-full px-3 sm:px-4">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-slate-200">
              <p className="text-xl font-bold uppercase tracking-[0.12em] text-slate-900 sm:text-2xl">Women&apos;s Day Gift</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-8">
                {womensDayGiftTabs.map((tab) => {
                  const isActive = tab.id === activeWomensDayTab;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveWomensDayTab(tab.id)}
                      className={`border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors sm:text-sm ${
                        isActive
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {activeWomensDayItems.map((item, index) => (
                <Link
                  key={`${item.title}-${item.href}-${index}`}
                  href={item.href}
                  className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-square bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <p className="text-sm font-semibold drop-shadow-sm sm:text-base">{item.title}</p>
                      <span className="mt-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-pink-100">
                        Shop now
                        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

         {/* Featured Products */}
         <section className="py-10 sm:py-14 md:py-16 bg-pink-50">
        <div className="w-full px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 sm:mb-4">Featured Products</h2>
            <p className="text-slate-600 text-sm sm:text-base">Handpicked gifts that everyone will love</p>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/featured-products/${product.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/featured-products/${product.id}`);
                  }
                }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover-lift-3d cursor-pointer"
              >
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56 md:h-64"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-pink-600 text-white text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                    className={`absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full p-1.5 sm:p-2 shadow-md transition-colors touch-manipulation ${
                      wishlistItems.some((i) => i.id === product.id.toString())
                        ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                        : 'bg-white text-slate-600 hover:bg-pink-50'
                    }`}
                    aria-label={wishlistItems.some((i) => i.id === product.id.toString()) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${wishlistItems.some((i) => i.id === product.id.toString()) ? 'text-pink-600' : 'text-slate-600'}`}
                    />
                  </button>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faStar} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                      <span className="text-xs sm:text-sm text-slate-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-base sm:text-lg font-bold text-slate-800">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-slate-400 line-through ml-1 sm:ml-2">₹{product.originalPrice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition-colors shrink-0 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:from-rose-700 hover:to-rose-600 hover:shadow-xl hover:shadow-rose-500/30 hover-lift-3d sm:w-auto sm:px-8 sm:py-3 sm:text-base touch-manipulation"
            >
              View All Products
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

       {/* Gift by Occasion - image cards */}
       <section className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="w-full px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2 sm:mb-4">Gift by Occasion</h2>
          <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-10">Pick the perfect gift for every milestone</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
            {[
              { label: 'Birthday', href: '/products?occasion=Birthday', image: '/assets/category/c1.webp' },
              { label: 'Anniversary', href: '/products?occasion=Anniversary', image: '/assets/category/c2.webp' },
              { label: 'Wedding', href: '/products?occasion=Wedding', image: '/assets/category/c3.webp' },
              { label: 'Corporate', href: '/products?category=Corporate', image: '/assets/category/c5.webp' },
              { label: 'Valentine', href: '/products?occasion=Valentine', image: '/assets/category/c1.webp' },
              { label: 'Thank You', href: '/products?customizable=true', image: '/assets/category/c6.webp' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group block rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 hover-tilt-3d"
              >
                <div className="aspect-square relative bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-center text-white font-semibold text-xs sm:text-sm">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <PopularCollectionsSection />

      <section className="bg-white py-10 sm:py-14 md:py-16">
        <div className="w-full px-3 sm:px-4">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Static collections</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">Filter-ready gift guide pages</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Open curated static pages like Women&apos;s Day, birthday edits and corporate picks with filters already applied.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-800">
              Browse all filters
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {collectionGuides.map((guide, index) => {
              const guideImage = collectionGuideImages[index % collectionGuideImages.length];

              return (
              <Link
                key={guide.slug}
                href={`/collections/${guide.slug}`}
                className="group overflow-hidden rounded-[24px] border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 bg-slate-100">
                  <img src={guideImage} alt={guide.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-600">
                    {guide.badge}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-200">{guide.eyebrow}</p>
                    <h3 className="mt-2 text-xl font-semibold">{guide.title}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="line-clamp-2 text-sm text-slate-600">{guide.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.tabs.slice(0, 3).map((tab) => (
                      <span key={tab.id} className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700">
                        {tab.label}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Hero Section */}
      {/* <section className="bg-pink-50 py-8 sm:py-10 md:py-12">
        <div className="w-full px-3 sm:px-4">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-pink-500">New arrivals</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mt-1">Bestsellers that keep flying off the shelves</h2>
            </div>
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-800 sm:w-auto md:shrink-0"
            >
              Shop all bestsellers
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {bestSellers.map((item) => (
              <div
                key={item.title}
                className="rounded-xl sm:rounded-2xl border border-pink-100 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift-3d"
              >
                <div className="relative h-44 sm:h-48 lg:h-52">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">{item.description}</p>
                  <h3 className="text-base sm:text-xl font-semibold text-slate-800 mt-2">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

     

     

   

     

      {/* How Personalization Works */}
      <section className="bg-gradient-to-b from-rose-50 via-pink-50/70 to-white py-10 sm:py-14 md:py-16">
        <div className="w-full px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2 sm:mb-4">How Personalization Works</h2>
          <p className="text-center text-slate-600 text-sm sm:text-base mb-10 sm:mb-12">From upload to delivery, see every stage in two neat rows.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Choose & Upload', desc: 'Pick a product and upload your photo, name, or message. We support images and custom text.', image: '/assets/trading products/t1.jpg' },
              { step: '2', title: 'Share Details', desc: 'Add names, colors, dates, and special notes so the gift feels personal.', image: '/assets/trading products/t2.jpg' },
              { step: '3', title: 'Customize', desc: 'Preview your design and fine-tune the layout until it feels just right.', image: '/assets/trading products/t3.jpg' },
              { step: '4', title: 'Crafting Starts', desc: 'Our team begins creating your order with careful attention to finish and detail.', image: '/assets/trading products/t4.png' },
              { step: '5', title: 'Quality Check', desc: 'Each item is reviewed to make sure the print, build, and look match your request.', image: '/assets/trading products/t5.JPG' },
              { step: '6', title: 'Packed Safely', desc: 'Your gift is packed securely so it stays perfect while traveling to your doorstep.', image: '/assets/trading products/t6.JPG' },
              { step: '7', title: 'Fast Dispatch', desc: 'We send it out quickly with delivery updates to keep you informed.', image: '/assets/trading products/t7.jpg' },
              { step: '8', title: 'Delivered With Care', desc: 'The finished personalized gift arrives ready to surprise and delight.', image: '/assets/trading products/t8.jpg' },
            ].map((item, idx) => (
              <div key={item.step} className="text-center animate-fade-scale-in" style={{ animationDelay: `${idx * 0.12}s`, animationFillMode: 'backwards' }}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mx-auto bg-slate-200 shadow-md">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-600 text-white font-bold text-sm sm:text-base flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-slate-600 text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/products?customizable=true"
              className="inline-flex items-center gap-2 text-pink-600 font-semibold hover:text-pink-700 text-sm sm:text-base"
            >
              Explore personalized gifts
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Now - product strip with images */}
      <section className="py-10 sm:py-14 md:py-16 bg-white">
        <div className="w-full px-3 sm:px-4">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-wider text-pink-500 font-medium">Trending now</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mt-1">Most loved this week</h2>
            </div>
            <Link href="/products?sort=popular" className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-800 sm:w-auto sm:shrink-0">
              View all trending
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              { title: 'Photo Frames', image: '/assets/trading products/t1.jpg', href: '/products?category=Frames' },
              { title: 'Custom Mugs', image: '/assets/trading products/t3.jpg', href: '/products?category=Mugs' },
              { title: 'Jewelry & Boxes', image: '/assets/trading products/t4.png', href: '/products' },
              { title: 'Keychains', image: '/assets/trading products/t5.JPG', href: '/products' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all duration-300 hover-lift-3d"
              >
                <div className="aspect-square relative bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 p-3 text-white font-semibold text-sm sm:text-base">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer banner */}
      <section className="py-6 sm:py-8">
        <div className="w-full px-3 sm:px-4">
          <Link
            href="/products?sort=price_asc"
            className="group block rounded-2xl overflow-hidden border border-pink-200 shadow-md hover:shadow-xl transition-all duration-300 hover-lift-3d"
          >
            <div className="relative h-44 sm:h-48 md:h-56 bg-slate-900">
              <Image
                src="/assets/banners/banner1.jpeg"
                alt="Special offer"
                fill
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-14">
                <span className="text-xs font-medium uppercase tracking-wider text-pink-300 sm:text-sm">Limited time</span>
                <h2 className="mt-1 max-w-[16rem] text-lg font-bold text-white sm:max-w-md sm:text-2xl md:max-w-xl md:text-3xl">Up to 50% off on selected gifts</h2>
                <p className="mt-2 max-w-xs text-xs text-white/90 sm:max-w-md sm:text-base">Shop the sale before it ends</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                  Shop sale
                  <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Gift Ideas by Recipient */}
      <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-pink-50 to-white">
        <div className="w-full px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-2 sm:mb-4">Gift Ideas by Recipient</h2>
          <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-10">Find something special for everyone you love</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { label: 'For Wife', subtext: 'Romantic keepsakes and personalized picks', href: '/products?search=Wife%20Gifts', image: '/assets/trading products/t2.jpg', gradient: 'from-pink-900/70' },
              { label: 'For Husband', subtext: 'Useful gifts, frames and accessories', href: '/products?search=Husband%20Gifts', image: '/assets/trading products/t6.JPG', gradient: 'from-slate-900/70' },
              { label: 'For Kids', subtext: 'Fun toys, prints and custom surprises', href: '/products?search=Kids%20Gifts', image: '/assets/trading products/t8.jpg', gradient: 'from-amber-900/60' },
              { label: 'For Mom', subtext: 'Elegant gifts she will truly cherish', href: '/products?search=Mother%20Gifts', image: '/assets/category/c5.webp', gradient: 'from-rose-900/70' },
              { label: 'For Dad', subtext: 'Thoughtful picks for every father figure', href: '/products?search=Father%20Gifts', image: '/assets/category/c4.webp', gradient: 'from-sky-900/70' },
              { label: 'For Sister', subtext: 'Trendy gifts and memory makers', href: '/products?search=Sister%20Gifts', image: '/assets/category/c7.webp', gradient: 'from-fuchsia-900/70' },
              { label: 'For Brother', subtext: 'Cool, practical and personal gifting ideas', href: '/products?search=Brother%20Gifts', image: '/assets/category/c6.webp', gradient: 'from-indigo-900/70' },
              { label: 'For Friends', subtext: 'Best-friend surprises with personality', href: '/products?search=Friend%20Gifts', image: '/assets/trading products/t3.jpg', gradient: 'from-violet-900/70' },
              { label: 'For Couples', subtext: 'Love-filled gifts for pairs and partners', href: '/products?search=Couple%20Gifts', image: '/assets/banners/banner4.webp', gradient: 'from-red-900/70' },
              { label: 'For Colleagues', subtext: 'Corporate and desk-ready gifting picks', href: '/products?search=Corporate%20Gifts', image: '/assets/banners/banner2.jpg', gradient: 'from-slate-800/80' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ring-2 ring-transparent hover:ring-pink-300 hover-tilt-3d"
              >
                <div className="aspect-[3/4] sm:aspect-[4/5] relative bg-slate-200">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} via-black/30 to-transparent`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{item.label}</h3>
                    <p className="text-white/90 text-sm mt-1">{item.subtext}</p>
                    <span className="inline-flex items-center gap-2 mt-3 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                      Shop now
                      <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Gallery - online images */}
      <section className="bg-gradient-to-b from-white via-rose-50/70 to-pink-50/60 py-10 sm:py-14 md:py-16">
        <div className="w-full px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm uppercase tracking-wider text-rose-500 font-semibold">Inspiration</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">Gift ideas & inspiration</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">Curated looks and ideas to help you choose the perfect gift</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { title: 'Photo Gifts', image: '/assets/trading products/t1.jpg', href: '/products?customizable=true' },
              { title: 'Home Decor', image: '/assets/category/c8.png', href: '/products' },
              { title: 'Celebration', image: '/assets/banners/banner3.jpeg', href: '/products?occasion=Birthday' },
              { title: 'Corporate', image: '/assets/category/c4.webp', href: '/products?category=Corporate' },
              { title: 'Anniversary', image: '/assets/category/c2.webp', href: '/products?occasion=Anniversary' },
              { title: 'Wedding', image: '/assets/category/c3.webp', href: '/products?occasion=Wedding' },
              { title: 'Personalized', image: '/assets/category/c5.webp', href: '/products?customizable=true' },
              { title: 'Mini Gifts', image: '/assets/trading products/t5.JPG', href: '/products?search=Mini%20Gifts' },
              { title: 'Return Gifts', image: '/assets/trading products/t7.jpg', href: '/products?search=Return%20Gifts' },
              { title: 'Premium Picks', image: '/assets/banners/banner5.webp', href: '/products?sort=price_desc' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-rose-100/80 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-rose-900/20 to-pink-100/10 opacity-85 transition-opacity group-hover:opacity-95" />
                <div className="absolute inset-0 flex items-end p-4 sm:p-5">
                  <span className="text-white font-bold text-base sm:text-lg drop-shadow-md">{item.title}</span>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/90 p-2 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 text-rose-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-8 sm:mb-12">Why Choose Presto?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center px-2">
              <div className="bg-pink-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 hover-lift-3d transition-transform duration-300">
                <FontAwesomeIcon icon={faGift} className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Unique Gifts</h3>
              <p className="text-slate-600 text-sm sm:text-base">Handpicked collection of personalized gifts that make every occasion special</p>
            </div>
            <div className="text-center px-2">
              <div className="bg-pink-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 hover-lift-3d transition-transform duration-300">
                <FontAwesomeIcon icon={faAward} className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Quality Assured</h3>
              <p className="text-slate-600 text-sm sm:text-base">Premium quality materials and craftsmanship in every gift we create</p>
            </div>
            <div className="text-center px-2">
              <div className="bg-pink-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 hover-lift-3d transition-transform duration-300">
                <FontAwesomeIcon icon={faHeart} className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Made with Love</h3>
              <p className="text-slate-600 text-sm sm:text-base">Each gift is carefully crafted with attention to detail and personal care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-14 md:py-16 bg-pink-50">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-8 sm:mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Priya Sharma", rating: 5, text: "Amazing quality and fast delivery! The personalized frame was exactly what I wanted." },
              { name: "Rahul Verma", rating: 5, text: "Excellent service and beautiful gifts. My wife loved the custom jewelry!" },
              { name: "Anita Patel", rating: 5, text: "Great variety of gifts and reasonable prices. Will definitely order again." }
            ].map((review, index) => (
              <div key={index} className="rounded-xl border border-rose-100/70 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:border-pink-200 hover-lift-3d sm:p-6">
                <div className="flex gap-1 mb-2 sm:mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                  ))}
                </div>
                <p className="mb-3 text-sm text-slate-600 sm:mb-4 sm:text-base line-clamp-3">"{review.text}"</p>
                <p className="text-sm font-semibold text-rose-700 sm:text-base">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 py-12 text-slate-800 shadow-inner sm:py-16 md:py-20">
        <div className="w-full px-3 sm:px-4 text-center">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-rose-700 sm:mb-4 sm:text-2xl md:text-3xl">Ready to Find the Perfect Gift?</h2>
          <p className="mb-6 text-base text-rose-600 sm:mb-8 sm:text-lg md:text-xl">Join thousands of happy customers who found their perfect gift with us</p>
          <Link
            href="/products"
            className="inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:bg-rose-600 hover-lift-3d sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            Start Shopping Now
            <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </section>

       {/* Features Bar */}
       <section className="border-y border-rose-100/70 bg-gradient-to-r from-white via-pink-50/70 to-white py-4 sm:py-6">
        <div className="w-full px-3 sm:px-4">
          <div className="grid grid-cols-2 gap-4 text-center sm:gap-6 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 px-3 py-3 shadow-sm sm:flex-row sm:gap-3">
              <FontAwesomeIcon icon={faTruck} className="h-5 w-5 shrink-0 text-rose-500 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 px-3 py-3 shadow-sm sm:flex-row sm:gap-3">
              <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5 shrink-0 text-rose-500 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 px-3 py-3 shadow-sm sm:flex-row sm:gap-3">
              <FontAwesomeIcon icon={faHeadphones} className="h-5 w-5 shrink-0 text-rose-500 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 px-3 py-3 shadow-sm sm:flex-row sm:gap-3">
              <FontAwesomeIcon icon={faGift} className="h-5 w-5 shrink-0 text-rose-500 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Gift Wrapping</span>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
