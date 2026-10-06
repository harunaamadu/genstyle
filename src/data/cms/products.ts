import { productSchema, type Product } from "@/lib/validations/product";
import { siteConfig } from "../site-config";

/**
 * Image paths live in one place.
 * Real photos: /images/products/<slug>-1.jpg, <slug>-2.jpg (3:4 portrait, ~1200x1600).
 * Until then, swap the body for: return "/images/placeholder.jpg";
 */
const img = (slug: string, n: 1 | 2) => `${siteConfig().productImageFallback}`; // placeholder until real images are added

const sizes = (prefix: string, list: [size: string, stock: number][]) =>
  list.map(([size, stock]) => ({ sku: `${prefix}-${size}`, size, stock }));

const clothing = (prefix: string, stock: number[] = [6, 8, 5, 2]) =>
  sizes(prefix, [
    ["S", stock[0]],
    ["M", stock[1]],
    ["L", stock[2]],
    ["XL", stock[3]],
  ]);

// Swatch hex values are product data, not UI colours
const colors = {
  camel: { name: "Camel", hex: "#B08D57" },
  black: { name: "Black", hex: "#1A1A1A" },
  ivory: { name: "Ivory", hex: "#F2EBDD" },
  navy: { name: "Navy", hex: "#1F2A44" },
  olive: { name: "Olive", hex: "#6B6F3A" },
  burgundy: { name: "Burgundy", hex: "#6D1F2F" },
  sky: { name: "Sky Blue", hex: "#9CC3E6" },
  white: { name: "White", hex: "#FFFFFF" },
  stone: { name: "Stone", hex: "#CFC7B8" },
  blush: { name: "Blush", hex: "#E8C4C4" },
  denim: { name: "Denim", hex: "#4A6A8F" },
  tan: { name: "Tan", hex: "#A9744F" },
  silver: { name: "Silver", hex: "#C0C0C0" },
};

const cld = (path: string) =>
  `https://res.cloudinary.com/dqylma6u3/image/upload/${path}`;

