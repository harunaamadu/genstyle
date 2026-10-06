import { currencyRates, localeMeta, type Currency, type Locale } from "@/i18n/config";

/** Prices are stored in USD; this converts and formats for the shopper. */
export function formatCurrency(
  amountUSD: number,
  currency: Currency,
  locale: Locale
) {
  return new Intl.NumberFormat(localeMeta[locale].tag, {
    style: "currency",
    currency,
  }).format(amountUSD * currencyRates[currency]);
}

/** "Orders over {amount}" -> "Orders over $150.00" */
export function interpolate(
  template: string,
  vars: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export function formatDate(iso: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(iso)
  );
}