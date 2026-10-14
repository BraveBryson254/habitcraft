"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { CATEGORY_LABEL } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "./ProductCard";
import { money, cx } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { openCoachChat } from "@/components/chat/openCoachChat";
import { SITE, DISCLAIMER } from "@/lib/config";

const TABS = ["Overview", "Label & facts", "How to use", "Shipping"];

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openDrawer);
  const toast = useToast((s) => s.show);
  const [opt, setOpt] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);

  const affiliateHref = product.affiliateUrl ? `${SITE.affiliateBase}${product.affiliateUrl}` : "#";

  const tabContent = [
    <p key="0">{product.longDescription} Part of the Habitcraft shelf — chosen for everyday general wellness.</p>,
    <table key="1"><tbody>{product.facts.map(([k, v], i) => <tr key={i}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>,
    <p key="2">Follow the directions on the product label. Educational information only — consult a physician before starting any supplement.</p>,
    <p key="3">Ships in 1–2 business days. Free US shipping over $60. Easy 30-day returns on unopened items.</p>,
  ];

  return (
    <section className="wrap">
      <div className="pdp">
        <div className="pdp-img">
          {product.badge && <span className="bdg" style={{ left: 20, top: 20 }}>{product.badge}</span>}
          <ProductArt type={product.art} color={product.color} label={product.label} />
        </div>
        <div>
          <div className="crumb">
            <Link href="/store">Store</Link> / <Link href={`/store?cat=${product.category}`}>{CATEGORY_LABEL[product.category]}</Link> / {product.name}
          </div>
          <h1>{product.name}</h1>
          <div className="big">{money(product.priceCents)}</div>
          <p style={{ color: "var(--muted)", margin: "14px 0 20px", fontSize: 17 }}>{product.shortDescription}</p>

          <b style={{ fontSize: 14 }}>Option</b>
          <div className="opts">
            {product.options.map((o, i) => (
              <button key={o} className={cx("opt", opt === i && "on")} onClick={() => setOpt(i)}>{o}</button>
            ))}
          </div>

          {product.mode === "buy" ? (
            <div className="buyrow">
              <div className="qtyb">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <b>{qty}</b>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
              </div>
              <button className="btn btn-hot" style={{ flex: 1 }} onClick={() => { add(product.id, opt, qty); toast(`${product.name} added`); openCart(); }}>
                Add to cart · {money(product.priceCents * qty)}
              </button>
            </div>
          ) : (
            <div className="buyrow">
              <a className="btn btn-lime" style={{ flex: 1 }} href={affiliateHref} target="_blank" rel="sponsored nofollow noopener">Shop at our partner ↗</a>
            </div>
          )}
          {product.mode === "affiliate" && <p className="note">Affiliate link — Habitcraft may earn a commission at no extra cost to you.</p>}

          <button className="btn btn-line btn-sm" style={{ marginBottom: 16 }} onClick={() => openCoachChat(`Tell me about the ${product.name}`)}>
            Ask Coach B about this product
          </button>

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", fontWeight: 600, fontSize: 14, color: "var(--muted)" }}>
            <span>🚚 Ships in 1–2 days</span><span>↩️ 30-day returns</span><span>🔒 Secure checkout</span>
          </div>

          <div className="tabs">
            {TABS.map((tLabel, i) => (
              <button key={tLabel} className={cx(tab === i && "on")} onClick={() => setTab(i)}>{tLabel}</button>
            ))}
          </div>
          <div className="tabc">{tabContent[tab]}</div>
        </div>
      </div>

      <h2 style={{ fontSize: 36, margin: "40px 0 24px" }}>You might also like</h2>
      <div className="pgrid">
        {related.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <p className="disc-s">{DISCLAIMER}</p>
      <div style={{ height: 70 }} />
    </section>
  );
}
