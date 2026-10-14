/**
 * The 12 Store products — single source of truth (brief §5).
 * Prices match the mockup exactly. Each product is data-driven; nothing is
 * hard-coded in the pages. Add Stripe price IDs in .env or inline below.
 */

export type ProductCategory = "protein" | "daily" | "pre" | "sleep" | "gear";
export type ProductMode = "buy" | "affiliate";
/** The illustration primitive used by the product art engine. */
export type ProductArt = "tub" | "bottle" | "pouch" | "shaker" | "bands" | "mat" | "rope";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  priceCents: number;
  images: string[]; // optional real photos; empty = use the illustration engine
  art: ProductArt; // illustration primitive
  color: string; // illustration accent
  label: string; // text baked into the illustration label
  options: string[]; // flavours / sizes
  mode: ProductMode;
  affiliateUrl?: string; // path appended to NEXT_PUBLIC_AFFILIATE_BASE
  stripePriceId?: string; // optional; falls back to inline price_data
  badge?: string; // "Coach B pick" | "New" | "Partner"
  facts: Array<[string, string]>; // supplement facts / specs
  active: boolean;
}

export const CATEGORIES: Array<{ id: ProductCategory | "all"; label: string; art: ProductArt }> = [
  { id: "all", label: "All gear & fuel", art: "tub" },
  { id: "protein", label: "Protein", art: "tub" },
  { id: "daily", label: "Daily basics", art: "bottle" },
  { id: "pre", label: "Pre & post", art: "pouch" },
  { id: "sleep", label: "Sleep & recovery", art: "bottle" },
  { id: "gear", label: "Training gear", art: "bands" },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
);

export const CATEGORY_COLOR: Record<string, string> = {
  protein: "#ff6a2b",
  daily: "#14b8a6",
  pre: "#c8f542",
  sleep: "#6d5ce0",
  gear: "#ff6a2b",
  all: "#ffb627",
};

