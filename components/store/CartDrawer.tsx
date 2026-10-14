"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, resolveItem } from "@/lib/cart";
import { ProductArt } from "@/components/ProductArt";
import { money } from "@/lib/utils";
import { PRICES } from "@/lib/config";
import { useToast } from "@/components/Toast";

/** Slide-in cart drawer (brief §5). Direct-buy products only. */
export function CartDrawer() {
  const router = useRouter();
  const toast = useToast((s) => s.show);
  const { items, drawerOpen, closeDrawer, setQty, applyPromo, promoApplied, totals } = useCart();
  const [promoInput, setPromoInput] = useState("");

  // lock the launcher + scroll while open (body class handled by CSS)
  useEffect(() => {
    document.body.classList.toggle("dr-open", drawerOpen);
    return () => document.body.classList.remove("dr-open");
  }, [drawerOpen]);

  const t = totals();
  const count = items.reduce((a, c) => a + c.qty, 0);
  const left = Math.max(0, PRICES.freeShippingThreshold - (t.subtotalCents - t.discountCents));

  function handlePromo() {
    if (applyPromo(promoInput)) toast(`Promo applied: ${PRICES.promoPercent}% off`);
    else toast("Invalid code");
  }

  function checkout() {
    closeDrawer();
    router.push("/store/checkout");
  }

  return (
    <>
      <div className={`ov${drawerOpen ? " open" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? " open" : ""}`} aria-label="Cart" aria-hidden={!drawerOpen}>
        <div className="dh"><h3>Your cart ({count})</h3><button className="dx" onClick={closeDrawer} aria-label="Close">×</button></div>

        <div className="free">
          {left > 0 ? <>Add <b>{money(left)}</b> more for free shipping</> : <>🎉 You&apos;ve unlocked free shipping!</>}
          <div className="tr"><i style={{ width: `${Math.min(100, ((t.subtotalCents - t.discountCents) / PRICES.freeShippingThreshold) * 100)}%` }} /></div>
        </div>

        <div className="di">
          {items.length ? (
            items.map((item, i) => {
              const r = resolveItem(item);
              if (!r) return null;
              return (
                <div className="ci" key={`${item.id}-${item.optionIndex}`}>
                  <div className="t"><ProductArt type={r.product.art} color={r.product.color} label={r.product.label} /></div>
                  <div>
                    <h5>{r.product.name}</h5>
                    <small>{r.option}</small>
                    <br />
                    <span className="qq">
                      <button onClick={() => setQty(i, -1)} aria-label="Decrease">−</button>
                      <b>{r.qty}</b>
                      <button onClick={() => setQty(i, 1)} aria-label="Increase">+</button>
                    </span>
                  </div>
                  <div className="prc">{money(r.product.priceCents * r.qty)}</div>
                </div>
              );
            })
          ) : (
            <div className="empty"><div style={{ fontSize: 54 }}>🛒</div><p style={{ marginTop: 10 }}>Your cart is empty.<br />Add some gear!</p></div>
          )}
        </div>

        <div className="df">
          <div className="promo">
            <input placeholder="Promo code (try HABIT10)" value={promoApplied ? PRICES.promoCode : promoInput} disabled={promoApplied} onChange={(e) => setPromoInput(e.target.value)} />
            <button className="btn btn-dark btn-sm" onClick={handlePromo} disabled={promoApplied}>Apply</button>
          </div>
          <div className="dr"><span>Subtotal</span><span>{money(t.subtotalCents)}</span></div>
          {promoApplied && <div className="dr" style={{ color: "var(--teal)" }}><span>Promo ({PRICES.promoPercent}%)</span><span>−{money(t.discountCents)}</span></div>}
          <div className="dr"><span>Shipping</span><span>{t.shippingCents ? money(t.shippingCents) : "Free"}</span></div>
          <div className="dt"><span>Total</span><span>{money(t.totalCents)}</span></div>
          <button className="btn btn-hot btn-block" disabled={!items.length} onClick={checkout}>Checkout securely</button>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 12 }}>🔒 Powered by Stripe</p>
        </div>
      </aside>
    </>
  );
}
