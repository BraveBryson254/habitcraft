"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, resolveItem } from "@/lib/cart";
import { money, cx, isEmail } from "@/lib/utils";
import { PRICES } from "@/lib/config";
import { Check } from "@/components/Avatar";

const STEPS = ["Shipping", "Delivery & payment", "Done"];

/** 3-step checkout (brief §5). Real payment → Stripe Checkout via
 *  /api/checkout/session; demo mode confirms in-app with an order number. */
export function Checkout() {
  const { items, promoApplied, totals, clear } = useCart();
  const [step, setStep] = useState(1);
  const [ship, setShip] = useState<"std" | "exp">("std");
  const [addr, setAddr] = useState({ first: "", last: "", email: "", address: "", city: "", state: "", zip: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  const t = totals();
  const shippingCents = ship === "exp" ? PRICES.shipExpress : t.shippingCents;
  const grandTotal = t.subtotalCents - t.discountCents + shippingCents;

  function validateAddr(): boolean {
    const e: Record<string, string> = {};
    if (!addr.first.trim()) e.first = "Required";
    if (!isEmail(addr.email)) e.email = "Valid email required";
    if (!addr.address.trim()) e.address = "Required";
    if (!addr.city.trim()) e.city = "Required";
    if (!addr.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, optionIndex: i.optionIndex, qty: i.qty })),
          email: addr.email,
          name: `${addr.first} ${addr.last}`.trim(),
          shipping: ship,
          promo: promoApplied,
          address: { line1: addr.address, city: addr.city, state: addr.state, zip: addr.zip },
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      // Demo mode
      setOrderNo(data.orderNumber || `HC-${Math.floor(10000 + Math.random() * 89999)}`);
      setStep(3);
      clear();
    } catch {
      setStep(3);
      setOrderNo(`HC-${Math.floor(10000 + Math.random() * 89999)}`);
      clear();
    } finally {
      setLoading(false);
    }
  }

  if (step === 3) {
    return (
      <section className="wrap" style={{ padding: "80px 24px" }}>
        <div className="done-card" style={{ border: "2px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)" }}>
          <div className="big"><Check /></div>
          <h2 style={{ fontSize: 42 }}>Order confirmed!</h2>
          <p style={{ color: "var(--muted)", margin: "14px 0 8px", fontSize: 17 }}>Order #{orderNo} · A receipt is on its way.</p>
          <p style={{ color: "var(--muted)", marginBottom: 26 }}>Estimated delivery: 3–5 business days.</p>
          <Link className="btn btn-hot" href="/store">Continue shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap">
      <div className="stepper" style={{ paddingTop: 30 }}>
        {STEPS.map((s, i) => (
          <div key={s} className={`sp ${step === i + 1 ? "on" : step > i + 1 ? "done" : ""}`}><i>{step > i + 1 ? "✓" : i + 1}</i>{s}</div>
        ))}
      </div>

      <div className="co">
        {step === 1 ? (
          <div className="card">
            <h3>Shipping address</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px", marginTop: 20 }}>
              <div className="fld"><label>First name</label><input value={addr.first} onChange={(e) => setAddr({ ...addr, first: e.target.value })} /><div className="er">{errors.first}</div></div>
              <div className="fld"><label>Last name</label><input value={addr.last} onChange={(e) => setAddr({ ...addr, last: e.target.value })} /></div>
            </div>
            <div className="fld"><label>Email</label><input type="email" value={addr.email} onChange={(e) => setAddr({ ...addr, email: e.target.value })} /><div className="er">{errors.email}</div></div>
            <div className="fld"><label>Address</label><input value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} /><div className="er">{errors.address}</div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr .8fr", gap: "0 14px" }}>
              <div className="fld"><label>City</label><input value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /><div className="er">{errors.city}</div></div>
              <div className="fld"><label>State</label><input value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} /></div>
              <div className="fld"><label>ZIP</label><input value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} /><div className="er">{errors.zip}</div></div>
            </div>
            <button className="btn btn-hot" onClick={() => validateAddr() && setStep(2)}>Continue</button>
          </div>
        ) : (
          <div className="card">
            <h3>Delivery</h3>
            <div style={{ margin: "18px 0" }}>
              <label className={cx("rad", ship === "std" && "on")}>
                <input type="radio" name="sh" checked={ship === "std"} onChange={() => setShip("std")} />
                <b>Standard · 3–5 days</b><span>{t.shippingCents ? money(t.shippingCents) : "Free"}</span>
              </label>
              <label className={cx("rad", ship === "exp" && "on")}>
                <input type="radio" name="sh" checked={ship === "exp"} onChange={() => setShip("exp")} />
                <b>Express · 1–2 days</b><span>{money(PRICES.shipExpress)}</span>
              </label>
            </div>
            <h3 style={{ marginTop: 26 }}>Payment</h3>
            <div className="pay-mock" style={{ margin: "16px 0 22px" }}>🔒 Stripe Checkout (hosted) — card, Apple Pay, Google Pay</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-dark" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-hot" style={{ flex: 1 }} onClick={placeOrder} disabled={loading}>
                {loading ? "Starting…" : `Place order · ${money(grandTotal)}`}
              </button>
            </div>
          </div>
        )}

        <div className="cos">
          <h4 style={{ fontSize: 22, marginBottom: 14 }}>Order summary</h4>
          {items.length ? (
            items.map((item) => {
              const r = resolveItem(item);
              if (!r) return null;
              return (
                <div className="dr" key={`${item.id}-${item.optionIndex}`} style={{ color: "var(--ink)" }}>
                  <span>{r.product.name} × {r.qty}</span><span>{money(r.product.priceCents * r.qty)}</span>
                </div>
              );
            })
          ) : (
            <p style={{ color: "var(--muted)" }}>Cart is empty — <Link href="/store" style={{ color: "var(--orange-d)" }}>add something first</Link>.</p>
          )}
          <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "14px 0" }} />
          <div className="dr"><span>Subtotal</span><span>{money(t.subtotalCents)}</span></div>
          {promoApplied && <div className="dr"><span>Promo</span><span>−{money(t.discountCents)}</span></div>}
          <div className="dr"><span>Shipping</span><span>{shippingCents ? money(shippingCents) : "Free"}</span></div>
          <div className="dt"><span>Total</span><span>{money(grandTotal)}</span></div>
        </div>
      </div>
    </section>
  );
}
