"use client";

import { ShoppingBag } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { selectCartCount, useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { CountBadge } from "./count-badge";

export function CartButton() {
  const mounted = useMounted();
  const count = useCartStore(selectCartCount);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openCart}
      aria-label="Open cart"
    >
      <ShoppingBag className="size-4 md:size-5" />
      <CountBadge count={mounted ? count : 0} />
    </Button>
  );
}