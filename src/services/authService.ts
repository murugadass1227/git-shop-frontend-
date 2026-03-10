import { api, getBase, type AuthUser } from '@/lib/api';

export type { AuthUser };

const REGISTER_VERIFY_KEY = 'gondget_register_verify';

export type RegisterVerifyPayload = { email: string; name: string; password: string };

export function getRegisterVerifyPayload(): RegisterVerifyPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(REGISTER_VERIFY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RegisterVerifyPayload;
  } catch {
    return null;
  }
}

export function setRegisterVerifyPayload(payload: RegisterVerifyPayload): void {
  if (typeof window !== 'undefined') sessionStorage.setItem(REGISTER_VERIFY_KEY, JSON.stringify(payload));
}

export function clearRegisterVerifyPayload(): void {
  if (typeof window !== 'undefined') sessionStorage.removeItem(REGISTER_VERIFY_KEY);
}

export const authService = {
  register: (payload: { name: string; email?: string; phone?: string; password: string }) =>
    api<{ user: AuthUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        password: payload.password,
        ...(payload.email && { email: payload.email }),
        ...(payload.phone && { phone: payload.phone }),
      }),
      token: null,
    }),
  sendRegisterOtp: (payload: { email: string; name: string; password: string }) =>
    api<{ message: string }>('/auth/register/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: null,
    }),
  resendRegisterOtp: (email: string) =>
    api<{ message: string }>('/auth/register/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
      token: null,
    }),
  verifyRegister: (payload: { email: string; otp: string; name: string; password: string }) =>
    api<{ message: string }>('/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: null,
    }),
  forgotPassword: (email: string) =>
    api<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      token: null,
    }),
  resetPassword: (payload: { email: string; otp: string; newPassword: string }) =>
    api<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
      token: null,
    }),
  login: (emailOrPhone: string, password: string) =>
    api<{ user: AuthUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password }),
      token: null,
    }),
  getMe: () =>
    api<AuthUser>('/auth/me', { method: 'GET' }),
  logout: () =>
    api<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
      // uses default token from getToken() so request is sent with Bearer
    }),
  updateProfile: (name: string) =>
    api<{ user: AuthUser }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name: name.trim() }),
    }),
  uploadAvatar: async (file: File): Promise<{ user: AuthUser }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const form = new FormData();
    form.append('avatar', file);
    const res = await fetch(`${getBase()}/auth/profile/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data && typeof data.message === 'string') ? data.message : 'Upload failed');
    }
    return res.json();
  },
};
