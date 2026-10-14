import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Checkout cancelled" };

export default function OrderCancelPage() {
  return (
    <section className="wrap" style={{ padding: "80px 24px", textAlign: "center" }}>
      <div className="done-card" style={{ border: "2px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)" }}>
        <div className="big" style={{ background: "var(--sun)" }}>↩</div>
        <h2 style={{ fontSize: 40 }}>Checkout cancelled</h2>
        <p style={{ color: "var(--muted)", margin: "14px 0 26px", fontSize: 17 }}>
          No charge was made. Your cart is still saved — pick up where you left off whenever you&apos;re ready.
        </p>
        <Link className="btn btn-hot" href="/store">Back to the store</Link>
      </div>
    </section>
  );
}
