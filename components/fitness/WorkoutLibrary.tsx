"use client";

import { useState } from "react";
import { WORKOUTS } from "@/lib/workouts";
import { CoachScene } from "@/components/CoachScene";
import { useWorkoutModal } from "./WorkoutModalContext";
import { cx } from "@/lib/utils";

const TYPES = ["All", "Strength", "Cardio", "Mobility", "Home"];
const LEVELS = ["All", "Beginner", "Intermediate"];

/** The filterable workout grid (brief §4 /workouts). */
export function WorkoutLibrary() {
  const openModal = useWorkoutModal();
  const [type, setType] = useState("All");
  const [level, setLevel] = useState("All");
  const [max, setMax] = useState(45);

  const list = WORKOUTS.filter(
    (w) =>
      (type === "All" || w.type === type) &&
      (level === "All" || w.level === level) &&
      w.min <= max
  );

  return (
    <>
      <div className="filters">
        {TYPES.map((t) => (
          <button key={t} className={cx("fchipb", type === t && "on")} onClick={() => setType(t)}>{t}</button>
        ))}
        <span style={{ width: 2, height: 26, background: "var(--line)" }} />
        {LEVELS.map((l) => (
          <button key={l} className={cx("fchipb", level === l && "on")} onClick={() => setLevel(l)}>{l}</button>
        ))}
        <div className="slider">
          Up to <b>{max}</b> min
          <input type="range" min={10} max={45} step={5} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Maximum minutes" />
        </div>
      </div>

      <div className="wgrid">
        {list.length ? (
          list.map((w) => (
            <button key={w.id} className="wcard" onClick={() => openModal(w.id)}>
              <div className="im">
                <CoachScene pose={w.pose} />
                <span className="play"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M7 4l13 8-13 8z" /></svg></span>
              </div>
              <div className="bd">
                <div className="meta">
                  <span className="mt">{w.type}</span>
                  <span className="mt o">{w.min} min</span>
                  <span className="mt">{w.level}</span>
                </div>
                <h4>{w.name}</h4>
                <p>{w.desc}</p>
              </div>
            </button>
          ))
        ) : (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--muted)", padding: 50 }}>
            No workouts match — try a longer time limit.
          </p>
        )}
      </div>
    </>
  );
}
