import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/validations/product";

export function getLocalized(product: Product, locale: Locale) {
  return { ...product.translations.en, ...product.translations[locale] };
}

export function isSoldOut(product: Product) {
  return product.variants.every((v) => v.stock <= 0);
}

/** "W-COAT-S" -> "W-COAT" (shared across all sizes) */
export function getStyleCode(product: Product) {
  return product.variants[0].sku.split("-").slice(0, -1).join("-");
}