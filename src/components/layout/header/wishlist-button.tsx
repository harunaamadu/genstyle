"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { CountBadge } from "./count-badge";

export function WishlistButton() {
  const mounted = useMounted();
  const count = useWishlistStore((s) => s.ids.length);

  return (
    <Button asChild variant="ghost" size="icon" className="relative hidden sm:inline-flex">
      <Link href="/wishlist" aria-label="Wishlist">
        <Heart className="size-4 md:size-5" />
        <CountBadge count={mounted ? count : 0} />
      </Link>
    </Button>
  );
}