'use client';

import Link from 'next/link';
import { getUploadUrl, type Product } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function productImageUrl(path: string): string {
  return getUploadUrl(path) ?? '';
}

type ProductCardProps = {
  product: Product;
  inWishlist?: boolean;
  onWishlistClick?: (product: Product) => void;
};

export function ProductCard({ product, inWishlist = false, onWishlistClick }: ProductCardProps) {
  const firstImagePath = product.images?.[0];
  const hasImage = Boolean(firstImagePath && String(firstImagePath).trim());
  const imageSrc = hasImage ? productImageUrl(String(firstImagePath)) : '';
  const discountedPrice = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : null;

  return (
    <Card className="group premium-card flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white min-w-0 hover-lift-3d">
      <div className="relative aspect-square bg-slate-50 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <Link href={`/products/${product._id}`} className="block h-full w-full">
          <div className="relative h-full w-full">
            {hasImage && (
              <img
                src={imageSrc}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = 'none';
                  const fallback = el.parentElement?.querySelector('[data-product-card-fallback]');
                  if (fallback instanceof HTMLElement) fallback.classList.remove('hidden');
                }}
              />
            )}
            <div
              data-product-card-fallback
              className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-slate-50 ${hasImage ? 'hidden' : ''}`}
              aria-hidden
            >
              <FontAwesomeIcon icon={faGift} className="h-12 w-12 sm:h-16 sm:w-16 text-rose-300 group-hover:text-rose-500 transition-colors duration-300" />
            </div>
          </div>
        </Link>
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
            {product.discountPercent}% OFF
          </span>
        )}
        {onWishlistClick ? (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistClick(product); }}
            className={`absolute right-2 top-2 rounded-full p-2 shadow-md touch-manipulation transition-all duration-200 ${
              inWishlist ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-white/95 text-slate-600 hover:bg-white hover:text-rose-600 backdrop-blur-sm'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FontAwesomeIcon icon={faHeart} className={`h-4 w-4 ${inWishlist ? 'text-rose-600' : ''}`} />
          </button>
        ) : (
          <Link
            href="/wishlist"
            className="absolute right-2 top-2 rounded-full bg-white/95 p-2 shadow-md hover:bg-white touch-manipulation transition-all duration-200 backdrop-blur-sm"
            title="Add to wishlist"
          >
            <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-slate-600 group-hover:text-rose-600" />
          </Link>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-4 sm:p-5 min-w-0">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-slate-800 group-hover:text-rose-600 text-sm sm:text-base line-clamp-2 transition-colors duration-200">{product.name}</h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-slate-500/90">{product.description}</p>
        {product.rating != null && (
          <p className="mt-1.5 text-xs sm:text-sm text-amber-600 font-medium">★ {product.rating.toFixed(1)}</p>
        )}
        <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-base sm:text-lg font-bold text-rose-600">
              ₹{discountedPrice ?? product.price}
            </span>
            {discountedPrice != null && (
              <span className="text-xs sm:text-sm text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>
          {product.customizable && (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-rose-700 shrink-0 border border-rose-100">
              Custom
            </span>
          )}
        </div>
        <Button
          variant="outline"
          className="mt-3 sm:mt-4 w-full rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all duration-300 hover-lift-3d"
          asChild
        >
          <Link href={`/products/${product._id}`}>
            Add to cart
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
