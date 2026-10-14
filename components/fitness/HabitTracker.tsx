"use client";

import { useState } from "react";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

/** Habit tracker demo — progress ring + 7 tappable day boxes (3/7 pre-filled). */
export function HabitTracker() {
  const [track, setTrack] = useState<number[]>([1, 1, 0, 1, 0, 0, 0]);
  const n = track.filter(Boolean).length;
  const pct = n / 7;
  const C = 2 * Math.PI * 62;

  return (
    <div className="track-card">
      <div style={{ display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" }}>
        <div className="ring">
          <svg width="150" height="150">
            <circle cx="75" cy="75" r="62" fill="none" stroke="#e3efeb" strokeWidth="14" />
            <circle cx="75" cy="75" r="62" fill="none" stroke="url(#rg)" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset .5s" }} />
            <defs>
              <linearGradient id="rg"><stop offset="0" stopColor="#ff6a2b" /><stop offset="1" stopColor="#ffb627" /></linearGradient>
            </defs>
          </svg>
          <div className="c"><div><b>{n}/7</b><small>days moved</small></div></div>
        </div>
        <div>
          <h3 style={{ fontSize: 24 }}>This week</h3>
          <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 4 }}>
            {n >= 4 ? "Strong week — nice consistency! 💪" : n >= 2 ? "Good momentum. Keep it going." : "Every day you move counts."}
          </p>
        </div>
      </div>
      <div className="hb-row">
        {track.map((v, i) => (
          <div key={i} className={`hb${v ? " done" : ""}`} onClick={() => setTrack((t) => t.map((x, j) => (j === i ? (x ? 0 : 1) : x)))}>
            {v ? "✓" : DAY_LETTERS[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
