import type { Metadata } from "next";
import Link from "next/link";
import { CoachScene } from "@/components/CoachScene";
import { Check, Avatar } from "@/components/Avatar";
import { AskCoachButton } from "@/components/chat/AskCoachButton";

export const metadata: Metadata = {
  title: "About",
  description: "Who Habitcraft is for, what Coach B is (and isn't), and the real coaches behind every session.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pg-hero">
        <div className="wrap">
          <span className="tag" style={{ color: "var(--lime)" }}>About Habitcraft</span>
          <h1 style={{ marginTop: 14 }}>Coaching for the week you actually have</h1>
          <p>Habitcraft is 1-on-1 online fitness and habit coaching for US adults 18+. Educational coaching — not medical, nutritional, psychological, or financial advice, and no guarantee of results.</p>
        </div>
      </section>

      {/* Coach B explainer */}
      <section className="sec meet">
        <div className="wrap meet-g">
          <div className="meet-img"><CoachScene pose="meet" /></div>
          <div>
            <span className="tag teal-t">Who is Coach B?</span>
            <h2>Coach B is our AI guide — and he&apos;s honest about it.</h2>
            <p className="lead">
              Coach B is an AI-generated character: the face of our chat assistant and the figure you see in our
              fitness imagery. He is <b>not a real person and not a real coach.</b> He helps you find a workout,
              understand pricing, book a session or sort out an order — and hands you to a real person whenever you ask.
            </p>
            <ul className="meet-l">
              <li><Check />An AI assistant, available 24/7</li>
              <li><Check />Never gives medical advice or promises results</li>
              <li><Check />Always connects you to the real team when you need a human</li>
            </ul>
            <div className="meet-cta">
              <AskCoachButton className="btn btn-hot">Chat with Coach B</AskCoachButton>
              <small>AI assistant, not a human coach.</small>
            </div>
          </div>
        </div>
      </section>

      {/* Real coaches placeholder */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-h">
            <span className="tag teal-t">The real team</span>
            <h2>Your sessions are with real coaches</h2>
            <p>Every $97 session and every week of the program is delivered by a real, qualified Habitcraft coach. Add their photos and bios below before launch.</p>
          </div>
          <div className="steps">
            {[1, 2, 3].map((i) => (
              <div className="step" key={i}>
                <div className="im" style={{ background: "var(--mint)", display: "grid", placeItems: "center" }}>
                  <div style={{ display: "grid", placeItems: "center", gap: 10, color: "var(--muted)" }}>
                    <Avatar size={72} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Coach photo placeholder</span>
                  </div>
                </div>
                <h3 style={{ marginTop: 16 }}>[Coach name]</h3>
                <p>[Short bio — certifications, approach, who they love coaching. Replace before launch.]</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Link className="btn btn-hot" href="/book">Book your session — $97</Link>
          </div>
        </div>
      </section>
    </>
  );
}
