import type { Metadata } from "next";
import { z } from "zod";
import { getPostCategories, getPosts } from "@/lib/cms/posts";
import { Reveal } from "@/components/animations/reveal";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { CategoryChips } from "@/components/blog/category-chips";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Style guides, care tips and stories from the FitSync team.",
};

const querySchema = z.object({
  category: z.string().max(40).optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function BlogPage({ searchParams }: Props) {
  const raw = await searchParams;
  const { category, page: requestedPage } = querySchema.parse({
    category: Array.isArray(raw.category) ? raw.category[0] : raw.category,
    page: Array.isArray(raw.page) ? raw.page[0] : raw.page,
  });

  const [{ posts, total, page, totalPages }, categories, all] = await Promise.all([
    getPosts({ category, page: requestedPage }),
    getPostCategories(),
    getPosts(),
  ]);

  // The first card on an unfiltered first page is the featured story
  const hasFeatured = page === 1 && !category && posts.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <header className="mt-6 space-y-4 border-b pb-8">
        <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
          <span className="size-3 bg-primary" aria-hidden />
          The FitSync Journal
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Stories, style and care</h1>
        <p className="max-w-xl text-muted-foreground">
          Practical guides to wearing, caring for and choosing clothes you'll keep.
        </p>
      </header>

      <div className="mt-8">
        <CategoryChips categories={categories} active={category} total={all.total} />
      </div>

      {posts.length > 0 ? (
        <Reveal stagger={0.08} className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} featured={hasFeatured && i === 0} />
          ))}
        </Reveal>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No stories here yet"
          actionLabel="See all stories"
          actionHref="/blog"
        />
      )}

      <div className="mt-14">
        <BlogPagination page={page} totalPages={totalPages} category={category} />
      </div>
      <p className="sr-only">{total} stories</p>
    </div>
  );
}