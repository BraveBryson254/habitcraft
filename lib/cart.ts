"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, getProductById } from "./products";
import { PRICES } from "./config";

export interface CartItem {
  id: string; // product id
  optionIndex: number;
  qty: number;
}

interface CartTotals {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
}

interface CartState {
  items: CartItem[];
  promoApplied: boolean;
  drawerOpen: boolean;
  // actions
  add: (id: string, optionIndex: number, qty: number) => void;
  setQty: (index: number, delta: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  count: () => number;
  totals: () => CartTotals;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoApplied: false,
      drawerOpen: false,

      add: (id, optionIndex, qty) => {
        const product = getProductById(id);
        // Guard: only direct-buy products ever enter the cart (brief §5).
        if (!product || product.mode !== "buy") return;
        set((state) => {
          const existing = state.items.find((i) => i.id === id && i.optionIndex === optionIndex);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { id, optionIndex, qty }] };
        });
      },

      setQty: (index, delta) =>
        set((state) => {
          const items = state.items
            .map((it, i) => (i === index ? { ...it, qty: it.qty + delta } : it))
            .filter((it) => it.qty > 0);
          return { items };
        }),

      remove: (index) => set((state) => ({ items: state.items.filter((_, i) => i !== index) })),

      clear: () => set({ items: [], promoApplied: false }),

      applyPromo: (code) => {
        if (code.trim().toUpperCase() === PRICES.promoCode) {
          set({ promoApplied: true });
          return true;
        }
        return false;
      },

      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      count: () => get().items.reduce((a, c) => a + c.qty, 0),

      totals: () => {
        const items = get().items;
        const subtotalCents = items.reduce((a, c) => {
          const p = getProductById(c.id);
          return a + (p ? p.priceCents * c.qty : 0);
        }, 0);
        const discountCents = get().promoApplied
          ? Math.round((subtotalCents * PRICES.promoPercent) / 100)
          : 0;
        const afterDiscount = subtotalCents - discountCents;
        const shippingCents =
          subtotalCents === 0 || afterDiscount >= PRICES.freeShippingThreshold
            ? 0
            : PRICES.shipStandard;
        return {
          subtotalCents,
          discountCents,
          shippingCents,
          totalCents: afterDiscount + shippingCents,
        };
      },
    }),
    {
      name: "habitcraft-cart",
      partialize: (s) => ({ items: s.items, promoApplied: s.promoApplied }),
    }
  )
);

/** Resolve a cart item to its full product for rendering. */
export function resolveItem(item: CartItem) {
  const product = getProductById(item.id);
  return product ? { product, option: product.options[item.optionIndex] ?? "", qty: item.qty } : null;
}

export { PRODUCTS };
