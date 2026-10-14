import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy">
      <h2>Coaching sessions</h2>
      <p>If you need to reschedule your $97 Body Plan Session, contact us at least [X hours] before your slot and we&apos;ll move it at no charge. [Describe your refund window — e.g. full refund if cancelled 24+ hours before the call.]</p>

      <h2>12-week program</h2>
      <p>[Describe your program refund terms — e.g. a satisfaction window, or pro-rated refunds. Review with a professional.]</p>

      <h2>Store products</h2>
      <ul>
        <li><strong>Unopened items</strong>: returnable within 30 days for a refund, minus return shipping.</li>
        <li><strong>Opened supplements</strong>: for safety and hygiene, [state whether these are returnable].</li>
        <li><strong>Affiliate products</strong>: returns are handled by the partner retailer under their policy.</li>
      </ul>

      <h2>How to request</h2>
      <p>Email {SITE.supportEmail} with your order number (format HC-#####) or booking details and we&apos;ll help.</p>
    </LegalPage>
  );
}
