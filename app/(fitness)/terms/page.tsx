import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <h2>1. Who we are</h2>
      <p>Habitcraft is operated by {SITE.companyName} (&quot;Habitcraft&quot;, &quot;we&quot;, &quot;us&quot;). By using this website, booking a session, or buying from the Store, you agree to these Terms.</p>

      <h2>2. Eligibility</h2>
      <p>Our coaching and Store are intended for adults aged <strong>18 and over</strong>. You confirm you are 18+ when you book or check out.</p>

      <h2>3. The service</h2>
      <p>Habitcraft provides <strong>educational fitness and habit coaching</strong>. It is not medical, nutritional, psychological, or financial advice, and we make no guarantee of specific results. The Body Plan Session is a 45-minute 1-on-1 video call that produces a written plan; the 12-week program is ongoing coaching.</p>

      <h2>4. Coach B</h2>
      <p>Coach B is an AI assistant and brand character — not a real person or coach. Its responses are informational and may be imperfect. Real coaching is delivered by human Habitcraft coaches.</p>

      <h2>5. Payments</h2>
      <p>Payments are processed by Stripe. The session is $97; the program is $997 (or 3 × $349). Your $97 session is credited in full toward the program if you continue. Prices are in USD.</p>

      <h2>6. Store orders &amp; affiliate links</h2>
      <p>Some products are sold directly; others are affiliate links to a partner retailer, where the partner&apos;s own terms apply. We may earn a commission at no extra cost to you.</p>

      <h2>7. Your responsibilities</h2>
      <p>Consult a physician before starting any exercise program. Stop if anything hurts. You are responsible for exercising safely and within your abilities.</p>

      <h2>8. Changes &amp; contact</h2>
      <p>We may update these Terms; continued use means acceptance. Questions: {SITE.supportEmail}.</p>
    </LegalPage>
  );
}
