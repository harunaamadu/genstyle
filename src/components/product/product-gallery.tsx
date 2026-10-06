"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/hooks/use-i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
  discountPercent?: number;
  newArrival: boolean;
};

export function ProductGallery({
  images,
  name,
  discountPercent,
  newArrival,
}: ProductGalleryProps) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const total = images.length;
  const go = (i: number) => setIndex((i + total) % total);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col-reverse gap-3 lg:sticky lg:top-24 lg:flex-row lg:self-start">
      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 lg:w-20 lg:shrink-0 lg:flex-col">
          {images.map((src, i) => (
            <button
              // FIXED: Combined src with loop index to guarantee key uniqueness
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${name} ${i + 1}/${total}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-3/4 w-16 overflow-hidden border-2 bg-muted transition-colors lg:w-full",
                i === index
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative aspect-3/4 flex-1 overflow-hidden bg-muted"
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoomed(true)}
        onPointerLeave={() => setZoomed(false)}
        onPointerMove={handleMove}
        style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
      >
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={name}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={{
                transformOrigin: origin,
                transform: zoomed ? "scale(2)" : "scale(1)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges */}
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          {discountPercent && <Badge>-{discountPercent}%</Badge>}
          {newArrival && <Badge variant="secondary">{t.newBadge}</Badge>}
        </div>

        {/* Arrows */}
        {total > 1 && (
          <div className="absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 justify-between">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={() => go(index + 1)}
              aria-label="Next image"
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
