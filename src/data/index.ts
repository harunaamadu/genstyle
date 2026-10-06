export type NavLinkItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  title: string;
  href: string;
  links: NavLinkItem[];
};

export type NavFeatured = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export type NavItem =
  | { type: "link"; title: string; href: string }
  | { type: "dropdown"; title: string; href: string; links: NavLinkItem[] }
  | {
      type: "mega";
      title: string;
      href: string;
      groups: NavGroup[];
      featured: NavFeatured;
    };

export const mainNav: NavItem[] = [
  { type: "link", title: "Home", href: "/" },
  {
    type: "mega",
    title: "Categories",
    href: "/categories",
    groups: [
      {
        title: "Men",
        href: "/men",
        links: [
          { title: "New In", href: "/men/new-in" },
          { title: "Shirts", href: "/men/shirts" },
          { title: "T-Shirts", href: "/men/t-shirts" },
          { title: "Trousers", href: "/men/trousers" },
          { title: "Jackets", href: "/men/jackets" },
        ],
      },
      {
        title: "Women",
        href: "/women",
        links: [
          { title: "New In", href: "/women/new-in" },
          { title: "Dresses", href: "/women/dresses" },
          { title: "Tops", href: "/women/tops" },
          { title: "Skirts", href: "/women/skirts" },
          { title: "Coats", href: "/women/coats" },
        ],
      },
      {
        title: "Kids",
        href: "/kids",
        links: [
          { title: "Boys", href: "/kids/boys" },
          { title: "Girls", href: "/kids/girls" },
          { title: "Babies", href: "/kids/babies" },
          { title: "School Wear", href: "/kids/school-wear" },
          { title: "Shoes", href: "/kids/shoes" },
        ],
      },
      {
        title: "Accessories",
        href: "/accessories",
        links: [
          { title: "Bags", href: "/accessories/bags" },
          { title: "Watches", href: "/accessories/watches" },
          { title: "Jewellery", href: "/accessories/jewellery" },
          { title: "Belts", href: "/accessories/belts" },
          { title: "Sunglasses", href: "/accessories/sunglasses" },
        ],
      },
    ],
    featured: {
      eyebrow: "New season",
      title: "The Autumn Edit",
      description: "Layers, textures and tones made to move with you.",
      href: "/collections/autumn-edit",
      cta: "Shop the edit",
    },
  },
  {
    type: "dropdown",
    title: "Men",
    href: "/men",
    links: [
      { title: "New In", href: "/men/new-in" },
      { title: "Shirts", href: "/men/shirts" },
      { title: "T-Shirts", href: "/men/t-shirts" },
      { title: "Trousers", href: "/men/trousers" },
      { title: "Jackets", href: "/men/jackets" },
      { title: "Shoes", href: "/men/shoes" },
    ],
  },
  {
    type: "dropdown",
    title: "Women",
    href: "/women",
    links: [
      { title: "New In", href: "/women/new-in" },
      { title: "Dresses", href: "/women/dresses" },
      { title: "Tops", href: "/women/tops" },
      { title: "Skirts", href: "/women/skirts" },
      { title: "Coats", href: "/women/coats" },
      { title: "Shoes", href: "/women/shoes" },
    ],
  },
  { type: "link", title: "Blog", href: "/blog" },
];

export const footerNav: { title: string; links: NavLinkItem[] }[] = [
  {
    title: "Shop",
    links: [
      { title: "New Arrivals", href: "/shop?sort=newest" },
      { title: "Men", href: "/men" },
      { title: "Women", href: "/women" },
      { title: "Kids", href: "/kids" },
      { title: "Accessories", href: "/accessories" },
    ],
  },
  {
    title: "Help",
    links: [
      { title: "Contact us", href: "/contact" },
      { title: "Shipping & returns", href: "/shipping-returns" },
      { title: "Size guide", href: "/size-guide" },
      { title: "FAQs", href: "/faqs" },
      { title: "Track an order", href: "/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About us", href: "/about" },
      { title: "Blog", href: "/blog" },
      { title: "Careers", href: "/careers" },
      { title: "Privacy policy", href: "/privacy" },
      { title: "Terms of service", href: "/terms" },
    ],
  },
];

export const socialLinks: NavLinkItem[] = [
  { title: "Instagram", href: "https://instagram.com" },
  { title: "TikTok", href: "https://tiktok.com" },
  { title: "Pinterest", href: "https://pinterest.com" },
  { title: "YouTube", href: "https://youtube.com" },
];