"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface ToastState {
  message: string;
  visible: boolean;
  show: (m: string) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: "",
  visible: false,
  show: (message) => set({ message, visible: true }),
  hide: () => set({ visible: false }),
}));

/** A small confirmation toast used across the app (add-to-cart, promo, etc.). */
export function Toast() {
  const { message, visible, hide } = useToast();
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(hide, 2200);
    return () => clearTimeout(t);
  }, [visible, message, hide]);

  return (
    <div className={`toast${visible ? " show" : ""}`} role="status" aria-live="polite">
      <i>✓</i>
      {message}
    </div>
  );
}
