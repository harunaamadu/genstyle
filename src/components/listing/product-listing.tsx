import { Fragment } from "react";
import Link from "next/link";
import type { Department } from "@/data/categories";
import { queryProducts } from "@/lib/cms/products";
import { parseListingParams, type RawSearchParams } from "@/lib/validations/listing";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ActiveFilters } from "./active-filters";
import { FilterPanel } from "./filter-panel";
import { ListingEmpty } from "./listing-empty";
import { ListingToolbar } from "./listing-toolbar";
import { ProductGrid } from "./product-grid";

type ProductListingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  department?: Department;
  categorySlug?: string;
  searchParams: RawSearchParams;
  breadcrumbs: { label: string; href?: string }[];
};

export async function ProductListing({
  title,
  eyebrow,
  description,
  department,
  categorySlug,
  searchParams,
  breadcrumbs,
}: ProductListingProps) {
  const params = parseListingParams(searchParams);
  const { products, total, facets } = await queryProducts({
    department,
    categorySlug,
    params,
  });

  // Category pages already imply the category, so hide that filter
  const showCategories = !categorySlug;
  const heading = params.q ? `Results for “${params.q}”` : title;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => {
            const last = i === breadcrumbs.length - 1;
            return (
              <Fragment key={crumb.label}>
                <BreadcrumbItem>
                  {last || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!last && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 space-y-2 border-b pb-8">
        {eyebrow && (
          <p className="flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
            <span className="size-3 rotate-45 bg-primary" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold font-heading tracking-tight sm:text-4xl">{heading}</h1>
        {description && <p className="max-w-xl text-muted-foreground">{description}</p>}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pr-2">
            <FilterPanel facets={facets} showCategories={showCategories} />
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <ListingToolbar
            count={products.length}
            facets={facets}
            showCategories={showCategories}
          />
          <ActiveFilters />

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <ListingEmpty noProducts={total === 0} />
          )}
        </div>
      </div>
    </div>
  );
}