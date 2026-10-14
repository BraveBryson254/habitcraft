import { WORKOUTS } from "@/lib/workouts";
import { PRODUCTS } from "@/lib/products";
import { PRICES, SITE } from "@/lib/config";
import { money } from "@/lib/utils";
import type { ToolResult } from "./tools";

/**
 * Scripted fallback (no AI_API_KEY set). Keeps the widget fully functional out
 * of the box with the same honest guardrails and rich cards — mirrors the
 * mockup's scripted intents. Returns the assistant text plus any UI block.
 */
export interface FallbackReply {
  text: string;
  ui?: ToolResult["ui"];
  quickReplies?: string[];
}

function wk(ids: number[]): ToolResult["ui"] {
  const items = WORKOUTS.filter((w) => ids.includes(w.id)).map((w) => ({
    id: w.id, name: w.name, type: w.type, level: w.level, min: w.min, equipment: w.equipment,
  }));
  return { kind: "workouts", items };
}
function pr(ids: string[]): ToolResult["ui"] {
  const items = PRODUCTS.filter((p) => ids.includes(p.id)).map((p) => ({
    id: p.id, slug: p.slug, name: p.name, price: money(p.priceCents), mode: p.mode, category: p.category,
  }));
  return { kind: "products", items, note: "Supplement statements haven't been evaluated by the FDA." };
}

export function scriptedReply(raw: string, site: "fitness" | "store"): FallbackReply {
  const t = raw.toLowerCase();
  const has = (re: RegExp) => re.test(t);

  if (has(/are you (a )?(bot|ai|real|human|person)|who are you|is this ai/))
    return { text: "I'm Coach B's AI assistant — an AI, not a person. The coaching sessions are with real Habitcraft coaches. I can connect you with the team any time." };

  if (has(/injur|pain|hurt|surgery|pregnan|diabet|medicat|doctor|condition|cure|diagnos/))
    return { text: "I can't give medical advice, and I don't want to guess. Please check with your doctor before starting any exercise program. Once you're cleared, a coach can build a plan around what you're able to do." };

  if (has(/guarantee|lose \d|drop \d|six.?pack|get (ripped|shredded)|promise/))
    return { text: "I can't promise results, and no honest coach would. We build routines you can actually keep and adjust them as your week changes. Want to see how the $97 session works?" };

  if (has(/human|real person|agent|talk to|speak to|contact|complaint|refund|cancel|reschedul/))
    return { text: "Happy to connect you with the Habitcraft team. Leave your details and a real person will reply by email.", ui: { kind: "handoff", supportEmail: SITE.supportEmail } };

  if (has(/order|tracking|where.*(package|parcel)|hc-?\s?\d/)) {
    const m = raw.match(/HC-?\s?(\d{4,6})/i);
    if (m) return { text: `Found order HC-${m[1]}. Status: Packed, shipping soon. Standard delivery is 3–5 business days, and you'll get a tracking email once it ships.`, ui: { kind: "order", orderNumber: `HC-${m[1]}` } };
    return { text: "Happy to check. What's your order number? It looks like HC-12345 and it's in your confirmation email." };
  }

  if (has(/promo|coupon|discount|code|deal|sale/))
    return { text: `Use code ${PRICES.promoCode} at checkout for ${PRICES.promoPercent}% off. Orders over ${money(PRICES.freeShippingThreshold, true)} also ship free.`, ui: { kind: "navigate", href: "/store", label: "Shop the store" } };

  if (has(/ship|deliver|return|how long.*(arrive|take)/))
    return { text: `Delivery: Standard ${money(PRICES.shipStandard)} (3–5 days), Express ${money(PRICES.shipExpress)} (1–2 days), free over ${money(PRICES.freeShippingThreshold, true)}.` };

  if (has(/supplement|protein|creatine|vitamin|omega|magnesium|sleep|pre.?workout|shake|multivit/)) {
    if (has(/help|work|good for|cure|treat|boost|burn|lose|gain|build|heal/))
      return { text: "I can't make health claims about supplements. Each product page lists the facts. Please check with your doctor or a pharmacist before starting anything new. Supplement statements haven't been evaluated by the FDA." };
    const pick = has(/creatine/) ? ["creatine"] : has(/sleep|magnesium/) ? ["magnesium", "sleep-blend"] : has(/vitamin|omega|multi/) ? ["multivitamin", "omega-3"] : has(/pre/) ? ["pre-workout"] : ["whey-protein", "plant-protein"];
    return { text: "Here are a few from our short shelf:", ui: pr(pick) };
  }

  if (has(/12.?week|program|commit/) && !has(/session/))
    return { text: `The 12-Week Program is ${money(PRICES.programFull, true)} once, or 3 × ${money(PRICES.programSplit, true)}. It includes weekly 1-on-1 coaching, plan updates, and accountability. If you've booked the $97 session, it's credited in full — so ${money(PRICES.programCredited, true)}.`, ui: { kind: "navigate", href: "/programs", label: "See programs" } };

  if (has(/credit|deduct|applied toward/))
    return { text: `Yes — if you continue to the 12-week program, your ${money(PRICES.session, true)} is applied in full toward it.`, ui: { kind: "navigate", href: "/programs", label: "Try the calculator" } };

  if (has(/book|schedul|appointment|slot|sign up|get started|join/))
    return { text: "Booking takes about a minute: pick a day and time, add your details, and pay securely. You need to be 18 or over.", ui: { kind: "navigate", href: "/book", label: "Book my $97 session" } };

  if (has(/session|consult|body plan|45|what (happens|do i get)|how does (it|this) work/))
    return { text: `The Body Plan Session is a 45-minute 1-on-1 video call. A real coach maps your week and builds a plan around it. It's ${money(PRICES.session, true)}, credited in full toward the program.`, ui: { kind: "navigate", href: "/book", label: "Book my session" } };

  if (has(/pric|cost|how much|pay|fee|afford|split|\$/))
    return { text: `Session: ${money(PRICES.session, true)} one-time. 12-Week Program: ${money(PRICES.programFull, true)} or 3 × ${money(PRICES.programSplit, true)}. Your $97 is credited if you continue.`, ui: { kind: "navigate", href: "/programs", label: "See programs" } };

  if (has(/\d{1,3}\s*(min|minute)|find me a workout|recommend|suggest|workout for|routine|quick workout|busy|beginner|intermediate/)) {
    const m = t.match(/(\d{1,3})\s*(min|minute)/);
    const max = m ? Math.min(60, +m[1]) : 30;
    const type = has(/strength|lift|muscle/) ? "Strength" : has(/cardio|run|walk/) ? "Cardio" : has(/yoga|mobility|stretch/) ? "Mobility" : has(/home/) ? "Home" : null;
    const list = WORKOUTS.filter((w) => w.min <= max && (!type || w.type === type)).sort((a, b) => Math.abs(max - a.min) - Math.abs(max - b.min)).slice(0, 3);
    return { text: m ? `With about ${max} minutes, try these:` : "Here are a few good starting points:", ui: wk(list.map((w) => w.id)) };
  }

  if (has(/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/))
    return { text: "Hi there! 👋 What can I help you with today?" };

  if (has(/thank|thx|cheers|appreciate/))
    return { text: "You're welcome! Anything else I can help with?" };

  return {
    text: "I can help with workouts, pricing, booking, the store and orders — or I can connect you with the team. What would you like?",
    quickReplies: site === "store" ? ["Shipping & delivery", "Promo code", "Talk to a human"] : ["How does the $97 session work?", "Find me a workout", "Talk to a human"],
  };
}
