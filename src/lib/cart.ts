import { findPromo } from "@/data/promos";
import { FREE_SHIPPING_THRESHOLD_USD } from "@/i18n/config";
import type { CartItem } from "@/store/cart-store";

export const SHIPPING_FLAT_USD = 9.99;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** All amounts in USD; format at the edge with useFormatPrice(). */
export function computeTotals(items: CartItem[], promoCode: string | null) {
  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0));

  const promo = promoCode ? findPromo(promoCode) : undefined;
  const discount = promo ? round2((subtotal * promo.percent) / 100) : 0;
  const afterDiscount = round2(subtotal - discount);

  const shipping =
    items.length === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD_USD
      ? 0
      : SHIPPING_FLAT_USD;

  return {
    subtotal,
    discount,
    shipping,
    total: round2(afterDiscount + shipping),
    promo,
    remainingForFreeShipping: Math.max(0, round2(FREE_SHIPPING_THRESHOLD_USD - afterDiscount)),
    freeShippingProgress: Math.min(100, (afterDiscount / FREE_SHIPPING_THRESHOLD_USD) * 100),
  };
}