const raw = [
  // ---------- WOMEN ----------
  {
    id: "w-001",
    slug: "camel-wool-coat",
    gender: "women",
    category: "Coats",
    basePrice: 189,
    originalPrice: 240,
    discountPercent: 21,
    newArrival: true,
    rating: 4.7,
    images: [
      cld("v1786375660/coat-1-1_vxhu4q.webp"),
      cld("v1786375661/coat-1-3_bhxrwu.webp"),
    ],
    colors: [colors.camel, colors.black],
    variants: clothing("W-COAT", [4, 6, 2, 0]),
    translations: {
      en: { name: "Camel Wool Coat", tagline: "Relaxed fit, double-breasted" },
      fr: { name: "Manteau en laine camel", tagline: "Coupe ample, croisé" },
    },
  },
  {
    id: "w-002",
    slug: "satin-slip-dress",
    gender: "women",
    category: "Dresses",
    basePrice: 95,
    newArrival: true,
    rating: 4.5,
    images: [img("satin-slip-dress", 1), img("satin-slip-dress", 2)],
    colors: [colors.burgundy, colors.black, colors.ivory],
    variants: clothing("W-SLIP"),
    translations: {
      en: {
        name: "Satin Slip Dress",
        tagline: "Bias cut with adjustable straps",
      },
    },
  },
  {
    id: "w-003",
    slug: "ribbed-knit-top",
    gender: "women",
    category: "Tops",
    basePrice: 42,
    originalPrice: 55,
    discountPercent: 24,
    newArrival: false,
    rating: 4.3,
    images: [img("ribbed-knit-top", 1), img("ribbed-knit-top", 2)],
    colors: [colors.ivory, colors.blush, colors.black],
    variants: clothing("W-RIB", [9, 12, 7, 3]),
    translations: {
      en: { name: "Ribbed Knit Top", tagline: "Soft stretch cotton blend" },
    },
  },
  {
    id: "w-004",
    slug: "pleated-midi-skirt",
    gender: "women",
    category: "Skirts",
    basePrice: 68,
    newArrival: true,
    rating: 4.6,
    images: [
      cld("v1786374572/P01044759_jogf3p.webp"),
      cld("v1786374567/P01044759_d1_gpbjni.webp"),
    ],
    colors: [colors.olive, colors.navy],
    variants: clothing("W-PLT", [3, 5, 4, 1]),
    translations: {
      en: { name: "Pleated Midi Skirt", tagline: "Fluid drape, elastic waist" },
    },
  },

  // ---------- MEN ----------
  {
    id: "m-001",
    slug: "oxford-button-shirt",
    gender: "men",
    category: "Shirts",
    basePrice: 59,
    newArrival: true,
    rating: 4.6,
    images: [
      cld("v1786374564/P01049701_tqprod.webp"),
      cld("v1786374564/P01049701_b2_vvvc2w.webp"),
    ],
    colors: [colors.sky, colors.white, colors.navy],
    variants: clothing("M-OXF", [5, 10, 8, 4]),
    translations: {
      en: {
        name: "Oxford Button Shirt",
        tagline: "Classic fit, washed cotton",
      },
    },
  },
  {
    id: "m-002",
    slug: "heavyweight-tee",
    gender: "men",
    category: "T-Shirts",
    basePrice: 29,
    originalPrice: 38,
    discountPercent: 24,
    newArrival: false,
    rating: 4.8,
    images: [img("heavyweight-tee", 1), img("heavyweight-tee", 2)],
    colors: [colors.black, colors.white, colors.stone, colors.olive],
    variants: clothing("M-TEE", [14, 20, 16, 8]),
    translations: {
      en: { name: "Heavyweight Tee", tagline: "280gsm cotton, boxy cut" },
    },
  },
  {
    id: "m-003",
    slug: "tapered-chino-trousers",
    gender: "men",
    category: "Trousers",
    basePrice: 72,
    newArrival: true,
    rating: 4.4,
    images: [
      img("tapered-chino-trousers", 1),
      img("tapered-chino-trousers", 2),
    ],
    colors: [colors.stone, colors.navy, colors.olive],
    variants: clothing("M-CHN", [4, 7, 6, 0]),
    translations: {
      en: {
        name: "Tapered Chino Trousers",
        tagline: "Stretch twill, mid rise",
      },
    },
  },
  {
    id: "m-004",
    slug: "bomber-jacket",
    gender: "men",
    category: "Jackets",
    basePrice: 129,
    originalPrice: 160,
    discountPercent: 19,
    newArrival: true,
    rating: 4.7,
    images: [img("bomber-jacket", 1), img("bomber-jacket", 2)],
    colors: [colors.olive, colors.black],
    variants: clothing("M-BMB", [2, 4, 3, 1]),
    translations: {
      en: { name: "Utility Bomber Jacket", tagline: "Water-resistant shell" },
    },
  },

  // ---------- KIDS ----------
  {
    id: "k-001",
    slug: "kids-denim-jacket",
    gender: "kids",
    category: "Jackets",
    basePrice: 45,
    newArrival: true,
    rating: 4.5,
    images: [
      cld("v1786375255/jacket_1_owhkd9.webp"),
      cld("v1786375255/jacket_4_vhi5td.webp"),
    ],
    colors: [colors.denim],
    variants: sizes("K-DNM", [
      ["4Y", 5],
      ["6Y", 7],
      ["8Y", 4],
      ["10Y", 2],
    ]),
    translations: {
      en: { name: "Kids Denim Jacket", tagline: "Soft-wash, easy snaps" },
    },
  },
  {
    id: "k-002",
    slug: "kids-floral-dress",
    gender: "kids",
    category: "Dresses",
    basePrice: 38,
    originalPrice: 48,
    discountPercent: 21,
    newArrival: false,
    rating: 4.6,
    images: [
      cld("v1786374572/P00973258_gxbw2r.webp"),
      cld("v1786374576/P00973258_d4_qxuauq.webp"),
    ],
    colors: [colors.blush, colors.sky],
    variants: sizes("K-FLR", [
      ["4Y", 6],
      ["6Y", 3],
      ["8Y", 0],
      ["10Y", 4],
    ]),
    translations: {
      en: { name: "Kids Floral Dress", tagline: "Breathable cotton poplin" },
    },
  },

  // ---------- ACCESSORIES ----------
  {
    id: "a-001",
    slug: "leather-tote-bag",
    gender: "unisex",
    category: "Bags",
    basePrice: 149,
    newArrival: true,
    rating: 4.9,
    images: [
      cld("v1786374571/P01075925_rao5gj.webp"),
      cld("v1786374571/P01075925_b1_t5mtnh.webp"),
    ],
    colors: [colors.tan, colors.black],
    variants: [{ sku: "A-TOTE-OS", size: "One Size", stock: 7 }],
    translations: {
      en: { name: "Leather Tote Bag", tagline: "Full-grain, laptop-ready" },
    },
  },
  {
    id: "a-002",
    slug: "minimal-steel-watch",
    gender: "unisex",
    category: "Watches",
    basePrice: 110,
    originalPrice: 135,
    discountPercent: 19,
    newArrival: false,
    rating: 4.4,
    images: [img("minimal-steel-watch", 1), img("minimal-steel-watch", 2)],
    colors: [colors.silver, colors.black],
    variants: [{ sku: "A-WATCH-OS", size: "One Size", stock: 12 }],
    translations: {
      en: { name: "Minimal Steel Watch", tagline: "38mm, sapphire glass" },
    },
  },
];

