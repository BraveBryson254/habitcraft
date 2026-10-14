"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Toggles the `mode-store` / `mode-fit` class on <body> so the store theme
 *  (orange chat launcher, cream background, etc.) applies on Store routes. */
export function BodyMode() {
  const pathname = usePathname();
  useEffect(() => {
    const store = pathname?.startsWith("/store");
    document.body.classList.toggle("mode-store", !!store);
    document.body.classList.toggle("mode-fit", !store);
  }, [pathname]);
  return null;
}
