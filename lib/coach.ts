/**
 * Coach B scene system — presets and primitives (brief §6).
 * The <CoachScene /> component composes these. Keeping the preset table
 * here (not in the component) lets workouts.ts reference pose keys by type.
 */

export type Backdrop =
  | "gym" | "park" | "studio" | "sun" | "night" | "lime" | "live" | "teal" | "none";
export type Crop = "full" | "threeQuarter" | "bust" | "face";
export type PropName = "kettlebell" | "dumbbells" | "mat" | "bands" | "bottle" | "shadow";
export type ChipTone = "white" | "dark" | "lime";
export interface SceneChip {
  text: string;
  position: string; // CSS inline position, e.g. "left:12px;top:14px"
  tone?: ChipTone;
}

/** Crop presets: image height `s` (× container height), focal fx/fy, placement px/py. */
export const CROPS: Record<Crop, { s: number; fx: number; fy: number; px: number; py: number }> = {
  full: { s: 0.9, fx: 0.5, fy: 0.5, px: 0.5, py: 0.53 },
  threeQuarter: { s: 1.5, fx: 0.5, fy: 0.3, px: 0.5, py: 0.52 },
  bust: { s: 2.15, fx: 0.5, fy: 0.2, px: 0.5, py: 0.6 },
  face: { s: 5, fx: 0.41, fy: 0.09, px: 0.5, py: 0.5 },
};

/**
 * Pose presets — the named scenes used across the site. Each maps a semantic
 * pose to a backdrop/crop/flip/prop/chip recipe. Phase-2 pose images
 * (public/coach-b/poses/{pose}.png) override the cut-out when present.
 */
export type ScenePose =
  | "woSquat" | "manRun" | "yoga" | "plank" | "swing" | "lunge"
  | "stretch" | "pushup" | "walk" | "call" | "video" | "heroBig" | "meet";

export interface ScenePreset {
  backdrop: Backdrop;
  crop: Crop;
  flip?: boolean;
  props?: PropName[];
  chips?: SceneChip[];
  variant?: "video"; // special layered frames (the $97 call)
  poseImage?: string; // optional phase-2 override, e.g. "squat"
}

export const SCENES: Record<ScenePose, ScenePreset> = {
  woSquat: {
    backdrop: "gym", crop: "full", props: ["shadow", "kettlebell", "dumbbells"], poseImage: "squat",
    chips: [{ text: "🏋️ Strength · 30 min", position: "left:12px;top:14px", tone: "white" }],
  },
  manRun: {
    backdrop: "park", crop: "bust", flip: true, poseImage: "run",
    chips: [{ text: "🏃 Cardio · 25 min", position: "left:12px;bottom:12px", tone: "lime" }],
  },
  yoga: {
    backdrop: "studio", crop: "bust", poseImage: "yoga",
    chips: [{ text: "🧘 Mobility · 15 min", position: "left:12px;bottom:12px", tone: "white" }],
  },
  plank: {
    backdrop: "lime", crop: "full", flip: true, props: ["mat", "shadow", "bands"], poseImage: "plank",
    chips: [{ text: "🏠 Home · 20 min", position: "left:12px;top:14px", tone: "dark" }],
  },
  swing: {
    backdrop: "sun", crop: "threeQuarter", props: [], poseImage: "kettlebell",
    chips: [{ text: "🔥 Strength · 35 min", position: "right:12px;top:14px", tone: "white" }],
  },
  lunge: {
    backdrop: "studio", crop: "threeQuarter", flip: true, poseImage: "lunge",
    chips: [{ text: "🤸 Mobility · 20 min", position: "left:12px;top:14px", tone: "white" }],
  },
  stretch: {
    backdrop: "gym", crop: "threeQuarter", flip: true, poseImage: "stretch",
    chips: [{ text: "💺 Mobility · 10 min", position: "left:12px;top:14px", tone: "lime" }],
  },
  pushup: {
    backdrop: "night", crop: "full", props: ["mat", "shadow", "dumbbells"], poseImage: "pushup",
    chips: [{ text: "💪 Home · 25 min", position: "left:12px;top:14px", tone: "lime" }],
  },
  walk: {
    backdrop: "park", crop: "full", flip: true, props: ["shadow", "bottle"], poseImage: "walk",
    chips: [{ text: "🚶 Cardio · 30 min", position: "left:12px;top:14px", tone: "white" }],
  },
  call: {
    backdrop: "sun", crop: "bust", poseImage: "laptop",
    chips: [{ text: "📅 Pick a time ✓", position: "left:12px;bottom:12px", tone: "dark" }],
  },
  video: { backdrop: "live", crop: "bust", variant: "video" },
  heroBig: { backdrop: "none", crop: "bust", flip: true },
  meet: {
    backdrop: "teal", crop: "full", props: ["shadow", "kettlebell", "dumbbells"], poseImage: "stand",
    chips: [
      { text: "💬 Ask me anything", position: "right:14px;top:18px", tone: "lime" },
      { text: "AI guide · 24/7", position: "left:14px;bottom:16px", tone: "dark" },
    ],
  },
};

/** Phase-2 pose keys the component will look for under /coach-b/poses/. */
export const POSE_KEYS = [
  "stand", "squat", "kettlebell", "run", "yoga", "plank", "pushup",
  "lunge", "stretch", "walk", "laptop", "wave",
] as const;
export type PoseKey = (typeof POSE_KEYS)[number];
