"use client";

import { useEffect, useState } from "react";
import { fetchProductsByIds } from "@/actions/products";
import type { Product } from "@/lib/validations/product";

export function useProductsByIds(ids: string[]) {
  const [cache, setCache] = useState<Record<string, Product>>({});
  const [settled, setSettled] = useState<Set<string>>(() => new Set());

  const missing = ids.filter((id) => !settled.has(id));
  const key = missing.join(",");

  useEffect(() => {
    if (!key) return;
    const wanted = key.split(",");
    let cancelled = false;

    fetchProductsByIds(wanted)
      .then((found) => {
        if (cancelled) return;
        setCache((prev) => ({
          ...prev,
          ...Object.fromEntries(found.map((p) => [p.id, p])),
        }));
      })
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        // Mark as settled even on failure or unknown IDs, so we never spin forever
        setSettled((prev) => new Set([...prev, ...wanted]));
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return {
    products: ids.map((id) => cache[id]).filter((p): p is Product => !!p),
    loading: missing.length > 0,
  };
}