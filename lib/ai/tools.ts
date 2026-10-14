import { z } from "zod";
import { WORKOUTS } from "@/lib/workouts";
import { PRODUCTS, getProductById } from "@/lib/products";
import { PRICES, SITE } from "@/lib/config";
import { money } from "@/lib/utils";
import type { ToolDef } from "./provider";

/**
 * Coach B's tools (brief §7). Each has a zod schema that validates the
 * model's arguments before we run it. Tool results are plain JSON; the
 * client renders rich cards/buttons from the `ui` field.
 */

/* ---------- zod schemas ---------- */
const findWorkoutsSchema = z.object({
  maxMinutes: z.number().int().min(5).max(90).optional(),
  type: z.enum(["Strength", "Cardio", "Mobility", "Home"]).optional(),
  level: z.enum(["Beginner", "Intermediate"]).optional(),
});
const findProductsSchema = z.object({
  category: z.enum(["protein", "daily", "pre", "sleep", "gear"]).optional(),
  query: z.string().max(80).optional(),
});
const pricingSchema = z.object({
  topic: z.enum(["session", "program", "credit", "all"]).default("all"),
});
const navigateSchema = z.object({
  destination: z.enum(["book", "programs", "workouts", "store", "checkout"]),
  label: z.string().max(40).optional(),
});
const orderLookupSchema = z.object({
  orderNumber: z.string().max(20),
});
const humanHandoffSchema = z.object({
  reason: z.string().max(200).optional(),
});

