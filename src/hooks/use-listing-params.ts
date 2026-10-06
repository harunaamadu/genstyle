"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FILTER_KEYS = ["category", "size", "color", "min", "max", "q"];

export function useListingParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getList = useCallback(
    (key: string) => searchParams.get(key)?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      push(next);
    },
    [searchParams, push]
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const current = getList(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      update({ [key]: next.length ? next.join(",") : null });
    },
    [getList, update]
  );

  /** Clears every filter and the search term; keeps the sort order. */
  const clearAll = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => next.delete(key));
    push(next);
  }, [searchParams, push]);

  return { searchParams, getList, update, toggle, clearAll };
}