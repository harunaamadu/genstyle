"use client";

import { useCallback } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useI18nStore } from "@/store/i18n-store";
import { dictionaries } from "@/i18n/dictionaries";
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/i18n/config";
import { formatCurrency } from "@/lib/format";

export function useLocale() {
  const mounted = useMounted();
  const locale = useI18nStore((s) => s.locale);
  return mounted ? locale : DEFAULT_LOCALE;
}

export function useCurrency() {
  const mounted = useMounted();
  const currency = useI18nStore((s) => s.currency);
  return mounted ? currency : DEFAULT_CURRENCY;
}

/** const t = useT();  ->  t.addToCart */
export function useT() {
  return dictionaries[useLocale()];
}

/** const formatPrice = useFormatPrice();  ->  formatPrice(49.99) */
export function useFormatPrice() {
  const locale = useLocale();
  const currency = useCurrency();
  return useCallback(
    (amountUSD: number) => formatCurrency(amountUSD, currency, locale),
    [locale, currency]
  );
}