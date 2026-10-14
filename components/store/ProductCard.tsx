"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { SITE } from "@/lib/config";

/** A single product card (brief §5). Direct-buy → "+ Add"; affiliate → "Shop ↗". */
export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openDrawer);
  const toast = useToast((s) => s.show);
  const [wished, setWished] = useState(false);

  const affiliateHref = product.affiliateUrl ? `${SITE.affiliateBase}${product.affiliateUrl}` : "#";

  return (
    <div className="pc">
      <div className="pi" style={{ background: `linear-gradient(160deg,${CATEGORY_COLOR[product.category]}22,#fff)` }}>
        {product.badge && <span className="bdg">{product.badge}</span>}
        {product.mode === "affiliate" && <span className="bdg aff" style={product.badge ? { top: 46 } : undefined}>Partner</span>}
        <button
          className={`heart${wished ? " on" : ""}`}
          onClick={() => { setWished((w) => !w); toast(wished ? "Removed from wishlist" : "Saved to wishlist"); }}
          aria-label="Wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a2230" strokeWidth="2.2"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.5-8 11-8 11z" /></svg>
        </button>
        <Link href={`/store/${product.slug}`} aria-label={product.name} style={{ display: "contents" }}>
          <ProductArt type={product.art} color={product.color} label={product.label} />
        </Link>
      </div>
      <div className="pb">
        <span className="cc">{CATEGORY_LABEL[product.category]}</span>
        <h4>{product.name}</h4>
        <p className="pd">{product.shortDescription}</p>
        <div className="prc">
          <span className="pp">{money(product.priceCents)}</span>
          {product.mode === "buy" ? (
            <button className="addb" onClick={() => { add(product.id, 0, 1); toast(`${product.name} added`); openCart(); }}>+ Add</button>
          ) : (
            <a className="addb aff" href={affiliateHref} target="_blank" rel="sponsored nofollow noopener">Shop ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}
