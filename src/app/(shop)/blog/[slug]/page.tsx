import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getAllPosts, getPostBySlug, getReadingTime, getRelatedPosts } from "@/lib/cms/posts";
import { slugify } from "@/lib/slug";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { ArticleProgress } from "@/components/blog/article-progress";
import { PostBody } from "@/components/blog/post-body";
import { PostCard } from "@/components/blog/post-card";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteUrl } from "@/data/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}${post.image}`,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: "FitSync" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <ArticleProgress>
        <article>
          <header className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:pt-12">
            <PageBreadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
            />

            <div className="mt-8 space-y-5">
              <Badge asChild>
                <Link href={`/blog?category=${slugify(post.category)}`}>{post.category}</Link>
              </Badge>
              <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">{post.title}</h1>
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>

              <div className="flex items-center gap-3 border-y py-4 text-sm">
                <span className="flex size-10 shrink-0 items-center justify-center bg-primary font-semibold text-primary-foreground">
                  {initials}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-muted-foreground">{post.author.role}</p>
                </div>
                <p className="text-right text-muted-foreground">
                  {formatDate(post.publishedAt)}
                  <br />
                  {getReadingTime(post)} min read
                </p>
              </div>
            </div>
          </header>

          <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
            <div className="relative aspect-3/2 overflow-hidden bg-muted sm:aspect-2/1">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl px-4 pb-16 sm:px-6">
            <PostBody blocks={post.body} />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
              <Button asChild variant="outline">
                <Link href="/blog">← All stories</Link>
              </Button>
              <Button asChild className="uppercase tracking-widest">
                <Link href="/shop">Shop the collection</Link>
              </Button>
            </div>
          </div>
        </article>
      </ArticleProgress>

      {related.length > 0 && (
        <section className="border-t bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading eyebrow="Keep reading" title="More from the journal" href="/blog" linkLabel="All stories" />
            </Reveal>
            <Reveal stagger={0.08} className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.id} post={r} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}