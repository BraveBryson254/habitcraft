import Link from "next/link";
import { CoachScene } from "@/components/CoachScene";
import { Check } from "@/components/Avatar";
import { StyleTabs } from "@/components/fitness/StyleTabs";
import { WeekPlanner } from "@/components/fitness/WeekPlanner";
import { HabitTracker } from "@/components/fitness/HabitTracker";
import { MeetCoachB } from "@/components/fitness/MeetCoachB";
import { AskCoachButton } from "@/components/chat/AskCoachButton";

const MARQUEE = ["Strength", "Cardio", "Mobility", "Home workouts", "Habit tracking", "Recovery", "Walking plans", "Kettlebells"];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-g">
          <div>
            <span className="tag" style={{ color: "var(--lime)" }}><span className="dot" />1-on-1 online fitness coaching</span>
            <h1 style={{ marginTop: 18 }}>Train for the week you <span className="hl">actually have.</span></h1>
            <p className="sub">
              Forget perfect plans. In one 45-minute session, a Habitcraft coach builds a workout and habit
              plan around your real schedule — then helps you stick to it.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-hot" href="/book">Book your session — $97</Link>
              <Link className="btn btn-line" href="/workouts" style={{ color: "#fff" }}>Browse workouts</Link>
            </div>
            <div className="hero-bul">
              <span><Check />100% online</span>
              <span><Check />Credited to the 12-week program</span>
              <span><Check />Adults 18+</span>
            </div>
          </div>
          <div className="collage">
            <div className="cl a"><CoachScene pose="woSquat" /></div>
            <div className="cl b"><CoachScene pose="manRun" /></div>
            <div className="cl c"><CoachScene pose="yoga" /></div>
            <span className="chip fchip c1"><span className="dot" />45-min 1-on-1 session</span>
            <span className="chip fchip c2">🔥 Strength · Cardio · Mobility</span>
            <span className="chip fchip c3">📅 Built around your week</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="tr">
          {[0, 1].map((rep) => (
            <span key={rep}>{MARQUEE.map((x) => <span key={x}>{x}</span>)}</span>
          ))}
        </div>
      </div>

      {/* PICK YOUR STYLE */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-h">
            <span className="tag teal-t">Pick your style</span>
            <h2>Find the training that fits you</h2>
            <p>Tap a style to preview it. Your coach blends them around your week.</p>
          </div>
          <StyleTabs />
        </div>
      </section>

      {/* BUILD YOUR REAL WEEK */}
      <section className="sec plan-sec">
        <div className="wrap">
          <div className="sec-h">
            <span className="tag teal-t">Try it yourself</span>
            <h2>Build your real week</h2>
            <p>Tap any day to change the workout. This is how we plan: around what&apos;s realistic, not ideal.</p>
          </div>
          <WeekPlanner />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-h">
            <span className="tag teal-t">How it works</span>
            <h2>From booking to your first workout</h2>
          </div>
          <div className="steps">
            <div className="step"><div className="n">1</div><div className="im"><CoachScene pose="call" /></div><h3>Book your session</h3><p>Pick a time that works and pay securely. You&apos;ll get a short intake form.</p></div>
            <div className="step"><div className="n">2</div><div className="im"><CoachScene pose="lunge" /></div><h3>Meet your coach</h3><p>We map your real week on a 45-minute video call and build one clear, repeatable plan.</p></div>
            <div className="step"><div className="n">3</div><div className="im"><CoachScene pose="swing" /></div><h3>Start small, track it</h3><p>Leave with a written plan and a simple tracker. Continue into the program when you&apos;re ready.</p></div>
          </div>
        </div>
      </section>

      {/* THE $97 OFFER */}
      <section className="sec offer">
        <div className="wrap offer-g">
          <div>
            <span className="tag" style={{ color: "var(--lime)" }}>The first step</span>
            <h2 style={{ marginTop: 14 }}>The Body Plan Session</h2>
            <div className="price"><b>$97</b><span>one-time · 45 minutes</span></div>
            <ul>
              <li><Check stroke="#fff" />Live 1-on-1 video call with your coach</li>
              <li><Check stroke="#fff" />A written workout &amp; habit plan for your real week</li>
              <li><Check stroke="#fff" />A simple habit tracker to keep you moving</li>
              <li><Check stroke="#fff" />Email follow-up after your call</li>
            </ul>
            <div className="credit">Your <b>$97</b> is credited in full toward the <b>12-week program</b> if you continue.</div>
            <Link className="btn btn-hot" href="/book">Book my session</Link>
          </div>
          <div className="offer-img"><CoachScene pose="video" /></div>
        </div>
      </section>

      {/* MEET COACH B */}
      <MeetCoachB />

      {/* HABIT TRACKER */}
      <section className="sec">
        <div className="wrap track">
          <div>
            <span className="tag teal-t">Stay consistent</span>
            <h2 style={{ fontSize: "clamp(32px,4.4vw,50px)", margin: "14px 0 16px" }}>A tracker that makes showing up feel good</h2>
            <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 22 }}>Tap the days you moved. Your coach reviews your week with you — no judgement, just adjustments.</p>
            <Link className="btn btn-dark" href="/programs">See programs</Link>
          </div>
          <HabitTracker />
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-h"><span className="tag teal-t">Good to know</span><h2>Questions, answered</h2></div>
          <div className="faq">
            <details className="q" open><summary>What happens in the $97 session?</summary><p>A 45-minute 1-on-1 video call where your coach maps your real schedule and builds a workout and habit plan around it. You leave with a written plan and a tracker.</p></details>
            <details className="q"><summary>Is the $97 credited to the program?</summary><p>Yes. If you continue to the 12-week program, your $97 is applied in full.</p></details>
            <details className="q"><summary>Do I need a gym?</summary><p>No. Plans work with a gym, dumbbells, bands or just bodyweight at home.</p></details>
            <details className="q"><summary>Is this medical advice?</summary><p>No. Habitcraft is educational fitness and habit coaching for adults 18+. Talk to your doctor before starting any exercise program.</p></details>
            <div className="askcard">
              <span className="av" />
              <div><b>Still unsure? Ask Coach B.</b><span className="s">Our AI assistant answers in seconds.</span></div>
              <AskCoachButton className="btn btn-hot btn-sm">Start chat</AskCoachButton>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec cta">
        <div className="wrap">
          <h2>Build a plan that fits your real week.</h2>
          <p>One 45-minute session. $97, credited to the program if you continue.</p>
          <Link className="btn btn-dark" href="/book">Book your session</Link>
        </div>
      </section>
    </>
  );
}
