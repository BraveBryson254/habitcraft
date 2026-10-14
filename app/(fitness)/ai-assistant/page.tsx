import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "About the AI Assistant" };

export default function AiAssistantPage() {
  return (
    <LegalPage title="About Coach B, our AI assistant">
      <h2>What Coach B is</h2>
      <p>Coach B is an AI assistant — a computer program, not a real person or coach. It helps you find a workout, understand pricing, book a session, and sort out Store orders. It always tells you it&apos;s an AI, never gives medical advice, never promises results, and connects you with a real person whenever you ask.</p>

      <h2>How the chat works</h2>
      <p>When you type a message, it&apos;s sent to our AI provider to generate a reply. Coach B can call internal tools to look up real Habitcraft workouts, products, pricing, and order status. We apply safety checks so sensitive questions (medical, results guarantees) get a careful, honest response.</p>

      <h2>What is stored</h2>
      <ul>
        <li>Your chat messages may be stored to improve support and resolve issues.</li>
        <li>If you ask to be connected to a human, your name, email, and message are stored and emailed to our team.</li>
        <li>We do not use your chat to make health claims, and we never present AI output as medical advice.</li>
      </ul>

      <h2>How to delete your chat data</h2>
      <p>Email {SITE.supportEmail} with the device/session you used and we&apos;ll delete your stored chat history. You can also clear your browser&apos;s local storage to remove any locally-saved session id.</p>

      <h2>Limits</h2>
      <p>Coach B can be wrong. For anything important — your health, a payment issue, a refund — rely on a real person, not the assistant.</p>
    </LegalPage>
  );
}
