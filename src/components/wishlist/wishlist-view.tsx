"use client";

import { Heart } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useT } from "@/hooks/use-i18n";
import { useProductsByIds } from "@/hooks/use-products-by-ids";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";

export function WishlistView() {
  const mounted = useMounted();
  const t = useT();
  const ids = useWishlistStore((s) => s.ids);
  const clear = useWishlistStore((s) => s.clear);

  const { products, loading } = useProductsByIds(mounted ? ids : []);
  const ready = mounted && !loading;

  if (ready && products.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t.wishlistEmpty}
        description={t.wishlistEmptyHint}
        actionLabel={t.continueShopping}
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: t.wishlist }]} />

      <div className="mt-6 flex items-end justify-between gap-4 border-b pb-6">
        <h1 className="inline-flex items-center gap-1 text-4xl font-bold tracking-tight">
          {t.wishlist}{" "}
          {ready && (
            <span className="text-2xl font-normal tabular-nums font-mono text-muted-foreground">
              ({products.length})
            </span>
          )}
        </h1>
        {ready && (
          <Button variant="link" size="sm" onClick={clear} className="h-auto p-0">
            {t.clear}
          </Button>
        )}
      </div>

      <div className="mt-8">
        {ready ? (
          <Reveal
            stagger={0.06}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>
        ) : (
          <ProductGridSkeleton count={Math.max(ids.length, 4)} />
        )}
      </div>
    </div>
  );
}