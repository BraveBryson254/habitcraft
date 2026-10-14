import { SITE } from "@/lib/config";

/** A shared layout for legal pages with the "review before launch" banner. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pg-hero" style={{ background: "linear-gradient(135deg,var(--deep),var(--teal))", paddingBottom: 60 }}>
      <div className="wrap" style={{ maxWidth: 820, margin: "0 auto" }}>
        <span className="tag" style={{ color: "var(--lime)" }}>Legal</span>
        <h1 style={{ marginTop: 14, fontSize: "clamp(32px,5vw,52px)", textAlign: "left" }}>{title}</h1>
        <div style={{ background: "#fff", color: "var(--ink)", borderRadius: "var(--r-lg)", padding: "36px 40px", marginTop: 32, textAlign: "left", lineHeight: 1.7 }}>
          <p style={{ background: "#fff6e6", border: "1.5px dashed var(--sun)", borderRadius: 14, padding: "12px 16px", fontSize: 13.5, color: "#7a5a10", marginBottom: 24 }}>
            ⚠️ Starter text — review with a qualified professional before launch. This is a template, not legal advice.
          </p>
          <div className="legal-body">{children}</div>
          <p style={{ marginTop: 28, fontSize: 13, color: "var(--muted)" }}>
            Questions? Contact {SITE.supportEmail}. Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}.
          </p>
        </div>
      </div>
    </section>
  );
}
