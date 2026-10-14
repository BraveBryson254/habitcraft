import { Resend } from "resend";
import { emailEnabled, SITE } from "./config";

const resend = emailEnabled ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Habitcraft <hello@habitcraft.com>";
const OWNER = process.env.EMAIL_TO_OWNER || SITE.supportEmail;

/** A small, brand-consistent HTML wrapper for transactional email. */
function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4fbf8;font-family:Arial,Helvetica,sans-serif;color:#0a2230">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#ff6a2b,#ffb627);color:#fff;text-align:center;line-height:36px;font-weight:bold">✓</div>
      <strong style="font-size:20px">Habitcraft</strong>
    </div>
    <div style="background:#fff;border-radius:18px;padding:28px;box-shadow:0 10px 30px -18px rgba(5,59,58,.4)">
      <h1 style="font-size:22px;margin:0 0 14px">${title}</h1>
      ${body}
    </div>
    <p style="font-size:12px;color:#7d949c;margin-top:22px;line-height:1.6">
      Habitcraft provides educational habit and lifestyle coaching for adults 18+. Not medical,
      nutritional, psychological, or financial advice. Reply to this email or write to
      ${SITE.supportEmail} with any questions.
    </p>
  </div></body></html>`;
}

export async function sendBookingConfirmation(args: {
  to: string;
  name: string;
  when: string;
  timezone: string;
}): Promise<void> {
  if (!resend) {
    console.log("[email disabled] booking confirmation ->", args.to);
    return;
  }
  const body = `
    <p>Hi ${args.name},</p>
    <p>Your <strong>$97 Body Plan Session</strong> is booked for:</p>
    <p style="font-size:18px;font-weight:bold;background:#eefcf7;border-radius:12px;padding:14px 18px;margin:16px 0">
      ${args.when} <span style="color:#4b6470;font-weight:normal">(${args.timezone})</span>
    </p>
    <p>A real Habitcraft coach will meet you on a 45-minute video call to build a workout and
    habit plan around your week. We'll send the call link and a short intake form before your session.</p>
    <p style="color:#4b6470;font-size:14px">Your $97 is credited in full toward the 12-week program if you continue.</p>`;
  await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: "Your Habitcraft session is booked",
    html: shell("You're booked! ✓", body),
    replyTo: SITE.supportEmail,
  });
}

export async function sendOrderConfirmation(args: {
  to: string;
  orderNumber: string;
  totalFormatted: string;
}): Promise<void> {
  if (!resend) {
    console.log("[email disabled] order confirmation ->", args.to);
    return;
  }
  const body = `
    <p>Thanks for your order!</p>
    <p>Order <strong>#${args.orderNumber}</strong> is confirmed. Total: <strong>${args.totalFormatted}</strong>.</p>
    <p>Estimated delivery is 3–5 business days (1–2 for Express). You'll get a tracking email once it ships.</p>`;
  await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: `Habitcraft order #${args.orderNumber} confirmed`,
    html: shell("Order confirmed", body),
    replyTo: SITE.supportEmail,
  });
}

export async function sendContactToOwner(args: {
  name: string;
  email: string;
  message: string;
  source?: string;
}): Promise<void> {
  if (!resend) {
    console.log("[email disabled] contact/lead ->", OWNER, args);
    return;
  }
  const body = `
    <p><strong>From:</strong> ${args.name} &lt;${args.email}&gt;</p>
    <p><strong>Source:</strong> ${args.source || "contact form"}</p>
    <hr style="border:none;border-top:1px solid #e3efeb;margin:16px 0">
    <p style="white-space:pre-wrap">${args.message.replace(/</g, "&lt;")}</p>`;
  await resend.emails.send({
    from: FROM,
    to: OWNER,
    subject: `New message from ${args.name}`,
    html: shell("New message", body),
    replyTo: args.email,
  });
}
