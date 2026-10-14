import type { Metadata } from "next";
import { Avatar } from "@/components/Avatar";
import { AskCoachButton } from "@/components/chat/AskCoachButton";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about the $97 session, the 12-week program, the credit, equipment, and whether this is medical advice.",
};

const FAQS: Array<[string, string]> = [
  ["What happens in the $97 session?", "A 45-minute 1-on-1 video call where a real coach maps your real schedule and builds a workout and habit plan around it. You leave with a written plan and a simple tracker."],
  ["Is the $97 credited to the program?", "Yes. If you continue to the 12-week program, your $97 is applied in full — so the one-time program price becomes $900."],
  ["Do I need a gym?", "No. Plans work with a gym, dumbbells, bands or just bodyweight at home. Your coach builds around what you have."],
  ["Is this medical advice?", "No. Habitcraft is educational fitness and habit coaching for adults 18+. It isn't medical, nutritional, psychological, or financial advice. Talk to your doctor before starting any exercise program."],
  ["How do payments work?", "Securely through Stripe. The session is $97 one-time. The program is $997 paid once, or 3 × $349."],
  ["Who are the coaches?", "Real, qualified Habitcraft coaches. Coach B — the character in our chat and imagery — is an AI assistant, not a real person or coach."],
  ["Can I reschedule or get a refund?", "Contact the team and we'll help. The exact policy is shown when you book and in your confirmation email, and on our Refund Policy page."],
];

export default function FaqPage() {
  return (
    <>
      <section className="pg-hero">
        <div className="wrap">
          <span className="tag" style={{ color: "var(--lime)" }}>FAQ</span>
          <h1 style={{ marginTop: 14 }}>Questions, answered</h1>
          <p>Still unsure after reading? Ask Coach B — he answers in seconds and hands you to a human any time.</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="faq">
            {FAQS.map(([q, a], i) => (
              <details className="q" key={i} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <div className="askcard">
              <Avatar size={56} />
              <div><b>Still unsure? Ask Coach B.</b><span className="s">Our AI assistant answers in seconds.</span></div>
              <AskCoachButton className="btn btn-hot btn-sm">Start chat</AskCoachButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
