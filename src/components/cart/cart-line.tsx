"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useFormatPrice, useT } from "@/hooks/use-i18n";
import { useCartStore, type CartItem } from "@/store/cart-store";
import { Button } from "@/components/ui/button";

export function CartLine({ item }: { item: CartItem }) {
  const t = useT();
  const formatPrice = useFormatPrice();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const href = `/product/${item.slug}`;
  const atMax = item.quantity >= item.maxStock;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-4 py-6 sm:gap-6"
    >
      <Link
        href={href}
        className="relative aspect-3/4 w-24 shrink-0 overflow-hidden bg-muted sm:w-32"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Link href={href} className="font-semibold transition-colors hover:text-primary">
              {item.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {item.color} · {item.size}
            </p>
            {item.maxStock <= 3 && (
              <p className="text-xs font-medium text-destructive">
                {item.maxStock} {t.unitsLeft}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div role="group" aria-label={t.quantity} className="flex items-center border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-10 text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              disabled={atMax}
              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.lineId)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
            {t.remove}
          </Button>
        </div>
      </div>
    </motion.li>
  );
}