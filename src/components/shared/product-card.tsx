"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Heart, SlidersHorizontal, Star } from "lucide-react";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";
import { useFormatPrice, useLocale, useT } from "@/hooks/use-i18n";
import { getLocalized, isSoldOut } from "@/lib/product";
import type { Product, ProductVariant } from "@/lib/validations/product";
import { useCartStore } from "@/store/cart-store";
import { useCompareStore } from "@/store/compare-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  /** Set on the first row of products above the fold. */
  priority?: boolean;
  className?: string;
};

const MAX_SWATCHES = 4;

function ProductCardBase({ product, priority = false, className }: ProductCardProps) {
  const mounted = useMounted();
  const locale = useLocale();
  const t = useT();
  const formatPrice = useFormatPrice();

  const addItem = useCartStore((s) => s.addItem);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const compared = useCompareStore((s) => s.ids.includes(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);

  const [colorIndex, setColorIndex] = useState(0);

  const loc = getLocalized(product, locale);
  const soldOut = isSoldOut(product);
  const color = product.colors[colorIndex];
  const isWished = mounted && wished;
  const isCompared = mounted && compared;
  const hiddenSwatches = product.colors.length - MAX_SWATCHES;

  function handleAdd(variant: ProductVariant) {
    if (variant.stock <= 0) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: variant.sku,
      name: loc.name,
      image: product.images[0],
      color: color.name,
      size: variant.size,
      price: product.basePrice,
      maxStock: variant.stock,
    });
  }

  function handleWishlist() {
    toggleWishlist(product.id);
    toast(wished ? t.removedFromWishlist : t.addedToWishlist);
  }

  function handleCompare() {
    if (toggleCompare(product.id) === "full") toast.error(t.compareLimit);
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col border bg-card text-card-foreground transition-shadow hover:shadow-lg",
        isCompared && "border-primary ring-1 ring-primary",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        <Image
          src={product.images[0]}
          alt={loc.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Badges */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {product.discountPercent && <Badge>-{product.discountPercent}%</Badge>}
          {product.newArrival && <Badge variant="secondary">{t.newBadge}</Badge>}
          {soldOut && (
            <Badge variant="outline" className="bg-background">
              {t.outOfStock}
            </Badge>
          )}
        </div>

        {/* Wishlist + compare */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="size-8"
            onClick={handleWishlist}
            aria-pressed={isWished}
            aria-label={isWished ? t.removeFromWishlist : t.addToWishlist}
          >
            <motion.span
              key={String(isWished)}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="flex"
            >
              <Heart
                className={cn("size-4", isWished && "fill-destructive text-destructive")}
              />
            </motion.span>
          </Button>

          <Button
            type="button"
            size="icon"
            variant={isCompared ? "default" : "secondary"}
            className="size-8"
            onClick={handleCompare}
            aria-pressed={isCompared}
            aria-label={isCompared ? t.removeFromCompare : t.addToCompare}
          >
            {isCompared ? (
              <Check className="size-4" />
            ) : (
              <SlidersHorizontal className="size-4" />
            )}
          </Button>
        </div>

        {/* Size picker: always visible on touch, slides up on hover/focus at sm+ */}
        {!soldOut && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-background/95 p-3 backdrop-blur transition-transform duration-200 sm:translate-y-full sm:group-focus-within:translate-y-0 sm:group-hover:translate-y-0">
            <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              {t.selectSize}
            </p>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((variant) => (
                <Button
                  key={variant.sku}
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={variant.stock <= 0}
                  onClick={() => handleAdd(variant)}
                  className="h-7 min-w-9 px-2 text-xs disabled:line-through"
                >
                  {variant.size}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-semibold tracking-wider uppercase">
            {product.category}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Star className="size-3 fill-primary text-primary" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div>
          <h3 className="truncate text-sm font-semibold">
            {/* Stretched link: makes the whole card clickable without nesting buttons in a link */}
            <Link
              href={`/product/${product.slug}`}
              className="transition-colors group-hover:text-primary after:absolute after:inset-0 after:content-['']"
            >
              {loc.name}
            </Link>
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {loc.tagline}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <div className="flex items-baseline gap-1.5 font-mono text-sm">
            <span className="font-semibold">{formatPrice(product.basePrice)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div
            role="radiogroup"
            aria-label={t.color}
            className="relative z-10 flex items-center gap-1"
          >
            {product.colors.slice(0, MAX_SWATCHES).map((c, i) => (
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
                  "size-4 border border-border transition-all",
                  i === colorIndex &&
                    "ring-2 ring-ring ring-offset-2 ring-offset-card"
                )}
              />
            ))}
            {hiddenSwatches > 0 && (
              <span className="pl-0.5 font-mono text-[10px] text-muted-foreground">
                +{hiddenSwatches}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);