"use client";

import { X } from "lucide-react";
import { useListingParams } from "@/hooks/use-listing-params";
import { Button } from "@/components/ui/button";

type Chip = { key: string; label: string; onRemove: () => void };

export function ActiveFilters() {
  const { searchParams, getList, toggle, update, clearAll } = useListingParams();

  const chips: Chip[] = [];

  const q = searchParams.get("q");
  if (q) chips.push({ key: "q", label: `“${q}”`, onRemove: () => update({ q: null }) });

  getList("category").forEach((v) =>
    chips.push({ key: `category:${v}`, label: v, onRemove: () => toggle("category", v) })
  );
  getList("size").forEach((v) =>
    chips.push({ key: `size:${v}`, label: `Size ${v}`, onRemove: () => toggle("size", v) })
  );
  getList("color").forEach((v) =>
    chips.push({ key: `color:${v}`, label: v, onRemove: () => toggle("color", v) })
  );

  const min = searchParams.get("min");
  const max = searchParams.get("max");
  if (min || max) {
    chips.push({
      key: "price",
      label: `${min ? `$${min}` : "Any"} – ${max ? `$${max}` : "Any"}`,
      onRemove: () => update({ min: null, max: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.key}
          type="button"
          variant="secondary"
          size="sm"
          onClick={chip.onRemove}
          aria-label={`Remove filter: ${chip.label}`}
          className="h-7 gap-1.5 px-2.5 text-xs"
        >
          {chip.label}
          <X className="size-3" />
        </Button>
      ))}
      <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={clearAll}>
        Clear all
      </Button>
    </div>
  );
}