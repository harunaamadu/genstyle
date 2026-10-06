"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, X } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useFormatPrice, useLocale, useT } from "@/hooks/use-i18n";
import { useProductsByIds } from "@/hooks/use-products-by-ids";
import { getLocalized, isSoldOut } from "@/lib/product";
import type { Product } from "@/lib/validations/product";
import { useCompareStore } from "@/store/compare-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

export function CompareView() {
  const mounted = useMounted();
  const locale = useLocale();
  const t = useT();
  const formatPrice = useFormatPrice();

  const ids = useCompareStore((s) => s.ids);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);

  const { products, loading } = useProductsByIds(mounted ? ids : []);

  if (!mounted || loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={SlidersHorizontal}
        title={t.compareEmpty}
        description={t.compareEmptyHint}
        actionLabel={t.continueShopping}
        actionHref="/shop"
      />
    );
  }

  const rows: { label: string; cell: (p: Product) => ReactNode }[] = [
    {
      label: t.price,
      cell: (p) => (
        <span className="flex items-baseline gap-2">
          <span className="font-semibold">{formatPrice(p.basePrice)}</span>
          {p.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(p.originalPrice)}
            </span>
          )}
        </span>
      ),
    },
    { label: t.category, cell: (p) => p.category },
    {
      label: t.reviews,
      cell: (p) => (
        <span className="flex items-center gap-1 font-mono">
          <Star className="size-3.5 fill-primary text-primary" />
          {p.rating.toFixed(1)}
        </span>
      ),
    },
    {
      label: t.color,
      cell: (p) => (
        <span className="flex flex-wrap gap-1.5">
          {p.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              style={{ backgroundColor: c.hex }}
              className="size-5 border border-border"
            />
          ))}
        </span>
      ),
    },
    {
      label: t.size,
      cell: (p) => (
        <span className="flex flex-wrap gap-x-2 gap-y-1">
          {p.variants.map((v) => (
            <span key={v.sku} className={cn(v.stock <= 0 && "line-through opacity-50")}>
              {v.size}
            </span>
          ))}
        </span>
      ),
    },
    { label: t.material, cell: (p) => p.material ?? "—" },
    { label: t.availability, cell: (p) => (isSoldOut(p) ? t.outOfStock : t.inStock) },
  ];

  const stickyHead = "sticky left-0 z-10 w-28 bg-background font-semibold sm:w-36";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: t.compare }]} />

      <div className="mt-6 flex items-end justify-between gap-4 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">{t.compare}</h1>
        <Button variant="link" size="sm" onClick={clear} className="h-auto p-0">
          {t.clear}
        </Button>
      </div>

      <div className="mt-8">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={stickyHead} />
              {products.map((p) => {
                const loc = getLocalized(p, locale);
                return (
                  <TableHead
                    key={p.id}
                    className="h-auto min-w-48 align-top whitespace-normal"
                  >
                    <div className="relative space-y-3 pb-4">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => toggle(p.id)}
                        aria-label={`${t.remove} ${loc.name}`}
                        className="absolute top-2 right-2 z-10 size-7"
                      >
                        <X className="size-4" />
                      </Button>

                      <Link
                        href={`/product/${p.slug}`}
                        className="relative block aspect-3/4 overflow-hidden bg-muted"
                      >
                        <Image
                          src={p.images[0]}
                          alt={loc.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover"
                        />
                      </Link>

                      <Link
                        href={`/product/${p.slug}`}
                        className="block font-semibold text-foreground hover:text-primary"
                      >
                        {loc.name}
                      </Link>

                      <Button asChild size="sm" className="w-full uppercase tracking-widest">
                        <Link href={`/product/${p.slug}`}>{t.addToCart}</Link>
                      </Button>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableHead scope="row" className={cn(stickyHead, "align-top")}>
                  {row.label}
                </TableHead>
                {products.map((p) => (
                  <TableCell key={p.id} className="align-top whitespace-normal">
                    {row.cell(p)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}