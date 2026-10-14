import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendBookingConfirmation, sendOrderConfirmation } from "@/lib/email";
import { money } from "@/lib/utils";

export const runtime = "nodejs";
// Stripe needs the raw body to verify the signature.
export const dynamic = "force-dynamic";

/**
 * Stripe webhook. Verifies the signature, then on checkout.session.completed:
 * - marks the Booking/Order PAID
 * - sends the confirmation email
 * Set STRIPE_WEBHOOK_SECRET and point a webhook at /api/webhooks/stripe.
 * Local dev: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
 */
export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ received: true, note: "stripe disabled" });

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    if (!sig || !secret) throw new Error("missing signature/secret");
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const kind = session.metadata?.kind;

    try {
      if (kind === "booking") {
        const bookingId = session.metadata?.bookingId;
        if (bookingId && prisma) {
          const b = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "PAID", paidAt: new Date() },
          });
          await sendBookingConfirmation({
            to: b.email,
            name: b.name,
            when: b.slotDate.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }),
            timezone: b.timezone,
          });
        } else if (session.customer_email) {
          await sendBookingConfirmation({
            to: session.customer_email,
            name: "there",
            when: session.metadata?.slot ?? "your scheduled time",
            timezone: session.metadata?.timezone ?? "",
          });
        }
      } else if (kind === "order") {
        const orderId = session.metadata?.orderId;
        if (orderId && prisma) {
          const o = await prisma.order.update({
            where: { id: orderId },
            data: { status: "PAID", paidAt: new Date() },
          });
          await sendOrderConfirmation({
            to: o.email,
            orderNumber: `HC-${o.id.slice(-5).toUpperCase()}`,
            totalFormatted: money(o.totalCents),
          });
        } else if (session.customer_email) {
          await sendOrderConfirmation({
            to: session.customer_email,
            orderNumber: `HC-${session.id.slice(-5).toUpperCase()}`,
            totalFormatted: money(session.amount_total ?? 0),
          });
        }
      }
    } catch (e) {
      console.error("webhook handling error", e);
      // Return 200 so Stripe doesn't retry forever on a non-critical failure.
    }
  }

  return NextResponse.json({ received: true });
}
