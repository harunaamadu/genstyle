"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Facets } from "@/lib/cms/products";
import { useListingParams } from "@/hooks/use-listing-params";
import { sortLabels, sortOptions, type SortOption } from "@/lib/validations/listing";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterPanel } from "./filter-panel";

type ListingToolbarProps = {
  count: number;
  facets: Facets;
  showCategories: boolean;
};

export function ListingToolbar({ count, facets, showCategories }: ListingToolbarProps) {
  const { searchParams, update } = useListingParams();

  const raw = searchParams.get("sort") as SortOption | null;
  const sort = raw && sortOptions.includes(raw) ? raw : "featured";

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {count} {count === 1 ? "product" : "products"}
      </p>

      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal />
              Filters
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="flex w-full max-w-sm flex-col">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="sr-only">
                Filter products by category, size, colour and price
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4">
              <FilterPanel facets={facets} showCategories={showCategories} />
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button size="lg">Show {count} results</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Select
          value={sort}
          onValueChange={(value) => update({ sort: value === "featured" ? null : value })}
        >
          <SelectTrigger className="w-48" aria-label="Sort products">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {sortLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}