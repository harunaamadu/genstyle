import { z } from "zod";

export function addToCartSchema(maxStock: number) {
  return z.object({
    size: z.string().min(1),
    quantity: z.number().int().min(1).max(Math.max(maxStock, 1)),
  });
}

export const promoSchema = z.object({
  code: z.string().trim().min(1).max(24),
});