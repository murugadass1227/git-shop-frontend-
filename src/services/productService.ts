import { api, getBase, type Product } from '@/lib/api';

export type { Product };

export type ProductListParams = {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  occasion?: string;
  customizable?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type CreateProductPayload = {
  name: string;
  price: number;
  category: string;
  images?: string[];
  description?: string;
  customizable?: boolean;
  occasions?: string[];
  discountPercent?: number;
  rating?: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export const productService = {
  create: (payload: CreateProductPayload) =>
    api<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        price: payload.price,
        category: payload.category,
        images: payload.images ?? [],
        description: payload.description ?? '',
        customizable: payload.customizable ?? true,
        occasions: payload.occasions ?? [],
        discountPercent: payload.discountPercent ?? 0,
        rating: payload.rating ?? 0,
      }),
    }),
  list: (params?: ProductListParams) => {
    const sp = new URLSearchParams();
    if (params?.category) sp.set('category', params.category);
    if (params?.search) sp.set('search', params.search);
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.occasion) sp.set('occasion', params.occasion);
    if (params?.customizable === true) sp.set('customizable', 'true');
    if (params?.minPrice != null) sp.set('minPrice', String(params.minPrice));
    if (params?.maxPrice != null) sp.set('maxPrice', String(params.maxPrice));
    return api<{ items: Product[]; total: number; page: number; totalPages: number }>(`/products?${sp}`);
  },
  featured: () => api<Product[]>('/products/featured'),
  categories: () => api<string[]>('/products/categories'),
  occasions: () => api<string[]>('/products/occasions'),
  get: (id: string) => api<Product>(`/products/${id}`),
  update: (id: string, payload: UpdateProductPayload) =>
    api<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    api<{ message: string; id: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),
  uploadImages: async (files: File[]): Promise<{ paths: string[] }> => {
    if (!files?.length) return { paths: [] };
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('token');
      if (t) headers['Authorization'] = `Bearer ${t}`;
    }
    const res = await fetch(`${getBase()}/products/upload-images`, { method: 'POST', body: form, headers });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data?.message as string) || 'Upload failed');
    }
    return res.json();
  },
};
