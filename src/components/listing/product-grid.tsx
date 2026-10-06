"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/lib/validations/product";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ProductCard product={product} priority={i < 4} className="h-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}