import { api, type WishlistResponse, type Product } from '@/lib/api';
import type { WishlistItem } from '@/store/wishlistSlice';

function mapProductToWishlistItem(p: Product): WishlistItem {
  const hasDiscount = p.discountPercent && p.discountPercent > 0;
  const price = hasDiscount ? Math.round(p.price * (1 - (p.discountPercent ?? 0) / 100)) : p.price;
  const originalPrice = hasDiscount ? p.price : undefined;
  return {
    id: p._id,
    name: p.name,
    image: p.images?.[0] ?? '',
    price,
    originalPrice,
    rating: p.rating,
  };
}

export function wishlistResponseToItems(res: WishlistResponse | null): WishlistItem[] {
  if (!res?.productIds?.length) return [];
  return (res.productIds as Product[]).map(mapProductToWishlistItem);
}

const VALID_PRODUCT_ID = /^[a-fA-F0-9]{24}$/;
function assertValidProductId(productId: string): void {
  if (!productId || !VALID_PRODUCT_ID.test(productId)) {
    throw new Error('Invalid product ID – only products from the shop can be saved to your wishlist.');
  }
}

export const wishlistService = {
  get: () => api<WishlistResponse>('/wishlist'),
  addItem: (productId: string) => {
    assertValidProductId(productId);
    return api<WishlistResponse>('/wishlist/items', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
  removeItem: (productId: string) => {
    assertValidProductId(productId);
    return api<WishlistResponse>(`/wishlist/items/${productId}`, { method: 'DELETE' });
  },
};
