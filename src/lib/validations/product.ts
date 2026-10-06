import { z } from "zod";

const translationSchema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  description: z.string().optional(),
});

export const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/), // swatch data, not a UI colour
});

export const variantSchema = z.object({
  sku: z.string().min(1),
  size: z.string().min(1),
  stock: z.number().int().min(0),
});

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  gender: z.enum(["men", "women", "kids", "unisex"]),
  category: z.string(),
  basePrice: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discountPercent: z.number().min(1).max(90).optional(),
  newArrival: z.boolean(),
  rating: z.number().min(0).max(5),
  images: z.array(z.string()).min(1),
  colors: z.array(colorSchema).min(1),
  variants: z.array(variantSchema).min(1),
  brand: z.string().optional(),
  material: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  care: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  translations: z.object({
    en: translationSchema,
    es: translationSchema.optional(),
    fr: translationSchema.optional(),
    nl: translationSchema.optional(),
    ja: translationSchema.optional(),
  }),
});

export type Product = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof variantSchema>;
export type ProductColor = z.infer<typeof colorSchema>;
