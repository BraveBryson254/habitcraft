import type { Metadata } from "next";
import Link from "next/link";
import { CoachScene } from "@/components/CoachScene";
import { WorkoutLibrary } from "@/components/fitness/WorkoutLibrary";

export const metadata: Metadata = {
  title: "Workouts",
  description: "Follow-along workouts for strength, cardio, mobility and home training. Filter by what you need today.",
};

export default function WorkoutsPage() {
  return (
    <>
      <section className="wk-hero">
        <div className="wrap">
          <span className="tag" style={{ color: "#fff" }}>Workout library</span>
          <h1 style={{ marginTop: 14 }}>Follow-along workouts</h1>
          <p>Beginner-friendly routines for strength, cardio, mobility and home training. Filter by what you need today.</p>
        </div>
        <div className="big"><CoachScene pose="heroBig" /></div>
      </section>

      <section className="sec" style={{ paddingTop: 50 }}>
        <div className="wrap">
          <WorkoutLibrary />
        </div>
      </section>

      <section className="sec cta">
        <div className="wrap">
          <h2>Want a plan built just for you?</h2>
          <p>Your coach picks the right workouts for your week.</p>
          <Link className="btn btn-dark" href="/book">Book your $97 session</Link>
        </div>
      </section>
    </>
  );
}
