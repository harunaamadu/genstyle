import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getReadingTime } from "@/lib/cms/posts";
import type { Post } from "@/lib/validations/post";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={cn("group relative flex flex-col", featured && "md:col-span-2")}>
      <div className={cn("relative aspect-3/2 overflow-hidden bg-muted", featured && "md:aspect-2/1")}>
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority={featured}
          sizes={
            featured
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3">{post.category}</Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-4">
        <p className="text-xs text-muted-foreground">
          {formatDate(post.publishedAt)} · {getReadingTime(post)} min read
        </p>
        <h3 className={cn("font-bold tracking-tight", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          {/* Stretched link: the whole card is clickable */}
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors group-hover:text-primary after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-muted-foreground">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold tracking-widest uppercase">
          Read story
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}