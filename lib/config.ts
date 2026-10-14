/**
 * Central runtime config. Reads env vars with sensible fallbacks so the
 * app boots even before you've filled in .env (features degrade gracefully).
 */

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@habitcraft.com",
  storeMode: (process.env.NEXT_PUBLIC_STORE_MODE || "path") as "path" | "subdomain",
  storeHost: process.env.STORE_HOST || "",
  affiliateBase: process.env.NEXT_PUBLIC_AFFILIATE_BASE || "https://partner.example.com",
  companyName: "Habitcraft LLC",
  year: new Date().getFullYear(),
};

/** The exact legal disclaimer from the brief (§9). Do not edit the wording. */
export const DISCLAIMER =
  "Habitcraft provides educational habit and lifestyle coaching for adults 18+. " +
  "It is not medical, nutritional, psychological, or financial advice and makes no " +
  "guarantee of specific results. Supplement statements have not been evaluated by the FDA " +
  "and are not intended to diagnose, treat, cure, or prevent any disease. Some store links " +
  "are affiliate links; Habitcraft may earn a commission at no extra cost to you. Consult a " +
  "physician before starting any exercise program or supplement.";

/** Prices in cents — single source of truth, matches the brief exactly. */
export const PRICES = {
  session: 9700, // $97 Body Plan Session
  programFull: 99700, // $997 pay in full
  programSplit: 34900, // $349 × 3
  programCredited: 90000, // $900 after the $97 credit
  freeShippingThreshold: 6000, // $60
  shipStandard: 695, // $6.95 (3–5 days)
  shipExpress: 1295, // $12.95 (1–2 days)
  promoCode: "HABIT10",
  promoPercent: 10,
};

/** Whether Stripe is configured (keys present). Used to gate real checkout. */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
/** Whether the AI assistant has credentials. If false, the chat uses a safe
 *  scripted fallback so the widget still works out of the box. */
export const aiEnabled = Boolean(process.env.AI_API_KEY);
/** Whether email sending is configured. */
export const emailEnabled = Boolean(process.env.RESEND_API_KEY);
/** Whether a database is configured. */
export const dbEnabled = Boolean(process.env.DATABASE_URL);