const categoryDefaults: Record<
  string,
  { material: string; care: string[]; countryOfOrigin: string }
> = {
  Coats: {
    material: "80% wool, 20% polyamide",
    care: ["Dry clean only", "Do not tumble dry"],
    countryOfOrigin: "Portugal",
  },
  Dresses: {
    material: "100% recycled polyester satin",
    care: ["Machine wash cold", "Hang to dry"],
    countryOfOrigin: "Turkey",
  },
  Tops: {
    material: "95% cotton, 5% elastane",
    care: ["Machine wash 30°C", "Do not bleach"],
    countryOfOrigin: "Portugal",
  },
  Skirts: {
    material: "100% recycled polyester",
    care: ["Machine wash cold", "Cool iron if needed"],
    countryOfOrigin: "Turkey",
  },
  Shirts: {
    material: "100% organic cotton",
    care: ["Machine wash 40°C", "Iron on medium heat"],
    countryOfOrigin: "Portugal",
  },
  "T-Shirts": {
    material: "100% combed cotton, 280gsm",
    care: ["Machine wash 30°C", "Tumble dry low"],
    countryOfOrigin: "Portugal",
  },
  Trousers: {
    material: "97% cotton, 3% elastane",
    care: ["Machine wash 30°C", "Iron inside out"],
    countryOfOrigin: "Morocco",
  },
  Jackets: {
    material: "Recycled nylon shell, polyester lining",
    care: ["Spot clean", "Do not iron"],
    countryOfOrigin: "Vietnam",
  },
  Bags: {
    material: "Full-grain vegetable-tanned leather",
    care: ["Wipe with a damp cloth", "Condition twice a year"],
    countryOfOrigin: "Italy",
  },
  Watches: {
    material: "316L stainless steel, sapphire glass",
    care: ["Water resistant to 50m", "Avoid strong magnets"],
    countryOfOrigin: "Switzerland",
  },
};

const withDefaults = raw.map((p) => ({
  brand: `${siteConfig().name}`,
  tags: [p.category.toLowerCase(), p.gender],
  ...categoryDefaults[p.category],
  ...p,
}));

// Fails loudly at startup if any record breaks the schema
export const products: Product[] = productSchema.array().parse(withDefaults);

// Fails loudly at startup if any record breaks the schema
// export const products: Product[] = productSchema.array().parse(raw);
