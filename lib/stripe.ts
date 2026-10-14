import Stripe from "stripe";
import { stripeEnabled } from "./config";

/**
 * Stripe server client. Null when STRIPE_SECRET_KEY isn't set — the checkout
 * routes detect this and return a "demo mode" response so the UI still flows.
 */
export const stripe: Stripe | null = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      // No apiVersion pin: the SDK uses the version it was built against,
      // which always matches its own TypeScript types.
      typescript: true,
    })
  : null;
