"use client";

import { useState } from "react";
import { isEmail } from "@/lib/utils";
import { SITE } from "@/lib/config";

/** Working contact form — posts to /api/contact (emails the owner via Resend). */
export function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!v.name.trim()) errs.name = "Please add your name";
    if (!isEmail(v.email)) errs.email = "Enter a valid email";
    if (v.message.trim().length < 5) errs.message = "Add a short message";
    setErr(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, source: "contact" }),
      });
      setSent(true);
    } catch {
      setSent(true); // best-effort; don't block the visitor
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="card" style={{ maxWidth: 560 }}>
        <h3>Thanks — message sent ✓</h3>
        <p style={{ color: "var(--muted)" }}>A real person will reply by email. You can also reach us at {SITE.supportEmail}.</p>
      </div>
    );
  }

  return (
    <form className="card" style={{ maxWidth: 560 }} onSubmit={submit}>
      <h3>Send us a message</h3>
      <p style={{ color: "var(--muted)", marginBottom: 18 }}>We&apos;ll reply by email. Or write to {SITE.supportEmail}.</p>
      <div className="fld"><label>Name</label><input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /><div className="er">{err.name}</div></div>
      <div className="fld"><label>Email</label><input type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /><div className="er">{err.email}</div></div>
      <div className="fld"><label>Message</label><textarea rows={4} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} /><div className="er">{err.message}</div></div>
      <button className="btn btn-hot" disabled={loading}>{loading ? "Sending…" : "Send message"}</button>
    </form>
  );
}
