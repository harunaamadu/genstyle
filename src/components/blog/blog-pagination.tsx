import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type BlogPaginationProps = { page: number; totalPages: number; category?: string };

export function BlogPagination({ page, totalPages, category }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const href = (n: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Button asChild variant="outline" size="icon" aria-label="Previous page">
          <Link href={href(page - 1)}>
            <ChevronLeft />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Previous page">
          <ChevronLeft />
        </Button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          asChild
          size="icon"
          variant={n === page ? "default" : "outline"}
          aria-current={n === page ? "page" : undefined}
        >
          <Link href={href(n)}>{n}</Link>
        </Button>
      ))}

      {page < totalPages ? (
        <Button asChild variant="outline" size="icon" aria-label="Next page">
          <Link href={href(page + 1)}>
            <ChevronRight />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Next page">
          <ChevronRight />
        </Button>
      )}
    </nav>
  );
}