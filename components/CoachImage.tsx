"use client";

import { useState } from "react";

/**
 * The Coach B cut-out layer. Defaults to the base transparent cut-out
 * (--cbimg). If a Phase-2 pose PNG is named, it tries to load it and silently
 * falls back to the base cut-out if the file is missing (brief §6.4) — so you
 * can drop new poses into /public/coach-b/poses/ without touching code.
 */
export function CoachImage({
  flip,
  poseImage,
  alt,
}: {
  flip?: boolean;
  poseImage?: string;
  alt?: string;
}) {
  const [poseOk, setPoseOk] = useState(false);
  const usePose = Boolean(poseImage) && poseOk;

  return (
    <>
      {/* Probe: a hidden <img> that flips poseOk true only if the pose file loads. */}
      {poseImage && !poseOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/coach-b/poses/${poseImage}.png`}
          alt=""
          aria-hidden="true"
          style={{ display: "none" }}
          onLoad={() => setPoseOk(true)}
        />
      )}
      <div
        className={`cb${flip ? " flip" : ""}`}
        role="img"
        aria-label={alt ?? "Coach B, Habitcraft's AI guide"}
        style={usePose ? { backgroundImage: `url("/coach-b/poses/${poseImage}.png")` } : undefined}
      />
    </>
  );
}
