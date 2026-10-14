"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, type ProductCategory } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { ProductArt, CategoryIcon } from "@/components/ProductArt";
import { cx, money } from "@/lib/utils";
import { DISCLAIMER } from "@/lib/config";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { openCoachChat } from "@/components/chat/openCoachChat";

type SortKey = "feat" | "lo" | "hi";

export function StoreListing() {
  const params = useSearchParams();
  const initialCat = (params.get("cat") as ProductCategory) || "all";
  const [cat, setCat] = useState<ProductCategory | "all">(initialCat);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("feat");

  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openDrawer);
  const toast = useToast((s) => s.show);

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => p.active && (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "lo") l = [...l].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "hi") l = [...l].sort((a, b) => b.priceCents - a.priceCents);
    return l;
  }, [cat, query, sort]);

  function addStack() {
    ["whey-protein", "shaker", "bands"].forEach((id) => add(id, 0, 1));
    toast("Starter stack added");
    openCart();
  }

  const stackPrice = Math.round((4600 + 1400 + 2500) * 0.9);

  return (
    <>
      {/* HERO */}
      <section className="sh-hero">
        <div className="wrap sh-g">
          <div>
            <span className="tag" style={{ color: "var(--ink)" }}>Habitcraft Store</span>
            <h1 style={{ marginTop: 14 }}>Fuel the plan. <em>Gear up.</em></h1>
            <p>A short, curated shelf of protein, daily basics and training gear — chosen to go with your Habitcraft plan.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-dark" href="#shop">Shop now</a>
              <button className="btn btn-white" onClick={() => openCoachChat("Help me choose a product")}>Ask Coach B</button>
            </div>
          </div>
          <div className="sh-art">
            <span className="blob" style={{ width: 340, height: 340, right: 30, top: 20 }} />
            <span className="blob" style={{ width: 150, height: 150, left: 20, bottom: 10 }} />
            <div className="p" style={{ left: "6%", top: 70, width: 170 }}><ProductArt type="tub" color="#14213d" label="WHEY" labelColor="#ff6a2b" /></div>
            <div className="p" style={{ left: "34%", top: 0, width: 200, animationDelay: "-2s" }}><ProductArt type="tub" color="#ff6a2b" label="PLANT" /></div>
            <div className="p" style={{ right: "18%", top: 100, width: 150, animationDelay: "-4s" }}><ProductArt type="shaker" color="#14b8a6" label="" /></div>
            <div className="p" style={{ right: 0, top: 12, width: 140, animationDelay: "-1s" }}><ProductArt type="bands" color="#fff" label="" /></div>
          </div>
        </div>
      </section>

      {/* INFO BAR */}
      <div className="ship">
        <div className="wrap">
          <span>🚚 Free shipping over $60</span>
          <span>🔒 Secure Stripe checkout</span>
          <span>↩️ Easy returns</span>
          <span>🏷️ Use code <b>HABIT10</b> for 10% off</span>
        </div>
      </div>

      {/* SHOP */}
      <section className="sec" style={{ paddingTop: 50 }} id="shop">
        <div className="wrap">
          <div className="cats">
            {CATEGORIES.slice(0, 5).map((c) => (
              <div key={c.id} className={cx("cat", cat === c.id && "on")} onClick={() => setCat(c.id)}>
                <div className="cim"><CategoryIcon category={c.id} /></div>
                <b>{c.label}</b>
              </div>
            ))}
          </div>

          <div className="bar">
            <div className="search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a2230" strokeWidth="2.4"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              <input placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
            </div>
            <select className="sel" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort">
              <option value="feat">Featured</option>
              <option value="lo">Price: low to high</option>
              <option value="hi">Price: high to low</option>
            </select>
            <select className="sel" value={cat} onChange={(e) => setCat(e.target.value as ProductCategory | "all")} aria-label="Category">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className="pgrid">
            {list.length ? (
              list.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <p style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--muted)" }}>No products found.</p>
            )}
          </div>

          {/* starter stack */}
          <div className="stack">
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="tag" style={{ color: "var(--lime)" }}>Starter stack</span>
              <h3>Protein + Shaker + Bands</h3>
              <p>Everything to start training at home. Bundle and save 10% at checkout.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
                <span className="disp" style={{ fontSize: 38 }}>{money(stackPrice)}</span>
                <s style={{ color: "#7fa1aa" }}>{money(4600 + 1400 + 2500)}</s>
              </div>
              <button className="btn btn-hot" style={{ marginTop: 18 }} onClick={addStack}>Add the stack</button>
            </div>
            <div className="imgs">
              <ProductArt type="tub" color="#ff6a2b" label="WHEY" />
              <ProductArt type="shaker" color="#c8f542" label="" />
              <ProductArt type="bands" color="#14b8a6" label="" />
            </div>
          </div>

          <p className="disc-s">{DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
