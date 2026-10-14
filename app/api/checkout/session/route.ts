import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getProductById } from "@/lib/products";
import { SITE, PRICES, stripeEnabled } from "@/lib/config";

export const runtime = "nodejs";

const Schema = z.object({
  items: z.array(z.object({ id: z.string(), optionIndex: z.number().int().min(0), qty: z.number().int().min(1).max(99) })).min(1),
  email: z.string().email(),
  name: z.string().max(120).optional(),
  shipping: z.enum(["std", "exp"]).default("std"),
  promo: z.boolean().default(false),
  address: z.object({ line1: z.string().max(200), city: z.string().max(80), state: z.string().max(40), zip: z.string().max(20) }).partial().optional(),
});

/**
 * Create a Store Checkout Session. ALL pricing is recomputed server-side from
 * lib/products.ts — the client's numbers are never trusted. Affiliate products
 * are rejected (they never enter the cart). Returns { checkoutUrl } or demo.
 */
export async function POST(req: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid checkout" }, { status: 400 });
  }

  // Resolve + validate items server-side.
  const resolved = [];
  let subtotal = 0;
  for (const item of body.items) {
    const p = getProductById(item.id);
    if (!p || p.mode !== "buy" || !p.active) {
      return NextResponse.json({ error: `Invalid item: ${item.id}` }, { status: 400 });
    }
    const option = p.options[item.optionIndex] ?? p.options[0];
    subtotal += p.priceCents * item.qty;
    resolved.push({ product: p, option, qty: item.qty });
  }

  const discount = body.promo ? Math.round((subtotal * PRICES.promoPercent) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shippingCents =
    body.shipping === "exp"
      ? PRICES.shipExpress
      : afterDiscount >= PRICES.freeShippingThreshold
      ? 0
      : PRICES.shipStandard;
  const total = afterDiscount + shippingCents;

  // Persist a pending order when a DB is configured.
  let orderId: string | undefined;
  if (prisma) {
    try {
      const order = await prisma.order.create({
        data: {
          email: body.email,
          name: body.name,
          shipName: body.name,
          shipAddress: body.address?.line1,
          shipCity: body.address?.city,
          shipState: body.address?.state,
          shipZip: body.address?.zip,
          subtotalCents: subtotal,
          discountCents: discount,
          shippingCents,
          totalCents: total,
          promoCode: body.promo ? PRICES.promoCode : null,
          shippingTier: body.shipping === "exp" ? "express" : shippingCents === 0 ? "free" : "standard",
          status: "PENDING",
          items: {
            create: resolved.map((r) => ({
              productId: r.product.id,
              productName: r.product.name,
              option: r.option,
              quantity: r.qty,
              priceCents: r.product.priceCents,
            })),
          },
        },
      });
      orderId = order.id;
    } catch (e) {
      console.error("order persist failed", e);
    }
  }

  if (!stripeEnabled || !stripe) {
    const orderNumber = `HC-${(orderId ?? Date.now().toString()).slice(-5).toUpperCase()}`;
    return NextResponse.json({ demo: true, orderNumber, totalCents: total });
  }

  try {
    const line_items = resolved.map((r) => ({
      quantity: r.qty,
      price_data: {
        currency: "usd",
        unit_amount: r.product.priceCents,
        product_data: { name: `${r.product.name}${r.option ? ` · ${r.option}` : ""}` },
      },
    }));
    // Promo as a negative is not allowed; apply via Stripe coupon in prod.
    // For simplicity we add shipping as a line item and note the discount in metadata.
    if (shippingCents > 0) {
      line_items.push({
        quantity: 1,
        price_data: { currency: "usd", unit_amount: shippingCents, product_data: { name: `Shipping (${body.shipping === "exp" ? "Express" : "Standard"})` } },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email,
      line_items,
      // Apply the promo as a Stripe discount if you've created a coupon with
      // this code; otherwise it's recorded in metadata for your records.
      discounts: body.promo && process.env.STRIPE_PROMO_COUPON ? [{ coupon: process.env.STRIPE_PROMO_COUPON }] : undefined,
      metadata: { kind: "order", orderId: orderId ?? "", promo: body.promo ? PRICES.promoCode : "" },
      success_url: `${SITE.url}/order/success?order={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/order/cancel`,
    });

    if (orderId && prisma) {
      await prisma.order.update({ where: { id: orderId }, data: { stripeSession: session.id } }).catch(() => {});
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (e) {
    console.error("stripe order session failed", e);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
