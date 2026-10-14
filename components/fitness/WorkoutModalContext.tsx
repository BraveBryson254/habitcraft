"use client";

import { createContext, useCallback, useContext, useState } from "react";
import * as React from "react";
import { getWorkout } from "@/lib/workouts";
import { CoachScene } from "@/components/CoachScene";
import Link from "next/link";

/**
 * A single shared workout modal, so both the /workouts cards and Coach B's
 * chat "View" button can open it from anywhere in the app.
 */
const Ctx = createContext<(id: number) => void>(() => {});

export function useWorkoutModal() {
  return useContext(Ctx);
}

export function WorkoutModalProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = React.useCallback((id: number) => setOpenId(id), []);
  const close = React.useCallback(() => setOpenId(null), []);

  const workout = openId != null ? getWorkout(openId) : undefined;

  return (
    <Ctx.Provider value={open}>
      {children}
      <div className={`mod-ov${openId != null ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && close()}>
        {workout && (
          <div className="modal">
            <div className="mi"><CoachScene pose={workout.pose} /></div>
            <div className="mb">
              <button className="x" onClick={close} aria-label="Close">×</button>
              <div className="meta" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="mt">{workout.type}</span>
                <span className="mt o">{workout.min} min</span>
                <span className="mt">{workout.level}</span>
              </div>
              <h3>{workout.name}</h3>
              <p style={{ color: "var(--muted)" }}>{workout.desc} Equipment: <b>{workout.equipment}</b>.</p>
              <ul className="ex">
                {workout.exercises.map(([name, reps], i) => (
                  <li key={i}>{name}<span>{reps}</span></li>
                ))}
              </ul>
              <p className="note">Educational fitness content for adults 18+. Not medical advice — stop if anything hurts and check with your doctor first.</p>
              <Link className="btn btn-hot btn-block" style={{ marginTop: 18 }} href="/book" onClick={close}>
                Get a plan built around my week
              </Link>
            </div>
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}
