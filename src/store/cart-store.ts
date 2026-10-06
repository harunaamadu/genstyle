import { siteConfig } from "@/data/site-config";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findPromo } from "@/data/promos";

export type CartItem = {
  lineId: string;
  productId: string;
  slug: string;
  sku: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number; // USD
  quantity: number;
  maxStock: number;
};

type NewCartItem = Omit<CartItem, "lineId" | "quantity">;

type CartState = {
  items: CartItem[];
  promoCode: string | null;
  isOpen: boolean;
  addItem: (item: NewCartItem, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      isOpen: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const lineId = `${item.sku}:${item.color}`;
          const existing = state.items.find((i) => i.lineId === lineId);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === lineId
                  ? {
                      ...i,
                      maxStock: item.maxStock,
                      quantity: Math.min(i.quantity + quantity, item.maxStock),
                    }
                  : i
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, lineId, quantity: Math.min(quantity, item.maxStock) },
            ],
            isOpen: true,
          };
        }),

      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.lineId !== lineId)
              : state.items.map((i) =>
                  i.lineId === lineId
                    ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                    : i
                ),
        })),

      clearCart: () => set({ items: [], promoCode: null }),

      applyPromo: (code) => {
        const promo = findPromo(code);
        if (!promo) return false;
        set({ promoCode: promo.code });
        return true;
      },
      removePromo: () => set({ promoCode: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: `${siteConfig().name || "genstyle"}-cart`,
      version: 2,
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
      // v1 carts had no slug: start fresh rather than render broken links
      migrate: () => ({ items: [], promoCode: null }) as unknown as CartState,
    }
  )
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);