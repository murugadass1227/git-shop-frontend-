import { api, type CartResponse, type CartItem } from '@/lib/api';

export type { CartResponse, CartItem };

export const cartService = {
  get: () => api<CartResponse>('/cart'),
  addItem: (productId: string, quantity?: number, customization?: object) =>
    api<CartResponse>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: quantity ?? 1, customization }),
    }),
  updateItem: (productId: string, quantity: number) =>
    api<CartResponse>(`/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeItem: (productId: string) => api<CartResponse>(`/cart/items/${productId}`, { method: 'DELETE' }),
};
