import { CoachScene } from "@/components/CoachScene";
import { Check } from "@/components/Avatar";
import { AskCoachButton } from "@/components/chat/AskCoachButton";

/** "Meet Coach B" section (brief §4). */
export function MeetCoachB() {
  const bullets = [
    "Finds a workout that fits the minutes you actually have",
    "Explains the $97 session, the program and how the credit works",
    "Helps with store picks, shipping, promo codes and orders",
    "Passes you to a real person whenever you ask",
  ];
  return (
    <section className="sec meet">
      <div className="wrap meet-g">
        <div className="meet-img"><CoachScene pose="meet" /></div>
        <div>
          <span className="tag teal-t">Meet Coach B</span>
          <h2>Questions at 11pm? Coach B is already awake.</h2>
          <p className="lead">
            Coach B is Habitcraft&apos;s AI guide. Ask about workouts, pricing, booking or your order and
            get an answer in seconds. When you need a person, he hands you to the team.
          </p>
          <ul className="meet-l">
            {bullets.map((b, i) => (
              <li key={i}><Check />{b}</li>
            ))}
          </ul>
          <div className="meet-cta">
            <AskCoachButton className="btn btn-hot">Chat with Coach B</AskCoachButton>
            <small>AI assistant, not a human coach. No medical advice.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
