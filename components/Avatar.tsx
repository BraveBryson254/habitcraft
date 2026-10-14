import React from "react";

/**
 * Coach B round avatar — cropped from the same cut-out via CSS background
 * position (brief §6.3). Used for the chat launcher, header, message icon,
 * "Ask Coach B" pill and FAQ card.
 */
export function Avatar({
  size = 48,
  square = false,
  className = "",
  bg,
}: {
  size?: number;
  square?: boolean;
  className?: string;
  bg?: string;
}) {
  return (
    <span
      className={`av${square ? " sq" : ""} ${className}`}
      style={{ ["--d" as string]: `${size}px`, ...(bg ? { backgroundColor: bg } : {}) } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}

/** The orange→sun logo mark with the white check. */
export function LogoMark() {
  return (
    <span className="logo">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4 4 10-10" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** A lime check badge for trust points. */
export function Check({ stroke = "#0a2230" }: { stroke?: string }) {
  return (
    <span className="ck">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4 4 10-10" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
