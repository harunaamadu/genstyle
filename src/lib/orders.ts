import { computeTotals } from "@/lib/cart";
import { getProductsByIds } from "@/lib/cms/products";
import type { OrderLineInput } from "@/lib/validations/checkout";
import type { CartItem } from "@/store/cart-store";

import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { Order, OrderStatus, PaymentMethod } from "@/types/order";

/**
 * Re-prices a cart from the catalogue. Client-sent prices are never used.
 * Returns human-readable issues if anything can't be fulfilled.
 */
export async function priceCart(lines: OrderLineInput[], promoCode: string | null) {
  const ids = [...new Set(lines.map((l) => l.productId))];
  const found = await getProductsByIds(ids);
  const byId = new Map(found.map((p) => [p.id, p]));

  const issues: string[] = [];
  const items: CartItem[] = [];

  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) {
      issues.push("An item in your bag is no longer available.");
      continue;
    }

    const name = product.translations.en.name;
    const variant = product.variants.find((v) => v.sku === line.sku);
    const color = product.colors.find((c) => c.name === line.color);

    if (!variant || !color) {
      issues.push(`${name} is no longer available in that size or colour.`);
      continue;
    }
    if (variant.stock <= 0) {
      issues.push(`${name} (${variant.size}) just sold out.`);
      continue;
    }
    if (line.quantity > variant.stock) {
      issues.push(`Only ${variant.stock} of ${name} (${variant.size}) left in stock.`);
      continue;
    }

    items.push({
      lineId: `${variant.sku}:${color.name}`,
      productId: product.id,
      slug: product.slug,
      sku: variant.sku,
      name,
      image: product.images[0],
      color: color.name,
      size: variant.size,
      price: product.basePrice,
      quantity: line.quantity,
      maxStock: variant.stock,
    });
  }

  if (issues.length > 0) return { ok: false as const, issues };

  return { ok: true as const, items, totals: computeTotals(items, promoCode) };
}


export type OrderRow = Prisma.OrderGetPayload<{ include: { items: true } }>;

export const toCents = (usd: number) => Math.round(usd * 100);
const fromCents = (cents: number) => cents / 100;

export function toOrder(row: OrderRow): Order {
  return {
    orderNumber: row.orderNumber,
    status: row.status.toLowerCase() as OrderStatus,
    createdAt: row.createdAt.toISOString(),
    email: row.email,
    shipping: {
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      address1: row.address1,
      address2: row.address2,
      city: row.city,
      region: row.region,
      postalCode: row.postalCode,
      country: row.country,
    },
    paymentMethod: row.paymentMethod.toLowerCase() as PaymentMethod,
    paymentDetail: row.paymentDetail ?? undefined,
    promoCode: row.promoCode,
    lines: row.items.map((i) => ({
      productId: i.productId,
      slug: i.slug,
      sku: i.sku,
      name: i.name,
      image: i.image,
      color: i.color,
      size: i.size,
      price: fromCents(i.unitPrice),
      quantity: i.quantity,
    })),
    totals: {
      subtotal: fromCents(row.subtotal),
      discount: fromCents(row.discount),
      shipping: fromCents(row.shippingCost),
      total: fromCents(row.total),
    },
  };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const rows = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });
  return rows.map(toOrder);
}