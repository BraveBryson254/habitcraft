import type { Metadata } from "next";
import { ContactForm } from "@/components/fitness/ContactForm";
import { AskCoachButton } from "@/components/chat/AskCoachButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Habitcraft team, or ask Coach B for a fast answer.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pg-hero">
        <div className="wrap">
          <span className="tag" style={{ color: "var(--lime)" }}>Contact</span>
          <h1 style={{ marginTop: 14 }}>We&apos;re here to help</h1>
          <p>Send us a message and a real person will reply by email. For a fast answer, ask Coach B.</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.3fr .7fr", gap: 30, alignItems: "start" }}>
          <ContactForm />
          <div className="askcard" style={{ marginTop: 0, flexDirection: "column", alignItems: "flex-start" }}>
            <b>Prefer to chat?</b>
            <span className="s">Coach B, our AI assistant, answers common questions in seconds.</span>
            <AskCoachButton className="btn btn-hot btn-sm" >Ask Coach B</AskCoachButton>
          </div>
        </div>
      </section>
    </>
  );
}
