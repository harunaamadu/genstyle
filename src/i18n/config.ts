export const locales = ["en", "es", "fr", "nl", "ja"] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const localeMeta: Record<Locale, { label: string; tag: string }> = {
  en: { label: "English", tag: "en-US" },
  es: { label: "Español", tag: "es-ES" },
  fr: { label: "Français", tag: "fr-FR" },
    nl: { label: "Nederlands", tag: "nl-NL" },
  ja: { label: "日本語", tag: "ja-JP" },
};

export const currencies = ["USD", "EUR", "GBP", "JPY"] as const;
export type Currency = (typeof currencies)[number];
export const DEFAULT_CURRENCY: Currency = "USD";

// Static placeholder rates relative to USD. Swap for live rates later.
export const currencyRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 152,
};

export const FREE_SHIPPING_THRESHOLD_USD = 150;