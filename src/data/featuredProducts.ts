export type FeaturedProduct = {
  id: string;
  name: string;
  image: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  category: string;
  occasions: string[];
  customizable: boolean;
  shortDescription: string;
  description: string;
  highlights: string[];
  details: string[];
};

export const featuredProducts: FeaturedProduct[] = [
  {
    id: '1',
    name: 'Personalized Photo Frame',
    image: '/assets/trading products/t1.jpg',
    price: 599,
    originalPrice: 899,
    rating: 4.8,
    reviews: 234,
    badge: 'Best Seller',
    category: 'Frames',
    occasions: ['Birthday', 'Anniversary', 'Wedding'],
    customizable: true,
    shortDescription: 'Custom frame for your favorite memories.',
    description:
      'Turn your favorite photo into a keepsake with this personalized photo frame. It is crafted for gifting moments that deserve to stay on display every day.',
    highlights: ['Premium printed finish', 'Ready-to-display tabletop design', 'Name and message customization'],
    details: ['Material: durable engineered wood', 'Best for desks, side tables, and memory corners', 'Ideal for couples, family, and milestone celebrations'],
  },
  {
    id: '2',
    name: 'Custom Engraved Watch',
    image: '/assets/trading products/t2.jpg',
    price: 1299,
    originalPrice: 1899,
    rating: 4.9,
    reviews: 156,
    badge: 'Premium',
    category: 'Accessories',
    occasions: ['Birthday', 'Corporate', 'Anniversary'],
    customizable: true,
    shortDescription: 'Elegant engraved watch for meaningful gifting.',
    description:
      'A sleek watch with custom engraving support, designed for premium gifting. Add initials or a short message to make it deeply personal.',
    highlights: ['Minimal premium dial', 'Back engraving option', 'Gift-ready presentation'],
    details: ['Material: alloy case with leather-style strap', 'Suitable for personal and professional gifting', 'A timeless pick for him and executive gifts'],
  },
  {
    id: '3',
    name: 'Personalized Mug Set',
    image: '/assets/trading products/t3.jpg',
    price: 399,
    originalPrice: 599,
    rating: 4.7,
    reviews: 89,
    badge: 'Popular',
    category: 'Mugs',
    occasions: ['Birthday', 'Friendship', 'Thank You'],
    customizable: true,
    shortDescription: 'Everyday mugs with your own text or design.',
    description:
      'This personalized mug set brings warmth to every sip. Add names, quotes, or artwork to create a practical gift with a personal touch.',
    highlights: ['High-quality print area', 'Comfortable grip and finish', 'Great for daily use'],
    details: ['Material: ceramic', 'Microwave-friendly design', 'Perfect for friends, couples, and office gifting'],
  },
  {
    id: '4',
    name: 'Custom Jewelry Box',
    image: '/assets/trading products/t4.png',
    price: 799,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 201,
    badge: 'New',
    category: 'Keepsakes',
    occasions: ['Anniversary', 'Wedding', 'Valentine'],
    customizable: true,
    shortDescription: 'Elegant storage for treasured accessories.',
    description:
      'Store rings, earrings, and little keepsakes in a jewelry box that feels personal and premium. Custom detailing makes it ideal for special occasions.',
    highlights: ['Compact premium finish', 'Multiple storage sections', 'Personalized top detail'],
    details: ['Designed for jewelry, charms, and keepsakes', 'Ideal for bridal and anniversary gifting', 'Blends utility with elegant presentation'],
  },
  {
    id: '5',
    name: 'Engraved Keychain',
    image: '/assets/trading products/t5.JPG',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviews: 67,
    badge: 'Sale',
    category: 'Accessories',
    occasions: ['Birthday', 'Return Gifts', 'Corporate'],
    customizable: true,
    shortDescription: 'Compact personalized keychain for daily carry.',
    description:
      'A simple yet thoughtful engraved keychain that is easy to gift and easy to carry. Personalize it with initials, names, or a short date.',
    highlights: ['Pocket-friendly gift', 'Laser engraving support', 'Durable for everyday use'],
    details: ['Material: metal finish', 'Suitable for car keys, bags, and daily essentials', 'Great for budget-friendly personalized gifting'],
  },
  {
    id: '6',
    name: 'Personalized T-Shirt',
    image: '/assets/trading products/t6.JPG',
    price: 499,
    originalPrice: 699,
    rating: 4.8,
    reviews: 145,
    badge: 'Trending',
    category: 'Apparel',
    occasions: ['Birthday', 'Team Events', 'Couple Gifts'],
    customizable: true,
    shortDescription: 'Wearable gift with custom print and message.',
    description:
      'Create a standout personalized t-shirt with custom text, names, or simple artwork. It is fun, expressive, and perfect for casual gifting.',
    highlights: ['Soft everyday fabric feel', 'Custom print placement', 'Popular for group gifting'],
    details: ['Comfortable regular fit', 'Best for birthdays, reunions, and themed occasions', 'Available for personal statements and fun gifting'],
  },
  {
    id: '7',
    name: 'Custom Phone Case',
    image: '/assets/trading products/t7.jpg',
    price: 299,
    originalPrice: 449,
    rating: 4.7,
    reviews: 98,
    badge: 'Hot',
    category: 'Accessories',
    occasions: ['Birthday', 'Graduation', 'Friendship'],
    customizable: true,
    shortDescription: 'Photo or text case for daily style.',
    description:
      'Protect your phone with a case that reflects your style. Upload a favorite image or add custom text to turn a basic essential into a personal gift.',
    highlights: ['Slim protective profile', 'Custom photo support', 'Glossy vibrant print finish'],
    details: ['Made for everyday handling', 'Good balance of style and utility', 'Excellent gifting option for teens and friends'],
  },
  {
    id: '8',
    name: 'Personalized Cushion',
    image: '/assets/trading products/t8.jpg',
    price: 349,
    originalPrice: 549,
    rating: 4.5,
    reviews: 43,
    badge: 'Limited',
    category: 'Home Decor',
    occasions: ['Housewarming', 'Anniversary', 'Birthday'],
    customizable: true,
    shortDescription: 'Soft decor cushion with personal print.',
    description:
      'A personalized cushion adds comfort and a heartfelt touch to any room. Customize it with a photo, quote, or celebratory message.',
    highlights: ['Soft-touch fabric', 'Decor-friendly gift idea', 'Custom print front panel'],
    details: ['Best for bedrooms, sofas, and cozy corners', 'Works well for housewarming and couple gifts', 'Comfort meets meaningful personalization'],
  },
];

export function getFeaturedProductById(id: string) {
  return featuredProducts.find((product) => product.id === id);
}
