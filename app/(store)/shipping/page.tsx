import type { Metadata } from "next";
import { money } from "@/lib/utils";
import { PRICES } from "@/lib/config";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <section className="wrap" style={{ maxWidth: 820, padding: "60px 24px 90px" }}>
      <span className="tag orange-t">Store</span>
      <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, margin: "12px 0 20px" }}>Shipping &amp; returns</h1>
      <div className="card" style={{ border: "2px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }}>
        <h3>Delivery options</h3>
        <ul className="legal-body" style={{ marginTop: 10 }}>
          <li><strong>Standard</strong> — 3 to 5 business days: {money(PRICES.shipStandard)}</li>
          <li><strong>Express</strong> — 1 to 2 business days: {money(PRICES.shipExpress)}</li>
          <li><strong>Free shipping</strong> on orders over {money(PRICES.freeShippingThreshold, true)}</li>
        </ul>
        <h3 style={{ marginTop: 20 }}>Returns</h3>
        <p className="legal-body">Unopened items can be returned within 30 days for a refund, minus return shipping. Opened supplements: see our Refund Policy. Affiliate products are returned through the partner retailer under their policy.</p>
        <h3 style={{ marginTop: 20 }}>Tracking</h3>
        <p className="legal-body">You&apos;ll get a tracking email once your order ships. Questions about an order? Ask Coach B with your order number (format HC-#####), or email us.</p>
      </div>
    </section>
  );
}
