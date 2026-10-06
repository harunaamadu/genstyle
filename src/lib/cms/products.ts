import { products } from "@/data/cms/products";
import type { Department } from "@/data/categories";
import { slugify, titleCase } from "@/lib/slug";
import type { ListingParams, SortOption } from "@/lib/validations/listing";
import type { Product } from "@/lib/validations/product";

/* ------------------------------------------------------------------ */
/* Scope: which products belong to a page                              */
/* ------------------------------------------------------------------ */

function inDepartment(p: Product, department?: Department) {
  switch (department) {
    case "men":
      return p.gender === "men";
    case "women":
      return p.gender === "women";
    case "kids":
      return p.gender === "kids";
    case "accessories":
      return p.gender === "unisex";
    default:
      return true;
  }
}

function inScope(p: Product, department?: Department, categorySlug?: string) {
  if (!inDepartment(p, department)) return false;
  if (!categorySlug) return true;
  if (categorySlug === "new-in") return p.newArrival;
  return slugify(p.category) === categorySlug;
}

/* ------------------------------------------------------------------ */
/* Facets: the options the filter UI offers                            */
/* ------------------------------------------------------------------ */

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "4Y", "6Y", "8Y", "10Y", "One Size"];

export type Facets = {
  categories: { name: string; count: number }[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  priceRange: { min: number; max: number };
};

function buildFacets(list: Product[]): Facets {
  const categoryCounts = new Map<string, number>();
  const sizes = new Set<string>();
  const colors = new Map<string, string>();

  for (const p of list) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
    p.variants.forEach((v) => sizes.add(v.size));
    p.colors.forEach((c) => colors.set(c.name, c.hex));
  }

  const prices = list.map((p) => p.basePrice);
  const rank = (s: string) => {
    const i = SIZE_ORDER.indexOf(s);
    return i === -1 ? SIZE_ORDER.length : i;
  };

  return {
    categories: [...categoryCounts].map(([name, count]) => ({ name, count })),
    sizes: [...sizes].sort((a, b) => rank(a) - rank(b)),
    colors: [...colors].map(([name, hex]) => ({ name, hex })),
    priceRange: prices.length
      ? { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
      : { min: 0, max: 0 },
  };
}

/* ------------------------------------------------------------------ */
/* Filtering + sorting                                                 */
/* ------------------------------------------------------------------ */

function matchesFilters(p: Product, f: ListingParams) {
  if (
    f.category.length &&
    !f.category.some((c) => c.toLowerCase() === p.category.toLowerCase())
  )
    return false;

  if (f.size.length && !p.variants.some((v) => v.stock > 0 && f.size.includes(v.size)))
    return false;

  if (f.color.length && !p.colors.some((c) => f.color.includes(c.name))) return false;

  if (f.min !== undefined && p.basePrice < f.min) return false;
  if (f.max !== undefined && p.basePrice > f.max) return false;

  if (f.q) {
    const haystack = [
      p.category,
      ...Object.values(p.translations).flatMap((t) => (t ? [t.name, t.tagline] : [])),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(f.q.toLowerCase())) return false;
  }

  return true;
}

function sortProducts(list: Product[], sort: SortOption) {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    case "price-asc":
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case "price-desc":
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

/* ------------------------------------------------------------------ */
/* Public API (swap the internals for Sanity later)                    */
/* ------------------------------------------------------------------ */

export async function queryProducts(opts: {
  department?: Department;
  categorySlug?: string;
  params: ListingParams;
}) {
  const scope = products.filter((p) => inScope(p, opts.department, opts.categorySlug));
  const filtered = sortProducts(
    scope.filter((p) => matchesFilters(p, opts.params)),
    opts.params.sort
  );

  return {
    products: filtered,
    total: scope.length, // before user filters, to tell "empty page" from "no matches"
    facets: buildFacets(scope),
  };
}

export async function getCategoryLabel(slug: string) {
  const match = products.find((p) => slugify(p.category) === slug);
  return match?.category ?? titleCase(slug);
}

export async function getProducts(
  filter: {
    gender?: Product["gender"];
    category?: string;
    newArrival?: boolean;
    limit?: number;
  } = {}
): Promise<Product[]> {
  const { gender, category, newArrival, limit } = filter;

  const result = products.filter((p) => {
    if (gender && p.gender !== gender) return false;
    if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (newArrival !== undefined && p.newArrival !== newArrival) return false;
    return true;
  });

  return limit ? result.slice(0, limit) : result;
}


export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return getProducts({ newArrival: true, limit });
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.gender === product.gender)
    )
    .slice(0, limit);
}