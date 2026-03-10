import { api, type Order, type ShippingAddress } from '@/lib/api';

export type { Order, ShippingAddress };

export const orderService = {
  create: (shippingAddress: ShippingAddress) =>
    api<Order>('/orders', { method: 'POST', body: JSON.stringify({ shippingAddress }) }),
  list: () => api<Order[]>('/orders'),
  get: (id: string) => api<Order>(`/orders/${id}`),
};
