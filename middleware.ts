import { NextRequest, NextResponse } from "next/server";

/**
 * Optional subdomain routing for the Store (brief §2).
 * By default the Store lives at /store (NEXT_PUBLIC_STORE_MODE="path") and this
 * middleware is a no-op. If you set NEXT_PUBLIC_STORE_MODE="subdomain" and point
 * store.yourdomain.com at this app, requests to that host are rewritten so the
 * Store pages serve at the root of the subdomain.
 */
export function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_STORE_MODE !== "subdomain") return NextResponse.next();

  const host = req.headers.get("host") || "";
  const storeHost = process.env.STORE_HOST || "";
  const url = req.nextUrl;

  if (storeHost && host === storeHost && !url.pathname.startsWith("/store")) {
    url.pathname = `/store${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
