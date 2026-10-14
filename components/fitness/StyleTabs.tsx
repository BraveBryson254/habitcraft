"use client";

import { useState } from "react";
import { STYLES } from "@/lib/workouts";
import { CoachScene } from "@/components/CoachScene";
import { Check } from "@/components/Avatar";
import { cx } from "@/lib/utils";

/** "Pick your style" — interactive tab list that swaps a Coach B scene. */
export function StyleTabs() {
  const [active, setActive] = useState(STYLES[0].id);
  const style = STYLES.find((s) => s.id === active)!;

  return (
    <div className="styles">
      <div className="st-list">
        {STYLES.map((s) => (
          <button key={s.id} className={cx("st-btn", s.id === active && "on")} onClick={() => setActive(s.id)}>
            <span className="ic">{s.icon}</span>
            <div><b>{s.name}</b><span>{s.sub}</span></div>
          </button>
        ))}
      </div>
      <div className="st-view">
        <div className="img"><CoachScene pose={style.pose} /></div>
        <div className="txt">
          <h3>{style.head}</h3>
          <p style={{ color: "var(--muted)" }}>{style.text}</p>
          <ul>
            {style.points.map((p, i) => (
              <li key={i}><Check />{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
