/** Small shared helpers. */

/** Format cents as a USD string, e.g. 9700 -> "$97.00" (or "$97" when whole). */
export function money(cents: number, trimWhole = false): string {
  const dollars = cents / 100;
  if (trimWhole && Number.isInteger(dollars)) return `$${dollars.toLocaleString("en-US")}`;
  return `$${dollars.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Join class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Basic email shape check — good enough for form validation. */
export function isEmail(v: string): boolean {
  return /^\S+@\S+\.\S+$/.test(v.trim());
}

/** The next N days as date objects (used in the booking stepper). */
export function nextDays(n: number): Array<{ date: Date; dn: string; d: number; full: string }> {
  const out: Array<{ date: Date; dn: string; d: number; full: string }> = [];
  const now = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      date: d,
      dn: d.toLocaleDateString("en-US", { weekday: "short" }),
      d: d.getDate(),
      full: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
    });
  }
  return out;
}

/** Store path helper — respects path vs subdomain store mode. */
export function storePath(path = ""): string {
  // In "subdomain" mode the store lives on store.domain; links are relative
  // within each site, so for the demo we keep /store paths which work in both.
  return `/store${path}`;
}
