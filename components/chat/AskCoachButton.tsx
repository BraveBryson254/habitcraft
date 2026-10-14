"use client";

import { openCoachChat } from "./openCoachChat";
import { cx } from "@/lib/utils";

/** A button that opens Coach B, optionally seeding a first question. */
export function AskCoachButton({
  children,
  prompt,
  className,
}: {
  children: React.ReactNode;
  prompt?: string;
  className?: string;
}) {
  return (
    <button type="button" className={cx(className)} onClick={() => openCoachChat(prompt)}>
      {children}
    </button>
  );
}
