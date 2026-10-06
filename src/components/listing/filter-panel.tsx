"use client";

import type { FormEvent } from "react";
import { Check } from "lucide-react";
import type { Facets } from "@/lib/cms/products";
import { useListingParams } from "@/hooks/use-listing-params";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const trigger = "py-3 text-sm font-semibold tracking-widest uppercase hover:no-underline";

type FilterPanelProps = {
  facets: Facets;
  showCategories: boolean;
};

export function FilterPanel({ facets, showCategories }: FilterPanelProps) {
  const { searchParams, getList, toggle, update, clearAll } = useListingParams();

  const categories = getList("category");
  const sizes = getList("size");
  const colors = getList("color");
  const min = searchParams.get("min") ?? "";
  const max = searchParams.get("max") ?? "";

  const hasFilters =
    categories.length + sizes.length + colors.length > 0 || min !== "" || max !== "";

  function applyPrice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    update({
      min: String(data.get("min") ?? "").trim() || null,
      max: String(data.get("max") ?? "").trim() || null,
    });
  }

  return (
    <div>
      {hasFilters && (
        <div className="flex justify-end">
          <Button variant="link" size="sm" className="h-auto p-0" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["category", "size", "color", "price"]}>
        {showCategories && facets.categories.length > 1 && (
          <AccordionItem value="category">
            <AccordionTrigger className={trigger}>Category</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                {facets.categories.map((c) => (
                  <li key={c.name}>
                    <label className="flex cursor-pointer items-center gap-3 text-sm">
                      <Checkbox
                        checked={categories.includes(c.name)}
                        onCheckedChange={() => toggle("category", c.name)}
                      />
                      <span className="flex-1">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.count}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {facets.sizes.length > 0 && (
          <AccordionItem value="size">
            <AccordionTrigger className={trigger}>Size</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {facets.sizes.map((size) => {
                  const active = sizes.includes(size);
                  return (
                    <Button
                      key={size}
                      type="button"
                      size="sm"
                      variant={active ? "default" : "outline"}
                      aria-pressed={active}
                      onClick={() => toggle("size", size)}
                      className="h-8 min-w-10 px-3"
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {facets.colors.length > 0 && (
          <AccordionItem value="color">
            <AccordionTrigger className={trigger}>Colour</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2.5">
                {facets.colors.map((c) => {
                  const active = colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={active}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => toggle("color", c.name)}
                      style={{ backgroundColor: c.hex }}
                      className={cn(
                        "flex size-8 items-center justify-center border border-border transition-all",
                        active && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                      )}
                    >
                      {active && <Check className="size-4 text-white mix-blend-difference" />}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className={trigger}>Price (USD)</AccordionTrigger>
          <AccordionContent>
            {/* key resets the inputs when the URL changes (e.g. "Clear all") */}
            <form key={`${min}-${max}`} onSubmit={applyPrice} className="flex items-center gap-2">
              <Input
                name="min"
                type="number"
                inputMode="numeric"
                min={0}
                defaultValue={min}
                placeholder={String(facets.priceRange.min)}
                aria-label="Minimum price"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                name="max"
                type="number"
                inputMode="numeric"
                min={0}
                defaultValue={max}
                placeholder={String(facets.priceRange.max)}
                aria-label="Maximum price"
              />
              <Button type="submit" size="sm">
                Go
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}