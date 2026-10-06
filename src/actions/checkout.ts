"use server";

import { auth } from "@/auth";
import { momoNetworks } from "@/data/checkout";
import { countries } from "@/data/countries";
import { db } from "@/lib/db";
import { priceCart, toCents, toOrder } from "@/lib/orders";
import { placeOrderSchema, type CheckoutInput } from "@/lib/validations/checkout";
import type { PlaceOrderResult } from "@/types/order";

const paymentMap = { card: "CARD", momo: "MOMO", cod: "COD" } as const;

function newOrderNumber() {
  return `FS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "P2002"
  );
}

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Some details look invalid. Please review the form and try again.",
    };
  }

  const data = parsed.data;

  if (!countries.some((c) => c.code === data.country)) {
    return { ok: false, message: "We can't deliver to that country yet." };
  }

  const priced = await priceCart(data.lines, data.promoCode);
  if (!priced.ok) {
    return {
      ok: false,
      message: "Some items in your bag changed. Please review your bag.",
      issues: priced.issues,
    };
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  // First-order-only promos: checked by account and by email, so guests can't reuse them
  if (priced.totals.promo?.firstOrderOnly) {
    const previous = await db.order.count({
      where: { OR: [{ email: data.email }, ...(userId ? [{ userId }] : [])] },
    });
    if (previous > 0) {
      return {
        ok: false,
        message: `${priced.totals.promo.code} is only valid on a first order. Remove it from your bag and try again.`,
      };
    }
  }

  // Only a masked hint of the Mobile Money number is stored
  let paymentDetail: string | null = null;
  if (data.paymentMethod === "momo" && data.momoNumber) {
    const network = momoNetworks.find((n) => n.value === data.momoNetwork)?.label;
    paymentDetail = `${network} •••${data.momoNumber.replace(/\D/g, "").slice(-3)}`;
  }

  // TODO: charge via the payment provider before creating the order,
  // or create it PENDING and let a webhook mark it PAID.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const row = await db.order.create({
        data: {
          orderNumber: newOrderNumber(),
          userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          region: data.region,
          postalCode: data.postalCode,
          country: data.country,
          paymentMethod: paymentMap[data.paymentMethod],
          paymentDetail,
          promoCode: priced.totals.promo?.code ?? null,
          subtotal: toCents(priced.totals.subtotal),
          discount: toCents(priced.totals.discount),
          shippingCost: toCents(priced.totals.shipping),
          total: toCents(priced.totals.total),
          items: {
            create: priced.items.map((i) => ({
              productId: i.productId,
              slug: i.slug,
              sku: i.sku,
              name: i.name,
              image: i.image,
              color: i.color,
              size: i.size,
              unitPrice: toCents(i.price),
              quantity: i.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return { ok: true, order: toOrder(row) };
    } catch (error) {
      if (isUniqueViolation(error) && attempt < 2) continue; // order-number collision: retry
      console.error("placeOrder failed", error);
      break;
    }
  }

  return { ok: false, message: "We couldn't save your order. Please try again." };
}

/** Prefills checkout for signed-in shoppers: last used address, else just their name and email. */
export async function getCheckoutDefaults(): Promise<Partial<CheckoutInput> | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;

  const last = await db.order.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (last) {
    return {
      email: user.email ?? last.email,
      firstName: last.firstName,
      lastName: last.lastName,
      phone: last.phone,
      country: last.country,
      address1: last.address1,
      address2: last.address2,
      city: last.city,
      region: last.region,
      postalCode: last.postalCode,
    };
  }

  const [firstName = "", ...rest] = (user.name ?? "").split(" ");
  return { email: user.email ?? "", firstName, lastName: rest.join(" ") };
}