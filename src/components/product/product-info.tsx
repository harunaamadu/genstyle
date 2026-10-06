"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Share2, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";
import { useFormatPrice, useLocale, useT } from "@/hooks/use-i18n";
import { getLocalized, isSoldOut } from "@/lib/product";
import { addToCartSchema } from "@/lib/validations/cart";
import type { Product } from "@/lib/validations/product";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LOW_STOCK_AT = 3;

export function ProductInfo({ product }: { product: Product }) {
  const mounted = useMounted();
  const locale = useLocale();
  const t = useT();
  const formatPrice = useFormatPrice();

  const addItem = useCartStore((s) => s.addItem);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);

  const loc = getLocalized(product, locale);
  const color = product.colors[colorIndex];
  const variant = product.variants.find((v) => v.size === size) ?? null;
  const soldOut = isSoldOut(product);
  const isWished = mounted && wished;

  function selectSize(next: string, stock: number) {
    setSize(next);
    setQuantity((q) => Math.min(q, Math.max(stock, 1)));
    setShowError(false);
  }

  function handleAdd() {
    const parsed = addToCartSchema(variant?.stock ?? 0).safeParse({
      size: size ?? "",
      quantity,
    });

    if (!parsed.success || !variant) {
      setShowError(true);
      return;
    }

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        sku: variant.sku,
        name: loc.name,
        image: product.images[0],
        color: color.name,
        size: variant.size,
        price: product.basePrice,
        maxStock: variant.stock,
      },
      parsed.data.quantity
    );
  }

  function handleWishlist() {
    toggleWishlist(product.id);
    toast(wished ? t.removedFromWishlist : t.addedToWishlist);
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: loc.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t.linkCopied);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do
    }
  }

  const stockLabel = !variant
    ? null
    : variant.stock <= 0
      ? t.outOfStock
      : variant.stock <= LOW_STOCK_AT
        ? `${t.lowStock}: ${variant.stock} ${t.unitsLeft}`
        : t.inStock;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <p className="flex items-center justify-between text-xs">
          <span className="font-semibold tracking-widest text-muted-foreground uppercase">
            {product.category}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Star className="size-3.5 fill-primary text-primary" />
            {product.rating.toFixed(1)}
          </span>
        </p>
        <h3 className="text-2xl font-bold font-heading tracking-tight sm:text-3xl">{loc.name}</h3>
        <p className="text-muted-foreground">{loc.tagline}</p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.basePrice)}</span>
        {product.originalPrice && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {/* Colour */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">
          {t.color}: <span className="font-normal text-muted-foreground">{color.name}</span>
        </p>
        <div role="radiogroup" aria-label={t.color} className="flex flex-wrap gap-2.5">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={i === colorIndex}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColorIndex(i)}
              style={{ backgroundColor: c.hex }}
              className={cn(
                "size-9 border border-border transition-all",
                i === colorIndex &&
                  "ring-2 ring-ring ring-offset-2 ring-offset-background"
              )}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">
            {t.size}: <span className="font-normal text-muted-foreground">{size ?? "—"}</span>
          </p>
          <Link
            href="/size-guide"
            className="text-xs font-medium underline underline-offset-4 hover:text-primary"
          >
            {t.viewSizeGuide}
          </Link>
        </div>

        <div role="radiogroup" aria-label={t.size} className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const active = v.size === size;
            const out = v.stock <= 0;
            return (
              <Button
                key={v.sku}
                type="button"
                role="radio"
                aria-checked={active}
                variant={active ? "default" : "outline"}
                disabled={out}
                onClick={() => selectSize(v.size, v.stock)}
                className="h-10 min-w-12 px-4 disabled:line-through"
              >
                {v.size}
              </Button>
            );
          })}
        </div>

        {showError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: [0, -6, 6, -3, 3, 0] }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-destructive"
          >
            {t.selectSize}
          </motion.p>
        )}

        {stockLabel && (
          <p
            className={cn(
              "text-sm",
              variant && variant.stock <= LOW_STOCK_AT
                ? "font-medium text-destructive"
                : "text-muted-foreground"
            )}
          >
            {stockLabel}
          </p>
        )}
      </div>

      {/* Quantity + add to cart */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          role="group"
          aria-label={t.quantity}
          className="flex h-12 items-center justify-between border sm:w-36"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-12"
            disabled={!variant || quantity <= 1}
            onClick={() => setQuantity((q) => q - 1)}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center font-medium tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-12"
            disabled={!variant || quantity >= variant.stock}
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={soldOut}
          onClick={handleAdd}
          className="h-12 flex-1 uppercase tracking-widest"
        >
          <ShoppingBag />
          {soldOut ? t.outOfStock : t.addToCart}
        </Button>
      </div>

      {/* Secondary actions */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleWishlist}
          aria-pressed={isWished}
          className="flex-1"
        >
          <Heart className={cn(isWished && "fill-destructive text-destructive")} />
          {isWished ? t.removeFromWishlist : t.addToWishlist}
        </Button>
        <Button type="button" variant="outline" onClick={handleShare} className="flex-1">
          <Share2 />
          {t.share}
        </Button>
      </div>
    </div>
  );
}