import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { DISCLAIMER } from "@/lib/config";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <h2>Educational coaching, not advice</h2>
      <p>{DISCLAIMER}</p>

      <h2>Not medical advice</h2>
      <p>Nothing on this site or in a session is medical, nutritional, psychological, or financial advice. Always consult your physician before starting any exercise program or taking any supplement, especially if you have a health condition, are pregnant, or are taking medication.</p>

      <h2>No guaranteed results</h2>
      <p>Fitness results depend on many factors outside our control. We make no promises about weight loss, strength gains, or any specific outcome.</p>

      <h2>Supplements</h2>
      <p>Statements about supplements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease.</p>

      <h2>Coach B</h2>
      <p>Coach B is an AI assistant, not a real person or coach. Its answers are informational, may contain errors, and should not be relied on as professional advice.</p>
    </LegalPage>
  );
}
