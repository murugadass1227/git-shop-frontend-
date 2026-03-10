export function getBase(): string {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return `${process.env.NEXT_PUBLIC_API_URL}/api`;
    }

    const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocalDev ? 'http://localhost:3000/api' : '/api';
  }
  // Server-side: must call the backend directly (rewrites only apply to browser requests)
  const backend = process.env.API_BACKEND_URL || 'http://localhost:3000';
  return `${backend}/api`;
}

export function getAvatarUrl(avatarPath: string | undefined): string | null {
  if (!avatarPath) return null;
  return `${getBase()}/uploads/${avatarPath}`;
}

export function getUploadUrl(filePath: string | undefined): string | null {
  if (!filePath) return null;
  return filePath.startsWith('http') ? filePath : `${getBase()}/uploads/${filePath}`;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token = getToken(), ...rest } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(`${getBase()}${path}`, { ...rest, headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    throw new Error(msg.includes('fetch') || msg.includes('ECONNREFUSED') ? 'Backend unavailable. Please try again.' : msg);
  }
  if (!res.ok) {
    let message = res.statusText || 'Request failed';
    try {
      const body = await res.json();
      if (body && typeof body === 'object' && typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      // response was not JSON
    }
    throw new Error(message);
  }
  try {
    return await res.json();
  } catch {
    throw new Error('Invalid response from server');
  }
}

export type AuthUser = { id: string; name: string; email?: string; phone?: string; avatar?: string; role?: 'user' | 'admin' };

export type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  customizable: boolean;
  occasions: string[];
  popularity?: number;
  discountPercent?: number;
  rating?: number;
};

export type CartItem = {
  productId: Product;
  quantity: number;
  customization?: { imageUrl?: string; text?: string; font?: string; color?: string };
};

export type CartResponse = {
  _id: string;
  userId: string;
  items: CartItem[];
};

export type WishlistResponse = {
  _id: string | null;
  userId: string;
  productIds: Product[];
};

export type Order = {
  _id: string;
  userId: string;
  items: { productId: Product; quantity: number; price: number; customization?: object }[];
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
};

export type ShippingAddress = {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};
