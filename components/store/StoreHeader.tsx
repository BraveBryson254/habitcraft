"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "@/lib/utils";
import { LogoMark, Avatar } from "@/components/Avatar";
import { useCart } from "@/lib/cart";
import { openCoachChat } from "@/components/chat/openCoachChat";

export function StoreHeader() {
  const pathname = usePathname();
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.openDrawer);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="hdr hdr-store">
        <div className="wrap nav">
          <Link className="brand" href="/store"><LogoMark />Habitcraft<em>Store</em></Link>
          <nav className="links">
            <Link href="/store" className={cx(pathname === "/store" && "on")}>Shop all</Link>
            <Link href="/store?cat=protein">Protein</Link>
            <Link href="/store?cat=gear">Gear</Link>
            <Link href="/">← Fitness site</Link>
          </nav>
          <div className="nav-r">
            <button className="askb" onClick={() => openCoachChat()}>
              <Avatar size={34} />Ask Coach B
            </button>
            <button className="cart-btn" onClick={openCart} aria-label="Open cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M6 6L5 3H2" /></svg>
              <span className="n">{count}</span>
            </button>
            <button className="burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">☰</button>
          </div>
        </div>
      </header>
      <div className={`mnav${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}>
        <Link href="/store">Shop all</Link>
        <Link href="/">← Fitness site</Link>
        <Link href="/shipping">Shipping</Link>
        <Link href="/faq">FAQ</Link>
      </div>
    </>
  );
}
