"use server";

import { z } from "zod";
import { getProductsByIds } from "@/lib/cms/products";

const idsSchema = z.array(z.string().max(64)).max(50);

export async function fetchProductsByIds(ids: string[]) {
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return [];
  return getProductsByIds(parsed.data);
}