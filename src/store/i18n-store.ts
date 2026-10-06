import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  type Currency,
  type Locale,
} from "@/i18n/config";
import { siteConfig } from "@/data/site-config";

type I18nState = {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      currency: DEFAULT_CURRENCY,
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: `${siteConfig().name || "genstyle"}-i18n` }
  )
);