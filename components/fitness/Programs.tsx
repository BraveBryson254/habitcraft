"use client";

import { useState } from "react";
import Link from "next/link";
import { money } from "@/lib/utils";
import { PRICES } from "@/lib/config";

const CKP = (
  <svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4 4 10-10" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** Pricing tiers + pay toggle + credit calculator (brief §4 /programs). */
export function Programs() {
  const [split, setSplit] = useState(false);
  const [credit, setCredit] = useState(false);

  const programPrice = split ? `${money(PRICES.programSplit, true)}` : money(PRICES.programFull, true);
  const creditedFull = money(PRICES.programCredited, true); // $900
  const creditedSplit = money(Math.round((PRICES.programFull - PRICES.session) / 3), true);

  return (
    <>
      <section className="pg-hero">
        <div className="wrap">
          <span className="tag" style={{ color: "var(--lime)" }}>Programs &amp; pricing</span>
          <h1 style={{ marginTop: 14 }}>Choose where to start</h1>
          <p>Begin with one session, or commit to 12 weeks of coaching. Your $97 counts either way.</p>
          <div className="toggle">
            <button className={!split ? "on" : ""} onClick={() => setSplit(false)}>Pay in full</button>
            <button className={split ? "on" : ""} onClick={() => setSplit(true)}>Split into 3</button>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div className="tiers">
            <div className="tier">
              <h3>Body Plan Session</h3>
              <div className="p">$97</div>
              <div className="d">One-time · 45 minutes</div>
              <ul>
                <li><span className="ck">{CKP}</span>1-on-1 video planning call</li>
                <li><span className="ck">{CKP}</span>Written workout &amp; habit plan</li>
                <li><span className="ck">{CKP}</span>Habit tracker</li>
                <li><span className="ck">{CKP}</span>Credited to the program</li>
              </ul>
              <Link className="btn btn-dark btn-block" href="/book">Book session</Link>
            </div>

            <div className="tier feat">
              <span className="rb">{split ? "Easier on the budget" : "Best value"}</span>
              <h3>12-Week Program</h3>
              <div className="p">
                {split ? <>$349<small> × 3</small></> : "$997"}
              </div>
              <div className="d">{split ? "3 monthly payments · same program" : "Pay once · one fee for 12 weeks"}</div>
              <ul>
                <li><span className="ck">{CKP}</span>Everything in the session</li>
                <li><span className="ck">{CKP}</span>Weekly 1-on-1 coaching</li>
                <li><span className="ck">{CKP}</span>Plan changes as life changes</li>
                <li><span className="ck">{CKP}</span>Accountability &amp; support</li>
              </ul>
              <Link className="btn btn-hot btn-block" href={`/book?plan=program&split=${split ? 1 : 0}`}>Start the program</Link>
            </div>

            <div className="tier">
              <h3>Workout Library</h3>
              <div className="p">Free</div>
              <div className="d">Browse follow-along routines</div>
              <ul>
                <li><span className="ck">{CKP}</span>Strength, cardio &amp; mobility</li>
                <li><span className="ck">{CKP}</span>Beginner to intermediate</li>
                <li><span className="ck">{CKP}</span>No sign-up needed</li>
              </ul>
              <Link className="btn btn-dark btn-block" href="/workouts">Browse workouts</Link>
            </div>
          </div>

          <div className="calc">
            <label>
              <input type="checkbox" checked={credit} onChange={(e) => setCredit(e.target.checked)} />
              I&apos;ve already booked the $97 session
            </label>
            <div>
              {credit ? (
                <>Your program price: <span className="res">{split ? `${creditedSplit} × 3` : creditedFull}</span></>
              ) : (
                <>Program price: <span className="res">{split ? "$349 × 3" : "$997"}</span></>
              )}
            </div>
          </div>

          <div className="sec-h" style={{ marginTop: 80, marginBottom: 30 }}>
            <h2 style={{ fontSize: 38 }}>What&apos;s included</h2>
          </div>
          <table className="cmp">
            <tbody>
              <tr><th>Feature</th><th>Session</th><th>12-Week</th></tr>
              {(
                [
                  ["1-on-1 video coaching", "1 call", "Weekly"],
                  ["Written plan", "yes", "yes"],
                  ["Plan updates", "no", "yes"],
                  ["Habit tracker", "yes", "yes"],
                  ["Accountability check-ins", "no", "yes"],
                  ["Credit of $97", "—", "yes"],
                ] as const
              ).map((row, i) => (
                <tr key={i}>
                  <td>{row[0]}</td>
                  {row.slice(1).map((v, j) => (
                    <td key={j}>{v === "yes" ? <span className="yes">✓</span> : v === "no" ? <span className="no">—</span> : v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
