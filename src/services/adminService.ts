import { api } from '@/lib/api';

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: { id: string; total: number; status: string; paymentStatus: string; createdAt: string; itemCount: number }[];
};

export type AdminUserRecord = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  addressCount: number;
  orderCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminCategoryRecord = {
  category: string;
  productCount: number;
  customizableCount: number;
  averagePrice: number;
  latestUpdatedAt?: string;
  sampleProducts: string[];
};

export type AdminCategorySummary = {
  totalProducts: number;
  totalCategories: number;
  categories: AdminCategoryRecord[];
};

export const adminService = {
  getDashboard: () => api<DashboardStats>('/admin/dashboard', { method: 'GET' }),
  getUsers: () => api<AdminUserRecord[]>('/admin/users', { method: 'GET' }),
  getCategories: () => api<AdminCategorySummary>('/admin/categories', { method: 'GET' }),
};
