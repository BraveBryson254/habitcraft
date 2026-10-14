"use client";

import { useState } from "react";
import Link from "next/link";
import { nextDays, isEmail } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { Check } from "@/components/Avatar";

const SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:30 PM", "6:30 PM", "7:30 PM", "8:30 PM"];
const TZS = ["US Eastern", "US Central", "US Mountain", "US Pacific"];
const GOALS = ["Getting started", "Staying consistent", "Building strength", "Moving more day-to-day", "Fitting workouts into a busy week"];
const STEPS = ["Pick a time", "Your details", "Pay", "Confirmed"];

interface BookState {
  step: number; day: number | null; slot: string | null;
  name: string; email: string; tz: string; goal: string; age: boolean;
}

/** The 4-step booking stepper (brief §4 /book). Real payment uses Stripe
 *  Checkout via /api/checkout/session; demo mode skips straight to confirm. */
export function BookingStepper() {
  const toast = useToast((s) => s.show);
  const [b, setB] = useState<BookState>({ step: 1, day: null, slot: null, name: "", email: "", tz: TZS[0], goal: GOALS[0], age: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const days = nextDays(7);
  const sel = days.find((d) => d.k === b.day);
  const set = (patch: Partial<BookState>) => setB((prev) => ({ ...prev, ...patch }));

  function validateDetails(): boolean {
    const e: Record<string, string> = {};
    if (!b.name.trim()) e.name = "Please enter your name";
    if (!isEmail(b.email)) e.email = "Enter a valid email";
    if (!b.age) e.age = "You must be 18+ to book";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function pay() {
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: b.name, email: b.email, timezone: b.tz, goal: b.goal,
          slotDate: slotToISO(sel?.date, b.slot),
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        // Real Stripe Checkout — redirect to the hosted page.
        window.location.href = data.checkoutUrl;
        return;
      }
      // Demo mode (no Stripe keys): confirm in-app.
      toast("Demo payment complete");
      set({ step: 4 });
    } catch {
      toast("Something went wrong — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bk">
      <div className="wrap">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`sp ${b.step === i + 1 ? "on" : b.step > i + 1 ? "done" : ""}`}>
              <i>{b.step > i + 1 ? "✓" : i + 1}</i>{s}
            </div>
          ))}
        </div>

        <div className="bk-g" style={b.step === 4 ? { gridTemplateColumns: "1fr" } : undefined}>
          {b.step === 1 && (
            <div className="card">
              <h3>Choose a day &amp; time</h3>
              <p style={{ color: "var(--muted)" }}>45-minute video call · times shown in {b.tz}</p>
              <div className="days">
                {days.map((d) => (
                  <div key={d.k} className={`dp${b.day === d.k ? " on" : ""}`} onClick={() => set({ day: d.k, slot: null })}>
                    <span>{d.dn}</span><b>{d.d}</b>
                  </div>
                ))}
              </div>
              <div className="slots">
                {SLOTS.map((t, i) => {
                  const off = b.day != null && (i * 7 + b.day * 3) % 5 === 0;
                  return (
                    <div key={t} className={`sl${b.slot === t ? " on" : ""}${off ? " off" : ""}`} onClick={() => !off && set({ slot: t })}>{t}</div>
                  );
                })}
              </div>
              <button className="btn btn-hot" style={{ marginTop: 26, opacity: b.day && b.slot ? 1 : 0.4 }} disabled={!b.day || !b.slot} onClick={() => set({ step: 2 })}>
                Continue
              </button>
            </div>
          )}

          {b.step === 2 && (
            <div className="card">
              <h3>Tell us about you</h3>
              <p style={{ color: "var(--muted)", marginBottom: 20 }}>So your coach can prepare.</p>
              <div className="fld"><label>Full name</label><input value={b.name} onChange={(e) => set({ name: e.target.value })} placeholder="Alex Johnson" /><div className="er">{errors.name}</div></div>
              <div className="fld"><label>Email</label><input type="email" value={b.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@email.com" /><div className="er">{errors.email}</div></div>
              <div className="fld"><label>Time zone</label><select value={b.tz} onChange={(e) => set({ tz: e.target.value })}>{TZS.map((z) => <option key={z}>{z}</option>)}</select></div>
              <div className="fld"><label>What would you like help with?</label><select value={b.goal} onChange={(e) => set({ goal: e.target.value })}>{GOALS.map((z) => <option key={z}>{z}</option>)}</select></div>
              <label style={{ display: "flex", gap: 11, alignItems: "center", fontWeight: 600, fontSize: 14.5, margin: "8px 0 4px" }}>
                <input type="checkbox" checked={b.age} onChange={(e) => set({ age: e.target.checked })} style={{ width: 20, height: 20, accentColor: "var(--teal)" }} />
                I confirm I&apos;m 18 or older
              </label>
              <div className="er" style={{ color: "#d33", fontSize: 12.5, fontWeight: 600 }}>{errors.age}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
                <button className="btn btn-dark" onClick={() => set({ step: 1 })}>Back</button>
                <button className="btn btn-hot" onClick={() => validateDetails() && set({ step: 3 })}>Continue to payment</button>
              </div>
            </div>
          )}

          {b.step === 3 && (
            <div className="card">
              <h3>Secure payment</h3>
              <p style={{ color: "var(--muted)", marginBottom: 20 }}>You&apos;ll be taken to Stripe&apos;s secure checkout to pay $97.</p>
              <div className="pay-mock">🔒 Stripe Checkout (hosted)<br /><small>Card · Apple Pay · Google Pay</small></div>
              <label style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 13.5, margin: "20px 0", color: "var(--muted)" }}>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--teal)" }} />
                I agree to the Terms, Refund Policy and the educational-coaching disclaimer.
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-dark" onClick={() => set({ step: 2 })}>Back</button>
                <button className="btn btn-hot" onClick={pay} disabled={loading}>{loading ? "Starting…" : "Pay $97"}</button>
              </div>
            </div>
          )}

          {b.step === 4 && (
            <div className="done-card" style={{ gridColumn: "1/-1" }}>
              <div className="big"><Check /></div>
              <h2 style={{ fontSize: 40 }}>You&apos;re booked!</h2>
              <p style={{ color: "var(--muted)", margin: "14px 0 24px", fontSize: 17 }}>
                {sel ? sel.full : ""} at <b>{b.slot}</b> ({b.tz}).<br />
                A confirmation and your intake form are on the way to <b>{b.email || "your email"}</b>.
              </p>
              <Link className="btn btn-dark" href="/">Back to home</Link>
            </div>
          )}

          {b.step < 4 && (
            <div className="sum">
              <h4>Your session</h4>
              <div className="row"><span>Body Plan Session</span><span>$97.00</span></div>
              <div className="row"><span>Length</span><span>45 min · 1-on-1</span></div>
              <div className="row"><span>When</span><span>{sel && b.slot ? `${sel.dn} ${sel.d}, ${b.slot}` : "—"}</span></div>
              <div className="row"><span>Credit to program</span><span style={{ color: "var(--lime)" }}>Yes</span></div>
              <div className="tot"><span>Total</span><b>$97</b></div>
              <p style={{ fontSize: 12.5, color: "#8fb0b9", marginTop: 14 }}>Educational coaching for adults 18+. Not medical advice.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function slotToISO(date?: Date, slot?: string | null): string | null {
  if (!date || !slot) return null;
  const d = new Date(date);
  const m = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (m) {
    let h = +m[1] % 12;
    if (/PM/i.test(m[3])) h += 12;
    d.setHours(h, +m[2], 0, 0);
  }
  return d.toISOString();
}
