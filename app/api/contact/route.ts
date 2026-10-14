import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendContactToOwner } from "@/lib/email";

export const runtime = "nodejs";

const Schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
  source: z.enum(["contact", "chat"]).default("contact"),
});

/** Contact form + chat human-handoff. Stores a Lead and emails the owner. */
export async function POST(req: NextRequest) {
  let body: z.infer<typeof Schema>;
  try {
    body = Schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  // Persist the lead when a DB is configured.
  if (prisma) {
    try {
      await prisma.lead.create({ data: { name: body.name, email: body.email, message: body.message, source: body.source } });
    } catch (e) {
      console.error("lead persist failed", e);
    }
  }

  // Email the owner (no-op log if Resend isn't configured).
  try {
    await sendContactToOwner(body);
  } catch (e) {
    console.error("contact email failed", e);
  }

  return NextResponse.json({ ok: true });
}
