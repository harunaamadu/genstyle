import Link from "next/link";
import { Button } from "@/components/ui/button";

type CategoryChipsProps = {
  categories: { name: string; slug: string; count: number }[];
  active?: string;
  total: number;
};

export function CategoryChips({ categories, active, total }: CategoryChipsProps) {
  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant={!active ? "default" : "outline"}>
        <Link href="/blog">All ({total})</Link>
      </Button>
      {categories.map((c) => (
        <Button key={c.slug} asChild size="sm" variant={active === c.slug ? "default" : "outline"}>
          <Link href={`/blog?category=${c.slug}`}>
            {c.name} ({c.count})
          </Link>
        </Button>
      ))}
    </nav>
  );
}