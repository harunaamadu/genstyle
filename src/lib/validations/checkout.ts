import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type Report = (field: string, message: string) => void;

export function passesLuhn(digits: string) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function isFutureExpiry(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  // Day 0 of the next month = last day of this month
  return new Date(year, month, 0, 23, 59, 59) >= new Date();
}

export function isValidMomoNumber(value: string) {
  return /^(?:\+233|0)\d{9}$/.test(value.replace(/[\s-]/g, ""));
}

function checkCard(
  d: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
  },
  report: Report,
) {
  if (d.cardName.trim().length < 2)
    report("cardName", "Enter the name on your card");

  const digits = d.cardNumber.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits) || !passesLuhn(digits))
    report("cardNumber", "Enter a valid card number");

  if (!isFutureExpiry(d.cardExpiry))
    report("cardExpiry", "Enter a valid expiry (MM/YY)");
  if (!/^\d{3,4}$/.test(d.cardCvc))
    report("cardCvc", "Enter the 3 or 4 digit code");
}

function checkMomo(
  network: string | undefined,
  number: string | undefined,
  report: Report,
) {
  if (!network) report("momoNetwork", "Choose your network");
  if (!isValidMomoNumber(number ?? ""))
    report("momoNumber", "Enter a valid Ghana number, e.g. 024 123 4567");
}

/* ------------------------------------------------------------------ */
/* Field groups                                                        */
/* ------------------------------------------------------------------ */

const name = (label: string) =>
  z.string().trim().min(1, `Enter your ${label}`).max(60);

export const contactShape = {
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
  newsletter: z.boolean(),
};

export const shippingShape = {
  firstName: name("first name"),
  lastName: name("last name"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number"),
  country: z.string().min(2, "Select a country"),
  address1: z.string().trim().min(3, "Enter your street address").max(120),
  address2: z.string().trim().max(120),
  city: z.string().trim().min(2, "Enter your city or town").max(80),
  region: z.string().trim().min(2, "Enter your region or state").max(80),
  postalCode: z.string().trim().max(20),
};

export const paymentMethods = ["card", "momo", "cod"] as const;
const momoNetworkValues = ["mtn", "telecel", "airteltigo"] as const;

const termsShape = {
  acceptTerms: z
    .boolean()
    .refine((v) => v, "Please accept the terms to continue"),
};

/* ------------------------------------------------------------------ */
/* Client form schema (includes card fields, which never leave the browser) */
/* ------------------------------------------------------------------ */

export const checkoutSchema = z
  .object({
    ...contactShape,
    ...shippingShape,
    paymentMethod: z.enum(paymentMethods),
    cardName: z.string(),
    cardNumber: z.string(),
    cardExpiry: z.string(),
    cardCvc: z.string(),
    momoNetwork: z.enum(momoNetworkValues),
    momoNumber: z.string(),
    ...termsShape,
  })
  .superRefine((d, ctx) => {
    const report: Report = (field, message) =>
      ctx.addIssue({ code: "custom", path: [field], message });

    if (d.paymentMethod === "card") checkCard(d, report);
    if (d.paymentMethod === "momo")
      checkMomo(d.momoNetwork, d.momoNumber, report);
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/* ------------------------------------------------------------------ */
/* Server schema: what the action accepts. No prices, no card data.    */
/* ------------------------------------------------------------------ */

export const orderLineSchema = z.object({
  productId: z.string().min(1).max(64),
  sku: z.string().min(1).max(64),
  color: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(99),
});

export type OrderLineInput = z.infer<typeof orderLineSchema>;

export const placeOrderSchema = z
  .object({
    ...contactShape,
    ...shippingShape,
    paymentMethod: z.enum(paymentMethods),
    momoNetwork: z.enum(momoNetworkValues).optional(),
    momoNumber: z.string().max(20).optional(),
    ...termsShape,
    promoCode: z.string().max(24).nullable(),
    lines: z.array(orderLineSchema).min(1).max(50),
  })
  .superRefine((d, ctx) => {
    if (d.paymentMethod !== "momo") return;
    checkMomo(d.momoNetwork, d.momoNumber, (field, message) =>
      ctx.addIssue({ code: "custom", path: [field], message }),
    );
  });

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
