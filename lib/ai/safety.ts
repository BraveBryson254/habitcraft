/**
 * Defense-in-depth guardrails (brief §9). The system prompt already instructs
 * Coach B to refuse medical/results questions, but we add a lightweight
 * pre-check so the most sensitive asks get a correct, safe answer even if the
 * model would have slipped. Returns a canned reply to short-circuit the model,
 * or null to let the normal flow run.
 */

const MEDICAL = /\b(injur|injury|pain|hurt|surgery|pregnan|diabet|blood pressure|heart|medicat|asthma|diagnos|dizz|faint|disorder|anorex|bulimi|condition|cure|heal my|treat my|is it safe for my)\b/i;
const RESULTS = /\b(guarantee|lose \d+|drop \d+|\d+ ?(lbs|pounds|kg)|six.?pack|get (ripped|shredded)|promise.*(lose|weight|results)|how fast will i)\b/i;

export interface SafetyHit {
  kind: "medical" | "results";
  reply: string;
}

export function preCheck(userText: string): SafetyHit | null {
  const t = userText.toLowerCase();
  if (MEDICAL.test(t)) {
    return {
      kind: "medical",
      reply:
        "I can't answer that — it's a medical question, and I'm not able to give medical advice. Please check with your doctor first. Once you're cleared, a real Habitcraft coach can build a plan around what you're able to do. Want me to connect you with the team?",
    };
  }
  if (RESULTS.test(t)) {
    return {
      kind: "results",
      reply:
        "I can't promise results, and no honest coach would. What we do is build routines you can actually keep, and adjust them as your week changes. Want to see how the $97 session works?",
    };
  }
  return null;
}
