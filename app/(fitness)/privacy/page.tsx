import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <h2>What we collect</h2>
      <ul>
        <li><strong>Booking details</strong>: name, email, time zone, goal, and 18+ confirmation.</li>
        <li><strong>Order details</strong>: name, email, shipping address, and items purchased.</li>
        <li><strong>Payment</strong>: handled by Stripe; we never see or store full card numbers.</li>
        <li><strong>Chat</strong>: messages you send to Coach B may be stored to improve support and for the data-deletion flow described on our AI Assistant page.</li>
      </ul>

      <h2>How we use it</h2>
      <p>To deliver your session or order, send confirmations, respond to support requests, and run the site. We do not sell your personal information.</p>

      <h2>Who we share with</h2>
      <p>Service providers who help us operate: Stripe (payments), Resend (email), our database host, and our AI provider for the chat assistant. Each processes data only to provide their service.</p>

      <h2>Your choices</h2>
      <p>You can request access to, correction of, or deletion of your data by emailing {SITE.supportEmail}. See the AI Assistant page for how to delete your chat history.</p>

      <h2>Cookies</h2>
      <p>We use essential cookies and local storage (for example, your cart). We do not use advertising trackers by default.</p>

      <h2>Contact</h2>
      <p>{SITE.companyName} — {SITE.supportEmail}.</p>
    </LegalPage>
  );
}
