/**
 * Workout library + training-style + planner data (brief §4).
 * Workouts are data-driven; the pose maps to a Coach B scene preset.
 */

import type { ScenePose } from "./coach";

export type WorkoutType = "Strength" | "Cardio" | "Mobility" | "Home";
export type WorkoutLevel = "Beginner" | "Intermediate";

export interface Workout {
  id: number;
  name: string;
  type: WorkoutType;
  level: WorkoutLevel;
  min: number;
  equipment: string;
  pose: ScenePose; // which Coach B scene to render
  desc: string;
  exercises: Array<[string, string]>; // [name, sets×reps]
}

export const WORKOUTS: Workout[] = [
  {
    id: 1, name: "Goblet Squat Basics", type: "Strength", level: "Beginner", min: 30, equipment: "Dumbbell",
    pose: "woSquat", desc: "Learn the squat pattern with a single dumbbell.",
    exercises: [["Goblet squat", "3 × 10"], ["Dumbbell row", "3 × 10 / side"], ["Glute bridge", "3 × 12"], ["Dead bug", "2 × 8 / side"]],
  },
  {
    id: 2, name: "Kettlebell Hinge & Swing", type: "Strength", level: "Intermediate", min: 35, equipment: "Kettlebell",
    pose: "swing", desc: "Hip-hinge strength with a kettlebell.",
    exercises: [["Kettlebell deadlift", "3 × 10"], ["Kettlebell swing", "4 × 12"], ["Farmer carry", "3 × 30 m"], ["Plank", "3 × 30 s"]],
  },
  {
    id: 3, name: "Easy Run Intervals", type: "Cardio", level: "Beginner", min: 25, equipment: "None",
    pose: "manRun", desc: "Alternate easy running and walking.",
    exercises: [["Warm-up walk", "5 min"], ["Run 1 min / Walk 2 min", "× 5"], ["Cool-down walk", "5 min"], ["Calf stretch", "2 × 30 s"]],
  },
  {
    id: 4, name: "Morning Flow", type: "Mobility", level: "Beginner", min: 15, equipment: "Mat",
    pose: "yoga", desc: "A gentle wake-up sequence.",
    exercises: [["Cat-cow", "1 min"], ["Standing tree balance", "30 s / side"], ["Low lunge reach", "5 breaths / side"], ["Forward fold", "1 min"]],
  },
  {
    id: 5, name: "Living-Room Core", type: "Home", level: "Beginner", min: 20, equipment: "Mat",
    pose: "plank", desc: "Core circuit with zero equipment.",
    exercises: [["Forearm plank", "3 × 30 s"], ["Dead bug", "3 × 8 / side"], ["Bird dog", "3 × 8 / side"], ["Side plank", "2 × 20 s / side"]],
  },
  {
    id: 6, name: "Push-Up Ladder", type: "Home", level: "Intermediate", min: 25, equipment: "None",
    pose: "pushup", desc: "Build push-ups from the floor up.",
    exercises: [["Incline push-up", "3 × 8"], ["Push-up", "3 × 6"], ["Pike hold", "3 × 20 s"], ["Child's pose", "1 min"]],
  },
  {
    id: 7, name: "Desk-Day Reset", type: "Mobility", level: "Beginner", min: 10, equipment: "None",
    pose: "stretch", desc: "Undo a long day of sitting.",
    exercises: [["Neck rolls", "1 min"], ["Thoracic open-book", "8 / side"], ["Hip flexor stretch", "45 s / side"], ["Hamstring stretch", "45 s / side"]],
  },
  {
    id: 8, name: "Lunge & Reach Flow", type: "Mobility", level: "Intermediate", min: 20, equipment: "Mat",
    pose: "lunge", desc: "Dynamic lunges with overhead reach.",
    exercises: [["Reverse lunge + reach", "3 × 8 / side"], ["Lateral lunge", "3 × 8 / side"], ["World's greatest stretch", "5 / side"], ["Deep squat hold", "3 × 30 s"]],
  },
  {
    id: 9, name: "Park Walk Plan", type: "Cardio", level: "Beginner", min: 30, equipment: "None",
    pose: "walk", desc: "A steady-pace walk with pace pickups.",
    exercises: [["Easy walk", "10 min"], ["Brisk walk", "2 min × 4"], ["Easy walk", "8 min"], ["Gentle stretch", "3 min"]],
  },
];

export function getWorkout(id: number): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id);
}

/** Training styles for the "Pick your style" tab list on the home page. */
export interface StyleTab {
  id: string;
  icon: string;
  name: string;
  sub: string;
  pose: ScenePose;
  head: string;
  text: string;
  points: string[];
}

export const STYLES: StyleTab[] = [
  {
    id: "strength", icon: "🏋️", name: "Strength", sub: "Build a base with simple lifts", pose: "woSquat",
    head: "Strength, at your pace",
    text: "Foundational movements, taught step by step. Your coach adjusts load and volume around your real week.",
    points: ["Goblet squats, hinges, presses and rows", "Dumbbell, kettlebell or bodyweight options", "Short 30–45 minute sessions"],
  },
  {
    id: "cardio", icon: "🏃", name: "Cardio & outdoors", sub: "Walks, runs and intervals", pose: "manRun",
    head: "Move more, your way",
    text: "Walking plans, easy runs and gentle intervals that slot into the gaps in your day.",
    points: ["Beginner-friendly walk-to-run plans", "Intervals you can do outside or at home", "Progress at a pace that feels sustainable"],
  },
  {
    id: "mobility", icon: "🧘", name: "Mobility & yoga", sub: "Move well, recover well", pose: "yoga",
    head: "Mobility that fits in 15 minutes",
    text: "Flow sequences and stretches to keep you moving comfortably between harder days.",
    points: ["Mat-based flows and standing balance work", "Desk-day reset routines", "Great as a warm-up or rest-day habit"],
  },
  {
    id: "home", icon: "🏠", name: "Home workouts", sub: "No gym? No problem", pose: "plank",
    head: "Train anywhere",
    text: "Bodyweight and resistance-band routines you can do in a living room, hotel or garage.",
    points: ["Planks, push-ups, lunges and core circuits", "Minimal or zero equipment needed", "Follow-along routines in our library"],
  },
];

/** Planner activity types for "Build your real week". */
export interface PlanActivity {
  k: string;
  lab: string;
  ic: string;
  min: number;
  cls: string;
  color: string;
}

export const ACTIVITIES: PlanActivity[] = [
  { k: "rest", lab: "Rest", ic: "😴", min: 0, cls: "s-rest", color: "#e8f0ee" },
  { k: "walk", lab: "Walk", ic: "🚶", min: 25, cls: "s-walk", color: "#c8f542" },
  { k: "strength", lab: "Strength", ic: "🏋️", min: 40, cls: "s-strength", color: "#ff6a2b" },
  { k: "cardio", lab: "Cardio", ic: "🏃", min: 30, cls: "s-cardio", color: "#ffb627" },
  { k: "mobility", lab: "Mobility", ic: "🧘", min: 20, cls: "s-mobility", color: "#34d399" },
  { k: "home", lab: "Home", ic: "🏠", min: 30, cls: "s-home", color: "#60a5fa" },
];
