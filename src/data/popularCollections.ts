export type CollectionGroup = {
  title: string;
  items: { name: string; href: string }[];
};

export type PopularCollection = {
  id: string;
  title: string;
  href: string;
  image: string;
  description: string;
  highlight: string;
  groups: CollectionGroup[];
};

const searchHref = (term: string) => `/products?search=${encodeURIComponent(term)}`;

export const popularCollections: PopularCollection[] = [
  {
    id: 'birthday',
    title: 'Birthday',
    href: '/products?occasion=Birthday',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80',
    description: 'Birthday gifts for every relation, age group, and budget.',
    highlight: 'Best for surprise gifting',
    groups: [
      {
        title: 'For Him',
        items: [
          { name: 'For Him', href: searchHref('Birthday Gifts For Him') },
          { name: 'Boyfriend Gifts', href: searchHref('Boyfriend Gifts') },
          { name: 'Husband Gifts', href: searchHref('Husband Gifts') },
          { name: 'Brother Gifts', href: searchHref('Brother Gifts') },
          { name: 'Father Gifts', href: searchHref('Father Gifts') },
          { name: 'Friend Gifts', href: searchHref('Friend Gifts') },
        ],
      },
      {
        title: 'For Her',
        items: [
          { name: 'For Her', href: searchHref('Birthday Gifts For Her') },
          { name: 'Girlfriend Gifts', href: searchHref('Girlfriend Gifts') },
          { name: 'Wife Gifts', href: searchHref('Wife Gifts') },
          { name: 'Sister Gifts', href: searchHref('Sister Gifts') },
          { name: 'Mother Gifts', href: searchHref('Mother Gifts') },
          { name: 'Best Friend Gifts', href: searchHref('Best Friend Gifts') },
        ],
      },
      {
        title: 'For Kids',
        items: [
          { name: 'For Kids', href: searchHref('Birthday Gifts For Kids') },
          { name: 'Boys Gifts', href: searchHref('Boys Gifts') },
          { name: 'Girls Gifts', href: searchHref('Girls Gifts') },
          { name: 'Baby Gifts', href: searchHref('Baby Gifts') },
        ],
      },
      {
        title: 'Gift Types',
        items: [
          { name: 'Photo Frames', href: '/products?category=Frames' },
          { name: 'Crystal Gifts', href: '/products?category=Crystals' },
          { name: 'Lamps', href: searchHref('Lamps') },
          { name: 'Mugs', href: '/products?category=Mugs' },
          { name: 'Caricature Gifts', href: searchHref('Caricature Gifts') },
          { name: 'Mini Gifts', href: searchHref('Mini Gifts') },
        ],
      },
      {
        title: 'Budget Gifts',
        items: [
          { name: 'Gifts Under ₹299', href: '/products?maxPrice=299' },
          { name: 'Gifts Under ₹499', href: '/products?maxPrice=499' },
          { name: 'Gifts Under ₹999', href: '/products?maxPrice=999' },
          { name: 'Premium Gifts', href: '/products?minPrice=1000' },
        ],
      },
    ],
  },
  {
    id: 'anniversary',
    title: 'Anniversary',
    href: '/products?occasion=Anniversary',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    description: 'Romantic anniversary picks for couples and combo gifting.',
    highlight: 'Top couple gifting picks',
    groups: [
      {
        title: 'For Husband',
        items: [
          { name: 'For Husband', href: searchHref('Anniversary Gifts For Husband') },
          { name: 'Photo Frames', href: '/products?search=Anniversary Photo Frames' },
          { name: 'Crystal Gifts', href: '/products?search=Anniversary Crystal Gifts' },
          { name: 'Couple Lamps', href: searchHref('Couple Lamps') },
        ],
      },
      {
        title: 'For Wife',
        items: [
          { name: 'For Wife', href: searchHref('Anniversary Gifts For Wife') },
          { name: 'Personalized Frames', href: searchHref('Personalized Frames') },
          { name: 'Resin Art Gifts', href: searchHref('Resin Art Gifts') },
          { name: 'Mini Gifts', href: searchHref('Mini Gifts') },
        ],
      },
      {
        title: 'Couple Gifts',
        items: [
          { name: 'Couple Gifts', href: searchHref('Couple Gifts') },
          { name: 'Couple Frames', href: searchHref('Couple Frames') },
          { name: 'Couple Lamps', href: searchHref('Couple Lamps') },
          { name: 'Thumb Impression Gifts', href: searchHref('Thumb Impression Gifts') },
          { name: 'Couple Caricatures', href: searchHref('Couple Caricatures') },
        ],
      },
      {
        title: 'Anniversary Combos',
        items: [
          { name: 'Frame + Keychain', href: searchHref('Frame Keychain Combo') },
          { name: 'Lamp + Mug', href: searchHref('Lamp Mug Combo') },
          { name: 'Frame + Lamp', href: searchHref('Frame Lamp Combo') },
        ],
      },
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate Gifts',
    href: '/products?category=Corporate',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description: 'Awards, desk accessories, and branded gifts for teams.',
    highlight: 'Bulk and branding friendly',
    groups: [
      {
        title: 'Corporate Awards',
        items: [
          { name: 'Corporate Awards', href: searchHref('Corporate Awards') },
          { name: 'Crystal Trophies', href: searchHref('Crystal Trophies') },
          { name: 'Acrylic Trophies', href: searchHref('Acrylic Trophies') },
          { name: 'MDF Trophies', href: searchHref('MDF Trophies') },
        ],
      },
      {
        title: 'Desk Gifts',
        items: [
          { name: 'Desk Frames', href: searchHref('Desk Frames') },
          { name: 'Table Top Calendar', href: searchHref('Table Top Calendar') },
          { name: 'Name Plates', href: searchHref('Name Plates') },
        ],
      },
      {
        title: 'Employee Gifts',
        items: [
          { name: 'Customized Mugs', href: searchHref('Customized Mugs') },
          { name: 'Keychains', href: searchHref('Keychains') },
          { name: 'Crystal Gifts', href: searchHref('Corporate Crystal Gifts') },
        ],
      },
      {
        title: 'Bulk Corporate Orders',
        items: [
          { name: 'Bulk Corporate Orders', href: searchHref('Bulk Corporate Orders') },
          { name: 'Branding Gifts', href: searchHref('Branding Gifts') },
          { name: 'Company Logo Gifts', href: searchHref('Company Logo Gifts') },
        ],
      },
    ],
  },
  {
    id: 'personalized',
    title: 'Personalized Gifts',
    href: '/products?customizable=true',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80',
    description: 'Photo gifts, engraving, lamps, and one-of-a-kind custom pieces.',
    highlight: 'Most loved custom gifting',
    groups: [
      {
        title: 'Photo Gifts',
        items: [
          { name: 'Photo Frames', href: '/products?category=Frames' },
          { name: 'Photo Crystals', href: searchHref('Photo Crystals') },
          { name: 'Photo Lamps', href: searchHref('Photo Lamps') },
        ],
      },
      {
        title: 'Name Engraving Gifts',
        items: [
          { name: 'Wooden Engraving', href: searchHref('Wooden Engraving') },
          { name: 'Crystal Engraving', href: searchHref('Crystal Engraving') },
          { name: 'Acrylic Engraving', href: searchHref('Acrylic Engraving') },
        ],
      },
      {
        title: 'Custom Lamps',
        items: [
          { name: 'Acrylic Lamps', href: searchHref('Acrylic Lamps') },
          { name: 'Moon Lamps', href: searchHref('Moon Lamps') },
          { name: 'LED Lamps', href: searchHref('LED Lamps') },
        ],
      },
      {
        title: 'Couple Gifts',
        items: [
          { name: 'Couple Gifts', href: searchHref('Couple Gifts') },
          { name: 'Couple Frames', href: searchHref('Couple Frames') },
          { name: 'Couple Lamps', href: searchHref('Couple Lamps') },
          { name: 'Thumb Impression Gifts', href: searchHref('Thumb Impression Gifts') },
          { name: 'Caricature Gifts', href: searchHref('Caricature Gifts') },
        ],
      },
    ],
  },
  {
    id: 'occasions',
    title: 'Occasions',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    description: 'Shop by celebration, milestone, and festive gifting moments.',
    highlight: 'Festival gifting special',
    groups: [
      {
        title: 'Occasion Gifts',
        items: [
          { name: 'Birthday Gifts', href: '/products?occasion=Birthday' },
          { name: 'Wedding Gifts', href: '/products?occasion=Wedding' },
          { name: 'Anniversary Gifts', href: '/products?occasion=Anniversary' },
          { name: 'Baby Shower Gifts', href: searchHref('Baby Shower Gifts') },
          { name: 'House Warming Gifts', href: searchHref('House Warming Gifts') },
          { name: 'Festival Gifts', href: searchHref('Festival Gifts') },
        ],
      },
      {
        title: 'Festival Gifts',
        items: [
          { name: 'Diwali Gifts', href: searchHref('Diwali Gifts') },
          { name: 'Christmas Gifts', href: searchHref('Christmas Gifts') },
          { name: 'New Year Gifts', href: searchHref('New Year Gifts') },
          { name: "Valentine's Gifts", href: searchHref("Valentine's Gifts") },
        ],
      },
    ],
  },
  {
    id: 'mini-you',
    title: 'Mini You Series',
    href: searchHref('Mini You Series'),
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80',
    description: 'Mini figurines, caricatures, and custom statues with personality.',
    highlight: 'Unique figurine gifting',
    groups: [
      {
        title: 'Sub Categories',
        items: [
          { name: 'Mini Couple Dolls', href: searchHref('Mini Couple Dolls') },
          { name: 'Mini Family Dolls', href: searchHref('Mini Family Dolls') },
          { name: 'Mini Wedding Dolls', href: searchHref('Mini Wedding Dolls') },
          { name: 'Mini Birthday Dolls', href: searchHref('Mini Birthday Dolls') },
        ],
      },
      {
        title: 'Product Types',
        items: [
          { name: 'Caricature Dolls', href: searchHref('Caricature Dolls') },
          { name: 'Miniature Figurines', href: searchHref('Miniature Figurines') },
          { name: 'Customized Mini Statues', href: searchHref('Customized Mini Statues') },
        ],
      },
    ],
  },
  {
    id: 'wedding',
    title: 'Wedding Gifts',
    href: '/products?occasion=Wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Elegant wedding and reception gifts for couples, family, and friends.',
    highlight: 'Perfect for grand celebrations',
    groups: [
      {
        title: 'For Couples',
        items: [
          { name: 'Wedding Couple Gifts', href: searchHref('Wedding Couple Gifts') },
          { name: 'Couple Frames', href: searchHref('Couple Frames') },
          { name: 'Couple Lamps', href: searchHref('Couple Lamps') },
          { name: 'Wedding Caricatures', href: searchHref('Wedding Caricatures') },
        ],
      },
      {
        title: 'For Family',
        items: [
          { name: 'Parents Gifts', href: searchHref('Wedding Gifts For Parents') },
          { name: 'Brother Gifts', href: searchHref('Wedding Gifts For Brother') },
          { name: 'Sister Gifts', href: searchHref('Wedding Gifts For Sister') },
          { name: 'Family Frames', href: searchHref('Family Frames') },
        ],
      },
      {
        title: 'Trending Types',
        items: [
          { name: 'Photo Frames', href: '/products?category=Frames' },
          { name: 'Crystal Gifts', href: '/products?category=Crystals' },
          { name: 'Resin Art Gifts', href: searchHref('Resin Art Gifts') },
          { name: 'LED Lamps', href: searchHref('LED Lamps') },
        ],
      },
    ],
  },
  {
    id: 'return-gifts',
    title: 'Return Gifts',
    href: searchHref('Return Gifts'),
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
    description: 'Budget-friendly return gifts for birthdays, baby showers, and events.',
    highlight: 'Bulk gifting made easy',
    groups: [
      {
        title: 'Kids Return Gifts',
        items: [
          { name: 'Birthday Return Gifts', href: searchHref('Birthday Return Gifts') },
          { name: 'School Return Gifts', href: searchHref('School Return Gifts') },
          { name: 'Toy Gifts', href: searchHref('Toy Gifts') },
          { name: 'Mini Gifts', href: searchHref('Mini Gifts') },
        ],
      },
      {
        title: 'Event Return Gifts',
        items: [
          { name: 'Baby Shower Return Gifts', href: searchHref('Baby Shower Return Gifts') },
          { name: 'Wedding Return Gifts', href: searchHref('Wedding Return Gifts') },
          { name: 'Housewarming Return Gifts', href: searchHref('Housewarming Return Gifts') },
          { name: 'Festival Return Gifts', href: searchHref('Festival Return Gifts') },
        ],
      },
      {
        title: 'Popular Picks',
        items: [
          { name: 'Keychains', href: searchHref('Keychains') },
          { name: 'Customized Mugs', href: searchHref('Customized Mugs') },
          { name: 'Photo Frames', href: '/products?category=Frames' },
          { name: 'Acrylic Gifts', href: searchHref('Acrylic Gifts') },
        ],
      },
    ],
  },
];
