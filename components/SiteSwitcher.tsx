"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";

/** The sticky bar at the very top of both sites (brief §2). */
export function SiteSwitcher() {
  const pathname = usePathname();
  const isStore = pathname?.startsWith("/store");
  return (
    <div className="switch">
      <div className="wrap">
        <small>Two sites, one brand · meet Coach B</small>
        <div className="sw-tabs">
          <Link href="/" className={cx(!isStore && "on")}>🏋️ Habitcraft Fitness</Link>
          <Link href="/store" className={cx(isStore && "on")}>🛒 Habitcraft Store</Link>
        </div>
        <small>1-on-1 online coaching · adults 18+</small>
      </div>
    </div>
  );
}
