'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setWishlist } from '@/store/wishlistSlice';
import { addToCart, setCart } from '@/store/cartSlice';
import { wishlistService, wishlistResponseToItems } from '@/services/wishlistService';
import { cartService } from '@/services/cartService';
import { getBase } from '@/lib/api';

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const items = useSelector((s: RootState) => s.wishlist.items);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace('/register');
    }
  }, [mounted, token, router]);

  if (!mounted || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      const res = await wishlistService.removeItem(id);
      dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
    } catch {
      /* remove failed */
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: (typeof items)[0]) => {
    if (!/^[a-fA-F0-9]{24}$/.test(item.id)) {
      dispatch(
        addToCart({
          productId: {
            _id: item.id,
            name: item.name,
            price: item.price,
            category: 'General',
            images: [item.image],
            description: item.name,
            customizable: true,
            occasions: ['Birthday', 'Anniversary'],
          },
          quantity: 1,
        })
      );
      return;
    }
    try {
      const c = await cartService.addItem(item.id, 1);
      dispatch(setCart({ items: c?.items ?? [] }));
    } catch {
      /* add to cart failed */
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Wishlist</h1>
        <div className="mt-6 sm:mt-8 rounded-xl border border-dashed border-pink-200 bg-pink-50/80 p-8 sm:p-12 text-center animate-fade-scale-in">
          <FontAwesomeIcon icon={faHeart} className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-pink-400" />
          <p className="mt-2 text-slate-600 text-sm sm:text-base">Your wishlist is empty. Add products from the shop.</p>
          <Link href="/products" className="mt-4 inline-block rounded-lg bg-pink-600 px-5 sm:px-6 py-2.5 sm:py-3 font-medium text-white hover:bg-pink-700 text-sm sm:text-base touch-manipulation hover-lift-3d transition-all duration-300">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Wishlist ({items.length})</h1>
      <ul className="mt-6 sm:mt-8 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 rounded-xl border border-pink-200/80 bg-white p-4 shadow-sm hover-lift-3d transition-all duration-300"
          >
            <Link href={`/products/${item.id}`} className="relative h-24 w-full sm:h-24 sm:w-24 rounded-lg overflow-hidden bg-pink-50 shrink-0">
              {item.image ? (
                <Image
                  src={item.image.startsWith('http') ? item.image : `${getBase()}/uploads/${item.image}`}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-pink-300" />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.id}`}>
                <h2 className="font-semibold text-slate-800 hover:text-pink-600 line-clamp-2 transition-colors">{item.name}</h2>
              </Link>
              <p className="mt-1 text-base font-bold text-pink-600">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleAddToCart(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white hover:bg-pink-700 touch-manipulation hover-lift-3d transition-all duration-300"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 touch-manipulation transition-colors"
                title="Remove from wishlist"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link href="/products" className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors">
          Continue shopping →
        </Link>
      </div>
    </div>
  );
}
