import { z } from "zod";

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h2"), text: z.string().min(1) }),
  z.object({ type: z.literal("quote"), text: z.string().min(1), cite: z.string().optional() }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
]);

export const postSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  excerpt: z.string().min(1).max(200),
  category: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.object({ name: z.string(), role: z.string() }),
  image: z.string(),
  imageAlt: z.string(),
  body: z.array(blockSchema).min(1),
});

export type Post = z.infer<typeof postSchema>;
export type PostBlock = z.infer<typeof blockSchema>;