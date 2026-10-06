import { posts } from "@/data/cms/posts";
import { slugify } from "@/lib/slug";
import type { Post } from "@/lib/validations/post";

export const POSTS_PER_PAGE = 5;

const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export async function getPosts({
  category,
  page = 1,
}: { category?: string; page?: number } = {}) {
  const filtered = category ? sorted.filter((p) => slugify(p.category) === category) : sorted;
  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * POSTS_PER_PAGE;

  return {
    posts: filtered.slice(start, start + POSTS_PER_PAGE),
    total: filtered.length,
    page: current,
    totalPages,
  };
}

export async function getAllPosts() {
  return sorted;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sorted.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedPosts(post: Post, limit = 3) {
  const others = sorted.filter((p) => p.id !== post.id);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, limit);
}

export async function getPostCategories() {
  const counts = new Map<string, number>();
  for (const p of sorted) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, slug: slugify(name), count }));
}

export function getReadingTime(post: Post) {
  const words = post.body
    .flatMap((b) => (b.type === "list" ? b.items : [b.text]))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}