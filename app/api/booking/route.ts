import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { SITE, PRICES, stripeEnabled } from "@/lib/config";

export const runtime = "nodejs";

const Schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  timezone: z.string().max(60),
  goal: z.string().max(200).optional(),
  slotDate: z.string().datetime().nullable(),
});

/**
 * Create a booking for the $97 Body Plan Session.
 * - With Stripe: creates a pending Booking row and a Checkout Session, returns
 *   { checkoutUrl } for the client to redirect to.
 * - Without Stripe (demo): returns { demo: true } so the UI confirms in-app.
 */
export async function POST(req: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid booking" }, { status: 400 });
  }

  const slot = body.slotDate ? new Date(body.slotDate) : new Date();

  // Persist a pending booking when a DB is configured.
  let bookingId: string | undefined;
  if (prisma) {
    try {
      const b = await prisma.booking.create({
        data: {
          slotDate: slot,
          timezone: body.timezone,
          name: body.name,
          email: body.email,
          goal: body.goal,
          confirmedAdult: true,
          status: "PENDING",
          amountCents: PRICES.session,
        },
      });
      bookingId = b.id;
    } catch (e) {
      console.error("booking persist failed", e);
    }
  }

  if (!stripeEnabled || !stripe) {
    // Demo mode — confirm in-app.
    return NextResponse.json({ demo: true, bookingId });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email,
      line_items: [
        process.env.STRIPE_PRICE_SESSION
          ? { price: process.env.STRIPE_PRICE_SESSION, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: PRICES.session,
                product_data: {
                  name: "Habitcraft Body Plan Session",
                  description: "45-minute 1-on-1 video call · credited toward the 12-week program",
                },
              },
            },
      ],
      metadata: { kind: "booking", bookingId: bookingId ?? "", timezone: body.timezone, slot: slot.toISOString() },
      success_url: `${SITE.url}/book?booked=1`,
      cancel_url: `${SITE.url}/book?cancelled=1`,
    });

    if (bookingId && prisma) {
      await prisma.booking.update({ where: { id: bookingId }, data: { stripeSession: session.id } }).catch(() => {});
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    console.error("stripe booking session failed", e);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
