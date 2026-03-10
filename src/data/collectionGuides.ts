import type { ProductListParams } from '@/services/productService';

export type CollectionTab = {
  id: string;
  label: string;
  description: string;
  filters: ProductListParams;
};

export type CollectionGuide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  badge: string;
  tabs: CollectionTab[];
};

export const collectionGuides: CollectionGuide[] = [
  {
    slug: 'womens-day-gift',
    eyebrow: "Women's Day Edit",
    title: "Women's Day Gift",
    description: 'Curated gifting page with relation-wise tabs, personalised picks and price-friendly filters.',
    heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80',
    badge: 'Trending static page',
    tabs: [
      {
        id: 'wife',
        label: 'Gifts for Wife',
        description: 'Romantic and personalised gifts for your wife.',
        filters: { search: 'Wife Gifts', customizable: true, sort: 'popular' },
      },
      {
        id: 'girlfriend',
        label: 'Gifts for Girlfriend',
        description: 'Cute, memorable and surprise-worthy picks.',
        filters: { search: 'Girlfriend Gifts', customizable: true, sort: 'popular' },
      },
      {
        id: 'mom',
        label: 'Gifts for Mom',
        description: 'Elegant keepsakes and useful personalised gifts.',
        filters: { search: 'Mother Gifts', customizable: true, sort: 'popular' },
      },
      {
        id: 'sister',
        label: 'Gifts for Sister',
        description: 'Trendy gifts, frames and fun personalized items.',
        filters: { search: 'Sister Gifts', customizable: true, sort: 'popular' },
      },
    ],
  },
  {
    slug: 'birthday-gifts-for-her',
    eyebrow: 'Birthday Collection',
    title: 'Birthday Gifts For Her',
    description: 'Static page for shopping birthday gifts with occasion + relation-based filtering.',
    heroImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1400&q=80',
    badge: 'Occasion landing page',
    tabs: [
      {
        id: 'girlfriend',
        label: 'For Girlfriend',
        description: 'Birthday gifts for your girlfriend.',
        filters: { search: 'Birthday Gifts For Girlfriend', occasion: 'Birthday', customizable: true, sort: 'popular' },
      },
      {
        id: 'wife',
        label: 'For Wife',
        description: 'Birthday gifts for your wife.',
        filters: { search: 'Birthday Gifts For Wife', occasion: 'Birthday', customizable: true, sort: 'popular' },
      },
      {
        id: 'mother',
        label: 'For Mother',
        description: 'Heartfelt gifts for your mother.',
        filters: { search: 'Birthday Gifts For Mother', occasion: 'Birthday', customizable: true, sort: 'popular' },
      },
      {
        id: 'best-friend',
        label: 'For Best Friend',
        description: 'Fun birthday picks for your best friend.',
        filters: { search: 'Best Friend Gifts', occasion: 'Birthday', customizable: true, sort: 'popular' },
      },
    ],
  },
  {
    slug: 'personalized-photo-gifts',
    eyebrow: 'Photo Gift Studio',
    title: 'Personalized Photo Gifts',
    description: 'Static page for photo-led collections with product-style tabs and custom filters.',
    heroImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&w=1400&q=80',
    badge: 'Custom gift page',
    tabs: [
      {
        id: 'frames',
        label: 'Photo Frames',
        description: 'Memory frames and wall-ready keepsakes.',
        filters: { category: 'Frames', customizable: true, sort: 'popular' },
      },
      {
        id: 'mugs',
        label: 'Photo Mugs',
        description: 'Daily-use custom mugs with your favorite pictures.',
        filters: { category: 'Mugs', customizable: true, sort: 'popular' },
      },
      {
        id: 'crystals',
        label: '3D Crystals',
        description: 'Premium photo crystals and keepsake blocks.',
        filters: { category: 'Crystals', customizable: true, sort: 'price_desc' },
      },
      {
        id: 'lamps',
        label: 'Photo Lamps',
        description: 'Glow-up gifts with LED and acrylic lamp ideas.',
        filters: { search: 'Photo Lamps', customizable: true, sort: 'popular' },
      },
    ],
  },
  {
    slug: 'corporate-gifts-under-999',
    eyebrow: 'Corporate Catalog',
    title: 'Corporate Gifts Under 999',
    description: 'Budget-friendly static page for corporate and bulk gifting with price filters.',
    heroImage: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80',
    badge: 'Price-filter page',
    tabs: [
      {
        id: 'bulk',
        label: 'Bulk Orders',
        description: 'Bulk and branding-ready corporate picks.',
        filters: { search: 'Bulk Corporate Orders', category: 'Corporate', maxPrice: 999, sort: 'popular' },
      },
      {
        id: 'awards',
        label: 'Awards',
        description: 'Trophies and appreciation gifts.',
        filters: { search: 'Corporate Awards', category: 'Corporate', sort: 'price_desc' },
      },
      {
        id: 'desk',
        label: 'Desk Gifts',
        description: 'Useful desk products and office accessories.',
        filters: { search: 'Desk Gifts', category: 'Corporate', maxPrice: 999, sort: 'price_asc' },
      },
      {
        id: 'custom',
        label: 'Custom Branding',
        description: 'Logo and brand-led personalized corporate gifts.',
        filters: { search: 'Branding Gifts', category: 'Corporate', customizable: true, sort: 'popular' },
      },
    ],
  },
];

export function getCollectionGuide(slug: string) {
  return collectionGuides.find((item) => item.slug === slug);
}

export function filtersToQuery(filters: ProductListParams) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.occasion) params.set('occasion', filters.occasion);
  if (filters.customizable === true) params.set('customizable', 'true');
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  if (filters.sort) params.set('sort', filters.sort);
  return params.toString();
}