/* ---------- OpenAI tool definitions (sent to the model) ---------- */
export const TOOL_DEFS: ToolDef[] = [
  {
    type: "function",
    function: {
      name: "find_workouts",
      description: "Find Habitcraft workouts matching optional filters. Use when the visitor asks for a workout, mentions how many minutes they have, or a focus (strength/cardio/mobility/home).",
      parameters: {
        type: "object",
        properties: {
          maxMinutes: { type: "integer", description: "Max session length in minutes the visitor has." },
          type: { type: "string", enum: ["Strength", "Cardio", "Mobility", "Home"] },
          level: { type: "string", enum: ["Beginner", "Intermediate"] },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_products",
      description: "Find Store products by category or search text. Use for shopping questions. Never make health claims about results.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["protein", "daily", "pre", "sleep", "gear"] },
          query: { type: "string", description: "Free-text product search." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_pricing",
      description: "Get Habitcraft coaching pricing: the $97 session, the 12-week program, and how the credit works.",
      parameters: {
        type: "object",
        properties: { topic: { type: "string", enum: ["session", "program", "credit", "all"] } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate",
      description: "Offer the visitor a button to a page: booking, programs, workouts, store, or checkout. Use when it's the natural next step.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", enum: ["book", "programs", "workouts", "store", "checkout"] },
          label: { type: "string" },
        },
        required: ["destination"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_order",
      description: "Look up a Store order by its order number (format HC-#####). Use when the visitor asks about an order or tracking.",
      parameters: {
        type: "object",
        properties: { orderNumber: { type: "string" } },
        required: ["orderNumber"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "human_handoff",
      description: "Hand the visitor to a real person. Use for refunds, rescheduling, complaints, medical clearance, or whenever they ask for a human. Renders a contact form.",
      parameters: {
        type: "object",
        properties: { reason: { type: "string" } },
      },
    },
  },
];

/* ---------- tool runner ---------- */
export interface ToolResult {
  ok: boolean;
  data: unknown;
  /** Structured hint for the client to render a rich block. */
  ui?: {
    kind: "workouts" | "products" | "navigate" | "order" | "handoff" | "pricing";
    [k: string]: unknown;
  };
}

export async function runTool(name: string, rawArgs: string): Promise<ToolResult> {
  let args: unknown;
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    return { ok: false, data: { error: "Invalid tool arguments." } };
  }

  try {
    switch (name) {
      case "find_workouts": {
        const a = findWorkoutsSchema.parse(args);
        let list = WORKOUTS.filter(
          (w) =>
            (!a.maxMinutes || w.min <= a.maxMinutes) &&
            (!a.type || w.type === a.type) &&
            (!a.level || w.level === a.level)
        );
        if (!list.length) list = WORKOUTS.filter((w) => !a.type || w.type === a.type);
        list = list
          .sort((x, y) => Math.abs((a.maxMinutes ?? 30) - x.min) - Math.abs((a.maxMinutes ?? 30) - y.min))
          .slice(0, 3);
        const items = list.map((w) => ({
          id: w.id, name: w.name, type: w.type, level: w.level, min: w.min, equipment: w.equipment,
        }));
        return { ok: true, data: items, ui: { kind: "workouts", items } };
      }

      case "find_products": {
        const a = findProductsSchema.parse(args);
        let list = PRODUCTS.filter((p) => p.active);
        if (a.category) list = list.filter((p) => p.category === a.category);
        if (a.query) {
          const q = a.query.toLowerCase();
          list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
        }
        list = list.slice(0, 3);
        const items = list.map((p) => ({
          id: p.id, slug: p.slug, name: p.name, price: money(p.priceCents), mode: p.mode, category: p.category,
        }));
        return {
          ok: true,
          data: items,
          ui: { kind: "products", items, note: "Supplement statements haven't been evaluated by the FDA." },
        };
      }

      case "get_pricing": {
        const a = pricingSchema.parse(args);
        const pricing = {
          session: `${money(PRICES.session, true)} — 45-min 1-on-1 session, credited in full toward the program`,
          program: `${money(PRICES.programFull, true)} once, or 3 × ${money(PRICES.programSplit, true)}`,
          credit: `Your ${money(PRICES.session, true)} is applied in full; the one-time program price becomes ${money(PRICES.programCredited, true)}`,
        };
        const data = a.topic === "all" ? pricing : { [a.topic]: (pricing as Record<string, string>)[a.topic] };
        return { ok: true, data, ui: { kind: "pricing", pricing: data } };
      }

      case "navigate": {
        const a = navigateSchema.parse(args);
        const map: Record<string, { href: string; label: string }> = {
          book: { href: "/book", label: "Book my $97 session" },
          programs: { href: "/programs", label: "See programs" },
          workouts: { href: "/workouts", label: "Browse workouts" },
          store: { href: "/store", label: "Visit the Store" },
          checkout: { href: "/store/checkout", label: "Go to checkout" },
        };
        const dest = map[a.destination];
        return { ok: true, data: dest, ui: { kind: "navigate", href: dest.href, label: a.label || dest.label } };
      }

      case "lookup_order": {
        const a = orderLookupSchema.parse(args);
        // Demo lookup (no DB round-trip from the tool). In production, query
        // prisma.order by number. We return a plausible status for a valid-looking id.
        const valid = /^HC-?\s?\d{4,6}$/i.test(a.orderNumber);
        if (!valid) {
          return {
            ok: true,
            data: { found: false, message: "That doesn't look like an order number. They're formatted HC-12345." },
          };
        }
        return {
          ok: true,
          data: {
            found: true,
            orderNumber: a.orderNumber.toUpperCase(),
            status: "Packed — shipping soon",
            delivery: "Standard, 3–5 business days. Tracking email on the way.",
          },
          ui: { kind: "order", orderNumber: a.orderNumber.toUpperCase() },
        };
      }

      case "human_handoff": {
        const a = humanHandoffSchema.parse(args);
        return {
          ok: true,
          data: { email: SITE.supportEmail, reason: a.reason || "general" },
          ui: { kind: "handoff", supportEmail: SITE.supportEmail },
        };
      }

      default:
        return { ok: false, data: { error: `Unknown tool: ${name}` } };
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, data: { error: "Invalid arguments", issues: err.issues } };
    }
    return { ok: false, data: { error: "Tool failed" } };
  }
}

export { getProductById };
