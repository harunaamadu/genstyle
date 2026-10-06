import { z } from "zod";

export const sortOptions = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
] as const;

export type SortOption = (typeof sortOptions)[number];

export const sortLabels: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

const csv = z
  .string()
  .optional()
  .transform((v) =>
    v
      ? v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );

const price = z.coerce.number().min(0).optional().catch(undefined);

export const listingParamsSchema = z.object({
  sort: z.enum(sortOptions).catch("featured"),
  category: csv,
  size: csv,
  color: csv,
  min: price,
  max: price,
  q: z.string().trim().max(80).optional().catch(undefined),
});

export type ListingParams = z.infer<typeof listingParamsSchema>;
export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseListingParams(raw: RawSearchParams): ListingParams {
  const flat = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );
  return listingParamsSchema.parse(flat);
}