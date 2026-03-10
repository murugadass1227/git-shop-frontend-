'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { cartService } from '@/services/cartService';
import { wishlistService, wishlistResponseToItems } from '@/services/wishlistService';
import type { Product } from '@/lib/api';
import { setCart } from '@/store/cartSlice';
import { setWishlist } from '@/store/wishlistSlice';
import { RootState } from '@/store/store';
import { ShoppingCart, Heart, Zap } from 'lucide-react';

const ESTIMATED_DAYS = 3;

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState('');
  const [frameSize, setFrameSize] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const inWishlist = wishlistItems.some((i) => i.id === product._id);

  const customization = product.customizable
    ? { text: customText, frameSize: frameSize || undefined, message: customMessage || undefined }
    : undefined;

  const handleAddToCart = async () => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent('/products/' + product._id));
      return;
    }
    setLoading(true);
    try {
      const cart = await cartService.addItem(product._id, qty, customization);
      dispatch(setCart({ items: cart.items }));
      router.push('/cart');
    } catch {
      /* add to cart failed */
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent('/products/' + product._id));
      return;
    }
    setLoading(true);
    try {
      await cartService.addItem(product._id, qty, customization);
      router.push('/checkout');
    } catch {
      /* add to cart failed */
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent('/products/' + product._id));
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        const res = await wishlistService.removeItem(product._id);
        dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
      } else {
        const res = await wishlistService.addItem(product._id);
        dispatch(setWishlist({ items: wishlistResponseToItems(res) }));
      }
    } catch {
      /* wishlist toggle failed */
    } finally {
      setWishlistLoading(false);
    }
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + ESTIMATED_DAYS);

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      <p className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
        <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
        <span>Estimated delivery: {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      </p>

      {product.customizable && (
        <div className="space-y-3 sm:space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800">Customization</h3>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">Custom text</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Add a name or message"
              className="mt-1 w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm min-h-[44px]"
            />
          </div>
          {product.category === 'Frames' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700">Frame size</label>
                <select
                  value={frameSize}
                  onChange={(e) => setFrameSize(e.target.value)}
                  className="mt-1 w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Select size</option>
                  <option value="5x7">5&quot; x 7&quot;</option>
                  <option value="8x10">8&quot; x 10&quot;</option>
                  <option value="A4">A4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Upload photo</label>
                <input type="file" accept="image/*" className="mt-1 block w-full max-w-sm text-sm text-slate-600" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Custom message (optional)</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Your message"
              rows={2}
              className="mt-1 w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <label className="text-xs sm:text-sm font-medium text-slate-700">Quantity</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="w-16 sm:w-20 rounded-lg border border-slate-200 px-2 sm:px-3 py-2 text-sm min-h-[40px]"
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-white hover:bg-violet-700 disabled:opacity-50 text-sm sm:text-base min-h-[44px] touch-manipulation"
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          {loading ? 'Adding...' : 'Add to cart'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-violet-600 px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-violet-600 hover:bg-violet-50 disabled:opacity-50 text-sm sm:text-base min-h-[44px] touch-manipulation"
        >
          Buy now
        </button>
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50 ${
            inWishlist ? 'border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${inWishlist ? 'fill-current' : ''}`} />
          {wishlistLoading ? '...' : inWishlist ? 'In wishlist' : 'Add to wishlist'}
        </button>
      </div>

      {!token && (
        <p className="text-xs sm:text-sm text-slate-500">Please log in to add items to cart or buy now.</p>
      )}
    </div>
  );
}
