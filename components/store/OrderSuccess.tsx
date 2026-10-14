"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Check } from "@/components/Avatar";

/** Shown after Stripe redirects back. Clears the cart on mount. */
export function OrderSuccess() {
  const params = useSearchParams();
  const clear = useCart((s) => s.clear);
  const orderNo = params.get("order") || `HC-${Math.floor(10000 + Math.random() * 89999)}`;

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <section className="wrap" style={{ padding: "80px 24px" }}>
      <div className="done-card" style={{ border: "2px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)" }}>
        <div className="big"><Check /></div>
        <h2 style={{ fontSize: 42 }}>Thank you!</h2>
        <p style={{ color: "var(--muted)", margin: "14px 0 8px", fontSize: 17 }}>Order #{orderNo} is confirmed. A receipt is on its way to your email.</p>
        <p style={{ color: "var(--muted)", marginBottom: 26 }}>Estimated delivery: 3–5 business days (1–2 for Express).</p>
        <Link className="btn btn-hot" href="/store">Continue shopping</Link>
      </div>
    </section>
  );
}
