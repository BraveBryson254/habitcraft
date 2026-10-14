"use client";

import { useState } from "react";
import Link from "next/link";
import { ACTIVITIES } from "@/lib/workouts";
import { cx } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const KEYS = ACTIVITIES.map((a) => a.k);

/** "Build your real week" — tap a day to cycle the activity. */
export function WeekPlanner() {
  const [plan, setPlan] = useState<string[]>(["strength", "rest", "cardio", "rest", "mobility", "walk", "rest"]);

  const cycle = (i: number) =>
    setPlan((p) => {
      const copy = [...p];
      copy[i] = KEYS[(KEYS.indexOf(copy[i]) + 1) % KEYS.length];
      return copy;
    });

  const total = plan.reduce((a, k) => a + (ACTIVITIES.find((x) => x.k === k)?.min ?? 0), 0);
  const sessions = plan.filter((k) => k !== "rest").length;
  const msg =
    sessions <= 2
      ? "A light week. Great starting point — your coach can add one short session when you're ready."
      : sessions <= 5
      ? "Balanced and realistic: active days with rest built in. This is the kind of plan that survives a busy week."
      : "Very active! Make sure rest and recovery stay in the plan — your coach can help you balance it.";

  return (
    <div className="planner">
      <div className="pl-days">
        {plan.map((k, i) => {
          const a = ACTIVITIES.find((x) => x.k === k)!;
          return (
            <div key={i} className={`pl-day ${a.cls}`} onClick={() => cycle(i)}>
              <div className="dn">{DAYS[i]}</div>
              <div className="ico">{a.ic}</div>
              <div className="lab">{a.lab}</div>
              <div className="min">{a.min ? `${a.min} min` : "—"}</div>
            </div>
          );
        })}
      </div>
      <div className="pl-bar">
        {plan.map((k, i) => {
          const a = ACTIVITIES.find((x) => x.k === k)!;
          return <i key={i} style={{ flex: Math.max(a.min, 4), background: a.color }} />;
        })}
      </div>
      <div className="pl-foot">
        <div className="pl-stat">
          <div><b>{sessions}</b><span>active days</span></div>
          <div><b>{total}</b><span>min this week</span></div>
        </div>
        <div className="pl-msg">{msg}</div>
        <Link className="btn btn-hot btn-sm" href="/book">Build mine with a coach</Link>
      </div>
    </div>
  );
}
