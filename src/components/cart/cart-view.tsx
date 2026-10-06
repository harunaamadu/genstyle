"use client";

import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useT } from "@/hooks/use-i18n";
import { selectCartCount, useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { CartLine } from "./cart-line";
import { OrderSummary } from "./order-summary";

function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-48" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export function CartView() {
  const mounted = useMounted();
  const t = useT();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const clearCart = useCartStore((s) => s.clearCart);

  if (!mounted) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t.cartEmpty}
        actionLabel={t.continueShopping}
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <PageBreadcrumbs items={[{ label: "Home", href: "/" }, { label: t.cart }]} />

      <div className="mt-6 flex items-end justify-between gap-4 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {t.cart}{" "}
          <span className="text-2xl font-normal text-muted-foreground">({count})</span>
        </h1>
        <Button variant="link" size="sm" onClick={clearCart} className="h-auto p-0">
          {t.clear}
        </Button>
      </div>

      <div className="mt-2 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <ul className="divide-y">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((item) => (
              <CartLine key={item.lineId} item={item} />
            ))}
          </AnimatePresence>
        </ul>

        <div className="pt-6">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}