import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  FileText,
  Gift,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Percent,
  Settings2,
  ShoppingCart,
  Truck,
  Users,
} from 'lucide-react';

export type AdminNavItem = {
  id: string;
  section: 'Dashboards' | 'Catalog' | 'Operations' | 'Growth';
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const adminNavigation: AdminNavItem[] = [
  {
    id: 'dashboard',
    section: 'Dashboards',
    label: 'Admin dashboard',
    href: '/admin/dashboard',
    description: 'Total orders, revenue, customers and sales overview',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    section: 'Catalog',
    label: 'Product management',
    href: '/admin/products',
    description: 'Catalog, stock, pricing and featured products',
    icon: Package,
  },
  {
    id: 'categories',
    section: 'Catalog',
    label: 'Category management',
    href: '/admin/categories',
    description: 'Collections, occasions and merchandising groups',
    icon: Boxes,
  },
  {
    id: 'orders',
    section: 'Operations',
    label: 'Order management',
    href: '/admin/orders',
    description: 'Order flow, payment status and fulfilment actions',
    icon: ShoppingCart,
  },
  {
    id: 'customers',
    section: 'Operations',
    label: 'Customer management',
    href: '/admin/customers',
    description: 'Customer insights, loyalty and support history',
    icon: Users,
  },
  {
    id: 'users',
    section: 'Operations',
    label: 'User management',
    href: '/admin/users',
    description: 'Admin roles, permissions and staff access control',
    icon: Settings2,
  },
  {
    id: 'customization-fields',
    section: 'Catalog',
    label: 'Customization field management',
    href: '/admin/customization-fields',
    description: 'Per-product input fields, uploads and personalization options',
    icon: Gift,
  },
  {
    id: 'delivery',
    section: 'Operations',
    label: 'Delivery management',
    href: '/admin/delivery',
    description: 'Delivery slots, dispatch queue and tracking',
    icon: Truck,
  },
  {
    id: 'coupons',
    section: 'Growth',
    label: 'Coupon management',
    href: '/admin/coupons',
    description: 'Discount campaigns, promo rules and performance',
    icon: Percent,
  },
  {
    id: 'reviews',
    section: 'Growth',
    label: 'Review management',
    href: '/admin/reviews',
    description: 'Ratings moderation and quality signals',
    icon: MessageSquareQuote,
  },
  {
    id: 'cms',
    section: 'Growth',
    label: 'CMS management',
    href: '/admin/cms',
    description: 'Homepage banners, content blocks and announcements',
    icon: FileText,
  },
];

export const adminNavigationSections = ['Dashboards', 'Catalog', 'Operations', 'Growth'] as const;

export const adminInsightTabs = ['Overview', 'Products', 'Orders', 'Customers', 'Marketing'];
