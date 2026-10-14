import Stripe from "stripe";
import { stripeEnabled } from "./config";

/**
 * Stripe server client. Null when STRIPE_SECRET_KEY isn't set — the checkout
 * routes detect this and return a "demo mode" response so the UI still flows.
 */
export const stripe: Stripe | null = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      // Pin the API version your account is on. Update after testing in the
      // Stripe dashboard; see README §Stripe.
      apiVersion: "2024-10-28.acacia",
      typescript: true,
    })
  : null;
