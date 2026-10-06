import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { infoPages } from "@/data/info-pages";
import { getAllPosts } from "@/lib/cms/posts";
import { getProducts } from "@/lib/cms/products";
import { siteUrl } from "@/data/site-config";

const staticPaths = ["", "/shop", "/categories", "/blog", "/about", "/contact", "/size-guide", "/faqs"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getProducts(), getAllPosts()]);
  const now = new Date();

  const pages = [
    ...staticPaths,
    ...Object.keys(infoPages).map((slug) => `/${slug}`),
    ...categories.map((c) => c.href),
  ].map((path) => ({ url: `${siteUrl}${path}`, lastModified: now }));

  return [
    ...pages,
    ...products.map((p) => ({ url: `${siteUrl}/product/${p.slug}`, lastModified: now })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: new Date(p.publishedAt) })),
  ];
}