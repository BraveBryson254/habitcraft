import type { Metadata } from "next";
import Link from "next/link";
import { CoachScene } from "@/components/CoachScene";

export const metadata: Metadata = {
  title: "How it works",
  description: "From booking your $97 session to your first workout — here's exactly how Habitcraft coaching works.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="pg-hero">
        <div className="wrap">
          <span className="tag" style={{ color: "var(--lime)" }}>How it works</span>
          <h1 style={{ marginTop: 14 }}>Simple, honest, built around you</h1>
          <p>No complicated apps or guilt. One session to build the plan, then real coaching to keep it going.</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="steps">
            <div className="step"><div className="n">1</div><div className="im"><CoachScene pose="call" /></div><h3>Book your session</h3><p>Pick a time and pay securely with Stripe. You&apos;ll get a short intake form so your coach can prepare.</p></div>
            <div className="step"><div className="n">2</div><div className="im"><CoachScene pose="lunge" /></div><h3>Meet your coach</h3><p>A 45-minute 1-on-1 video call with a real Habitcraft coach. Together you map your real week and build one clear plan.</p></div>
            <div className="step"><div className="n">3</div><div className="im"><CoachScene pose="swing" /></div><h3>Start small, track it</h3><p>You leave with a written workout &amp; habit plan and a simple tracker. Continue into the 12-week program whenever you&apos;re ready.</p></div>
          </div>
          <div className="sec-h" style={{ marginTop: 70 }}>
            <h2>Ready when you are</h2>
            <p>Your $97 is credited in full toward the program if you continue.</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Link className="btn btn-hot" href="/book">Book your session — $97</Link>
          </div>
        </div>
      </section>
    </>
  );
}
