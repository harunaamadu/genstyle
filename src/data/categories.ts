export type Department = Category["slug"];

export function getDepartment(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export type Category = {
  slug: "men" | "women" | "kids" | "accessories";
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
};

export const categories: Category[] = [
  {
    slug: "men",
    title: "Men",
    description: "Tailoring and everyday staples",
    href: "/men",
    image: "/images/categories/men.jpg",
    alt: "Menswear collection",
  },
  {
    slug: "women",
    title: "Women",
    description: "Silhouettes for every season",
    href: "/women",
    image: "/images/categories/women.jpg",
    alt: "Womenswear collection",
  },
  {
    slug: "kids",
    title: "Kids",
    description: "Playtime-proof and colourful",
    href: "/kids",
    image: "/images/categories/kids.jpg",
    alt: "Kidswear collection",
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Bags, watches and finishing touches",
    href: "/accessories",
    image: "/images/categories/accessories.jpg",
    alt: "Accessories collection",
  },
];