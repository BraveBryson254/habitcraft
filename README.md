# Habitcraft

Two sites under one brand, in a single Next.js codebase:

- **Habitcraft Fitness** — 1-on-1 online coaching, workouts, booking (lives at `/`)
- **Habitcraft Store** — supplements & training gear (lives at `/store`)

Both share **Coach B**, an honest AI assistant that answers questions, suggests workouts and products, gets people to booking/checkout, explains orders, and hands off to a human — and never gives medical advice or promises results.

Built to match `habitcraft-mockup-v3.html` 1:1, with the scripted chat replaced by a real AI model + tools.

---

## What you need (free tiers exist for all of these)

| Service | Why | Where |
| --- | --- | --- |
| **Vercel** | Hosting | vercel.com |
| **Neon** or **Supabase** | PostgreSQL database | neon.tech / supabase.com |
| **Stripe** | Payments (session + store) | stripe.com |
| **Resend** | Confirmation & contact email | resend.com |
| **DeepSeek** (or OpenAI/Groq/Together) | Coach B's AI | platform.deepseek.com |

> **The site runs even before you set these up.** Missing keys degrade gracefully: no Stripe → "demo" checkout that confirms in-app; no AI key → Coach B uses a built-in scripted (but still honest) fallback; no DB → bookings/orders still complete, they just aren't saved; no email → confirmations are logged to the server console.

---

## Decisions I made where the brief left it open

