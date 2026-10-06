import { z } from "zod";

export const topicValues = ["order", "returns", "product", "other"] as const;

export const topicLabels: Record<(typeof topicValues)[number], string> = {
  order: "Order or delivery",
  returns: "Returns and exchanges",
  product: "Product or sizing",
  other: "Something else",
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
  topic: z.enum(topicValues),
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^(FS-[A-Z0-9]{8})?$/, "Order numbers look like FS-1A2B3C4D"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000, "Please keep it under 2000 characters"),
  website: z.string().optional(), // honeypot: real people never fill this in
});

export type ContactInput = z.infer<typeof contactSchema>;