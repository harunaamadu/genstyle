"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { useListingParams } from "@/hooks/use-listing-params";
import { Button } from "@/components/ui/button";

export function ListingEmpty({ noProducts }: { noProducts: boolean }) {
  const { clearAll } = useListingParams();

  return (
    <div className="flex flex-col items-center gap-5 border border-dashed px-4 py-20 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          {noProducts ? "Nothing here yet" : "No products match your filters"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {noProducts
            ? "This collection is being restocked. Check back soon."
            : "Try removing a filter or searching for something else."}
        </p>
      </div>
      {noProducts ? (
        <Button asChild>
          <Link href="/shop">Browse everything</Link>
        </Button>
      ) : (
        <Button onClick={clearAll}>Clear filters</Button>
      )}
    </div>
  );
}