- **Scheduler:** I built a **simple built-in booking stepper** (no Cal.com). It's the least moving parts for a solo founder — pick a day/time, enter details, pay via Stripe. Swap in Cal.com later by replacing `components/fitness/BookingStepper.tsx` with their embed if you want synced calendars.
- **Cart state:** **Zustand**, persisted to `localStorage` (brief's first option).
- **AI client:** a **thin hand-written streaming client** over any OpenAI-compatible Chat Completions API (brief's option B), with a provider adapter (`lib/ai/provider.ts`). **Default: DeepSeek `deepseek-chat`.** Model names/pricing move — confirm the current model in your provider's docs and set `AI_MODEL` if needed.
- **Coach B imagery:** one transparent cut-out (`public/coach-b/coach-b-full.png`) drives every fitness image via the `<CoachScene />` component (crop/mirror/backdrop/props/chips). Pose library is wired for Phase 2 (see §Imagery).
- **Store mode:** defaults to `/store` on the same domain (`NEXT_PUBLIC_STORE_MODE="path"`). Subdomain mode is supported via `middleware.ts` — see §Store subdomain.

---

## Quick start (local)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
#    …fill in values. You can start with just DATABASE_URL blank and skip the
#    rest — the site runs in demo mode. Add keys as you go.

# 3. (Optional) Create the database tables
npm run db:push

# 4. Run
npm run dev
#    → http://localhost:3000  (Fitness)
#    → http://localhost:3000/store  (Store)
```

Node 18.18+ required.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → import the repo.** Framework auto-detects as Next.js.
3. Add every variable from `.env.example` in **Project → Settings → Environment Variables**.
4. Deploy. The build runs `prisma generate && next build` automatically.
5. Point your domain at the Vercel project and set `NEXT_PUBLIC_SITE_URL` to it.

---

## Stripe setup

1. Get your test keys from **dashboard.stripe.com/apikeys** → `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. **Webhook** (so paid orders/bookings are marked paid and emails send):
   - Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → copy the `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
   - Production: **Developers → Webhooks → Add endpoint** → `https://yourdomain.com/api/webhooks/stripe`, event `checkout.session.completed` → copy the signing secret.
3. (Optional) Create Products/Prices in Stripe and put their IDs in `STRIPE_PRICE_*`. If you leave them blank, the code builds the price inline — it just works.
4. (Optional) For the `HABIT10` promo, create a **Coupon** in Stripe and set `STRIPE_PROMO_COUPON` to its id. Without it, the discount is recorded in metadata and reflected in your own order total.
5. Go live: swap test keys for live keys.

---

## How Coach B works

- `POST /api/chat` (SSE streaming). Flow:
  1. **Safety pre-check** (`lib/ai/safety.ts`) catches medical / results-guarantee questions and returns a safe, honest reply before the model is even called.
  2. If `AI_API_KEY` is set → a **tool-calling loop** (`lib/ai/tools.ts`) lets Coach B look up real workouts, products, pricing, and order status (all **zod-validated**), then streams the final answer.
  3. If no key → a scripted fallback (`lib/ai/fallback.ts`) with the same guardrails and rich cards.
- **Persona & rules:** `lib/ai/prompt.ts` — warm, brief, US spelling, always honest about being AI, no medical advice, no results claims, no invented products/testimonials.
- **Switch providers:** set `AI_PROVIDER` to `deepseek` | `openai` | `groq` | `together` (adapter in `lib/ai/provider.ts`), or point `AI_BASE_URL` at any OpenAI-compatible endpoint.

---

## Imagery — Coach B is the face of every fitness image

Everything comes from one cut-out: `public/coach-b/coach-b-full.png` (463×1458). The `<CoachScene />` component (`components/CoachScene.tsx`) builds each image by changing **crop / mirror / backdrop / props / chips** — see `lib/coach.ts` for the preset table.

- **Avatar & favicon:** `public/coach-b/coach-b-avatar.png` drives the round avatar (chat launcher, header, message icon, "Ask Coach B" pill, FAQ card). A 72px `favicon.png` is generated from it.
- **Phase 2 — a real pose library (optional, already wired):** drop transparent PNGs into `public/coach-b/poses/` named exactly:

  ```
  stand.png  squat.png  kettlebell.png  run.png  yoga.png  plank.png
  pushup.png  lunge.png  stretch.png  walk.png  laptop.png  wave.png
  ```

  If a pose file exists, the matching scene uses it automatically; if it's missing, the scene falls back to the base cut-out. **No code changes needed.** Generate these with an image tool using Coach B as the reference — ready-to-paste prompts are in **`docs/coach-b-image-prompts.md`**.
- **Products:** original flat-vector illustrations (`components/ProductArt.tsx`) on plain backgrounds — no people, no stock photos. To use real photos later, fill `Product.images[]` in `lib/products.ts` and render with `next/image`. Use only free-licence sources (Pexels/Unsplash), add alt text, and credit them here.

---

## Store subdomain (optional)

Default is `/store` on your main domain. To run the store at `store.yourdomain.com`:

1. Set `NEXT_PUBLIC_STORE_MODE="subdomain"` and `STORE_HOST="store.yourdomain.com"`.
2. Add the subdomain to your Vercel project's domains.
3. `middleware.ts` rewrites that host's requests to the `/store` pages.

---

## Project map

```
app/
  (fitness)/            # Fitness site — served at /
    page.tsx            # Home (hero, styles, planner, offer, Meet Coach B, tracker, FAQ)
    workouts/ programs/ book/ how-it-works/ about/ contact/ faq/
    terms/ privacy/ refund-policy/ disclaimer/ ai-assistant/   # legal
  (store)/              # Store site — served at /store
    store/ store/[slug]/ store/checkout/ order/success/ order/cancel/ shipping/
  api/
    chat/               # Coach B (SSE streaming + tools)
    booking/            # $97 session → Stripe Checkout
    checkout/session/   # Store order → Stripe Checkout (server-recomputes totals)
    webhooks/stripe/    # marks paid + sends email
    contact/            # contact form + chat human-handoff
components/             # CoachScene, chat widget, headers, cards, forms…
lib/                    # data (products, workouts), cart, config, stripe, db, email, ai/
prisma/                 # schema + seed
```

---

## Legal

All legal pages (`/terms`, `/privacy`, `/refund-policy`, `/disclaimer`, `/ai-assistant`) contain **real starter text marked "review with a professional before launch."** They are templates, not legal advice. The exact disclaimer from the brief appears in both footers and on every Store page.

Prices and claims match the brief exactly. Nothing in this build invents testimonials, ratings, results, or health claims.
