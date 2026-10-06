import { z } from "zod";

export const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "Type something to search")
    .max(80, "Search is too long"),
});

export type SearchInput = z.infer<typeof searchSchema>;