import type { Metadata } from "next";
import { ProductListing } from "@/components/listing/product-listing";
import type { RawSearchParams } from "@/lib/validations/listing";

export const metadata: Metadata = { title: "Shop all" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  return (
    <ProductListing
      title="Shop all"
      eyebrow="The full collection"
      description="Everything we make, in one place. Filter by size, colour and price."
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      searchParams={await searchParams}
    />
  );
}