export const PRODUCTS: Product[] = [
  {
    id: "whey-protein",
    slug: "whey-protein",
    name: "Whey Protein",
    category: "protein",
    shortDescription: "Everyday protein powder to help you meet your daily protein goals.",
    longDescription:
      "A clean, everyday whey protein to help you hit your daily protein target. Part of the Habitcraft shelf — chosen for general wellness, not a magic result.",
    priceCents: 4600,
    images: [],
    art: "tub",
    color: "#ff6a2b",
    label: "WHEY",
    options: ["Vanilla", "Chocolate", "Strawberry"],
    mode: "buy",
    badge: "Coach B pick",
    facts: [
      ["Serving", "1 scoop (30 g)"],
      ["Servings", "30"],
      ["Protein", "24 g"],
      ["Calories", "120"],
    ],
    active: true,
  },
  {
    id: "plant-protein",
    slug: "plant-protein",
    name: "Plant Protein",
    category: "protein",
    shortDescription: "A dairy-free protein blend for plant-based routines.",
    longDescription:
      "A smooth, dairy-free protein blend for plant-based routines. Mixes clean and sits well with everyday use.",
    priceCents: 4400,
    images: [],
    art: "tub",
    color: "#14b8a6",
    label: "PLANT",
    options: ["Chocolate", "Vanilla"],
    mode: "buy",
    facts: [
      ["Serving", "1 scoop (32 g)"],
      ["Servings", "28"],
      ["Protein", "22 g"],
      ["Calories", "130"],
    ],
    active: true,
  },
  {
    id: "creatine",
    slug: "creatine-monohydrate",
    name: "Creatine Monohydrate",
    category: "pre",
    shortDescription: "A simple, single-ingredient staple from our partner retailer.",
    longDescription:
      "A single-ingredient creatine monohydrate — one of the most-studied supplements there is. Sold through our partner retailer.",
    priceCents: 2900,
    images: [],
    art: "pouch",
    color: "#c8f542",
    label: "CREATINE",
    options: ["Unflavored"],
    mode: "affiliate",
    affiliateUrl: "/creatine-monohydrate",
    badge: "Partner",
    facts: [
      ["Serving", "5 g"],
      ["Servings", "60"],
      ["Creatine", "5 g"],
      ["Ingredients", "1"],
    ],
    active: true,
  },
  {
    id: "multivitamin",
    slug: "daily-multivitamin",
    name: "Daily Multivitamin",
    category: "daily",
    shortDescription: "A once-daily general wellness multivitamin.",
    longDescription:
      "A once-daily general wellness multivitamin to round out an everyday routine.",
    priceCents: 2400,
    images: [],
    art: "bottle",
    color: "#0d9488",
    label: "DAILY",
    options: ["60 ct", "120 ct"],
    mode: "buy",
    facts: [
      ["Serving", "2 capsules"],
      ["Servings", "30"],
      ["Form", "Capsule"],
      ["Vegan", "Yes"],
    ],
    active: true,
  },
  {
    id: "omega-3",
    slug: "omega-3-fish-oil",
    name: "Omega-3 Fish Oil",
    category: "daily",
    shortDescription: "Fish oil softgels for daily wellness support.",
    longDescription: "Fish oil softgels for daily wellness support, easy to take with a meal.",
    priceCents: 2800,
    images: [],
    art: "bottle",
    color: "#ffb627",
    label: "OMEGA-3",
    options: ["60 ct", "120 ct"],
    mode: "buy",
    facts: [
      ["Serving", "2 softgels"],
      ["Servings", "30"],
      ["EPA + DHA", "1000 mg"],
      ["Form", "Softgel"],
    ],
    active: true,
  },
  {
    id: "pre-workout",
    slug: "pre-workout-energy",
    name: "Pre-Workout Energy",
    category: "pre",
    shortDescription: "A flavored pre-workout drink mix from our partner.",
    longDescription: "A flavored pre-workout drink mix for a lift before a session. Sold via our partner.",
    priceCents: 3400,
    images: [],
    art: "tub",
    color: "#8b7cf0",
    label: "FUEL",
    options: ["Blue Raspberry", "Citrus"],
    mode: "affiliate",
    affiliateUrl: "/pre-workout-energy",
    badge: "Partner",
    facts: [
      ["Serving", "1 scoop"],
      ["Servings", "30"],
      ["Caffeine", "150 mg"],
      ["Sugar", "0 g"],
    ],
    active: true,
  },
  {
    id: "magnesium",
    slug: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    category: "sleep",
    shortDescription: "An evening-routine mineral supplement.",
    longDescription: "A gentle, well-absorbed magnesium glycinate for an evening routine.",
    priceCents: 2200,
    images: [],
    art: "bottle",
    color: "#6d5ce0",
    label: "MAG",
    options: ["90 ct"],
    mode: "buy",
    facts: [
      ["Serving", "2 capsules"],
      ["Servings", "45"],
      ["Magnesium", "200 mg"],
      ["Form", "Capsule"],
    ],
    active: true,
  },
  {
    id: "sleep-blend",
    slug: "herbal-sleep-blend",
    name: "Herbal Sleep Blend",
    category: "sleep",
    shortDescription: "A caffeine-free evening blend from our partner.",
    longDescription: "A caffeine-free herbal blend for a calmer wind-down. Sold via our partner.",
    priceCents: 2600,
    images: [],
    art: "bottle",
    color: "#4a4fb0",
    label: "REST",
    options: ["60 ct"],
    mode: "affiliate",
    affiliateUrl: "/herbal-sleep-blend",
    badge: "Partner",
    facts: [
      ["Serving", "2 capsules"],
      ["Servings", "30"],
      ["Form", "Capsule"],
      ["Caffeine", "0 mg"],
    ],
    active: true,
  },
  {
    id: "bands",
    slug: "resistance-band-set",
    name: "Resistance Band Set",
    category: "gear",
    shortDescription: "Four loop bands for strength, warm-ups and mobility.",
    longDescription:
      "Four loop bands, light to heavy, for strength work, warm-ups and mobility — at home or travelling.",
    priceCents: 2500,
    images: [],
    art: "bands",
    color: "#ff6a2b",
    label: "",
    options: ["Light", "Medium", "Heavy"],
    mode: "buy",
    badge: "New",
    facts: [
      ["Pieces", "4 bands"],
      ["Material", "Natural latex"],
      ["Includes", "Carry bag"],
      ["Use", "Home / travel"],
    ],
    active: true,
  },
  {
    id: "yoga-mat",
    slug: "non-slip-yoga-mat",
    name: "Non-Slip Yoga Mat",
    category: "gear",
    shortDescription: "A 6 mm cushioned mat for floor work and flows.",
    longDescription: "A 6 mm cushioned, non-slip mat for floor work, flows and mobility days.",
    priceCents: 3800,
    images: [],
    art: "mat",
    color: "#14b8a6",
    label: "",
    options: ["Teal", "Orange", "Purple"],
    mode: "buy",
    facts: [
      ["Thickness", "6 mm"],
      ["Length", "72 in"],
      ["Material", "TPE"],
      ["Includes", "Strap"],
    ],
    active: true,
  },
  {
    id: "shaker",
    slug: "shaker-bottle",
    name: "Shaker Bottle",
    category: "gear",
    shortDescription: "Leak-proof shaker with a mixing ball.",
    longDescription: "A leak-proof shaker with a mixing ball for smooth, lump-free scoops.",
    priceCents: 1400,
    images: [],
    art: "shaker",
    color: "#c8f542",
    label: "",
    options: ["20 oz", "28 oz"],
    mode: "buy",
    facts: [
      ["Capacity", "20 / 28 oz"],
      ["Material", "BPA-free"],
      ["Dishwasher", "Top rack"],
      ["Lid", "Screw-top"],
    ],
    active: true,
  },
  {
    id: "jump-rope",
    slug: "speed-jump-rope",
    name: "Speed Jump Rope",
    category: "gear",
    shortDescription: "A fast, adjustable rope for cardio finishers.",
    longDescription: "A fast, adjustable speed rope — a simple cardio finisher you can take anywhere.",
    priceCents: 1600,
    images: [],
    art: "rope",
    color: "#ff6a2b",
    label: "",
    options: ["Adjustable"],
    mode: "buy",
    facts: [
      ["Length", "Adjustable"],
      ["Handles", "Non-slip"],
      ["Cable", "Steel coated"],
      ["Use", "Indoor / outdoor"],
    ],
    active: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug && p.active);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id && p.active);
  const other = PRODUCTS.filter((p) => p.category !== product.category && p.active);
  return [...same, ...other].slice(0, limit);
}
