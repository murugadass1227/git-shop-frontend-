'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
import type { RootState } from '@/store/store';
import type { FeaturedProduct } from '@/data/featuredProducts';

export function FeaturedProductDetailClient({ product }: { product: FeaturedProduct }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const [qty, setQty] = useState(1);

  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAdd = () => {
    if (!token) {
      router.push('/register');
      return;
    }

    dispatch(
      addToCart({
        productId: {
          _id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          images: [product.image],
          description: product.description,
          customizable: product.customizable,
          occasions: product.occasions,
          rating: product.rating,
        },
        quantity: qty,
      })
    );

    router.push('/cart');
  };

  const handleWishlist = () => {
    if (!token) {
      router.push('/register');
      return;
    }

    dispatch(
      toggleWishlist({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
      })
    );
  };

  return (
    <div className="mt-8 space-y-5 rounded-3xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="featured-product-qty" className="text-sm font-medium text-slate-700">
          Quantity
        </label>
        <input
          id="featured-product-qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4" />
          Add to cart
        </button>
        <button
          type="button"
          onClick={handleWishlist}
          className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
            inWishlist
              ? 'border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
          {inWishlist ? 'In wishlist' : 'Add to wishlist'}
        </button>
      </div>

      {!token && (
        <p className="text-sm text-slate-500">Login pannina apram cart and wishlist use panna mudiyum.</p>
      )}
    </div>
  );
}
