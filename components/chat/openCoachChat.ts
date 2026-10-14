/** Fire the window event the CoachChat widget listens for. Optionally seed a
 *  first prompt (used by "Ask Coach B about this product" links). */
export function openCoachChat(prompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("coachb:open", { detail: { prompt } }));
}
