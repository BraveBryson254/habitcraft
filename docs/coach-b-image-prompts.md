# Coach B — pose generation prompts

Use these to generate the **Phase 2 pose library**. Each prompt uses Coach B (your `coach-b-full.png` / `coach-b-avatar.png`) as the **reference image** so every pose is the same man.

**Every prompt starts with this exact preamble:**

> Use the attached reference image as the exact same man: same face, glasses, short hair, trimmed beard, black polo with the small gold check badge, black cargo joggers, black-and-white high-top sneakers. Photorealistic, full body, plain flat light-grey background, no text, no logos, no screen content.

Then add the one pose line below. Generate at a tall portrait aspect ratio (roughly 2:6, like 460×1458) so the crop maths in `<CoachScene />` line up.

| File name | Pose line to append |
| --- | --- |
| `squat.png` | goblet squat holding one dumbbell at chest |
| `kettlebell.png` | kettlebell swing |
| `run.png` | easy jog |
| `yoga.png` | yoga tree pose |
| `plank.png` | forearm plank |
| `pushup.png` | push-up |
| `lunge.png` | reverse lunge with arms reaching up |
| `stretch.png` | standing forward fold |
| `walk.png` | brisk walk |
| `laptop.png` | sitting at a laptop on a video call |
| `stand.png` | holding a phone showing a habit tracker |
| `wave.png` | waving hello |
| *(spare)* | thumbs up |

> `stand.png` is the default/neutral pose used in the "Meet Coach B" scene — the phone-with-habit-tracker pose reads well there; use a plain standing pose instead if you prefer.

## Removing the background (free)

The scene component expects **transparent PNGs**. After generating, remove the grey background:

- **rembg** (free, local, best quality):
  ```bash
  pip install "rembg[cli]"
  rembg i squat_raw.png squat.png      # repeat per pose
  ```
- **Free online removers:** remove.bg (free tier), photoroom.com, or Canva's "Remove background". Export as **PNG with transparency**.

## Dropping them in

Save the finished transparent PNGs here:

```
public/coach-b/poses/
  stand.png  squat.png  kettlebell.png  run.png  yoga.png  plank.png
  pushup.png  lunge.png  stretch.png  walk.png  laptop.png  wave.png
```

That's it — `<CoachScene />` picks them up automatically, and any pose you haven't made yet falls back to the base cut-out. No code changes.

## Tips

- Keep the figure roughly centred and full-height in the frame, feet near the bottom — the component anchors floor props (shadow, mat, kettlebell) to ~98.5% of the image height.
- Keep lighting flat and even so the cut-outs sit naturally on the coloured backdrops.
- Never generate text, logos, or screen content (the component adds chips and the video-call frame itself).
