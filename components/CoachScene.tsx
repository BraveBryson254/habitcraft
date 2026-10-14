import React from "react";
import { CROPS, SCENES, type ScenePose, type Backdrop, type PropName, type SceneChip } from "@/lib/coach";
import { CoachImage } from "./CoachImage";

/**
 * <CoachScene /> — renders Coach B as the image in any slot (brief §6.1).
 * Variety comes from crop, mirror, backdrop, props and chips, all layered
 * over a single transparent cut-out (/coach-b/coach-b-full.png).
 *
 * Phase 2: if a pose PNG exists at /coach-b/poses/{poseImage}.png the CSS var
 * `--cb-pose` overrides the default cut-out for that scene (README §Imagery).
 */

/* ---------------- backdrops (match the mockup) ---------------- */
function Backdrop({ kind }: { kind: Backdrop }) {
  if (kind === "none") return null;
  const grads: Record<Exclude<Backdrop, "none">, [string, string]> = {
    gym: ["#ffe3c9", "#ffb27a"],
    park: ["#bff3e4", "#6ee7c4"],
    studio: ["#e6dcff", "#b6a3ff"],
    sun: ["#fff0bd", "#ffb627"],
    night: ["#103a46", "#0d6b73"],
    lime: ["#f1ffc4", "#c8f542"],
    live: ["#0b2d3a", "#0d7a78"],
    teal: ["#0a5f5a", "#14b8a6"],
  };
  const [a, b] = grads[kind];
  return (
    <div className="bgk" style={{ background: `linear-gradient(180deg,${a},${b})` }}>
      {kind === "gym" && (
        <>
          <i style={{ left: "7%", top: "7%", width: "24%", height: "38%", borderRadius: 10, background: "rgba(255,255,255,.35)" }} />
          <i style={{ left: "35%", top: "7%", width: "24%", height: "38%", borderRadius: 10, background: "rgba(255,255,255,.35)" }} />
          <i style={{ left: 0, right: 0, bottom: 0, height: "14%", background: "rgba(255,106,43,.45)" }} />
        </>
      )}
      {kind === "park" && (
        <>
          <i style={{ left: "60%", top: "8%", width: "28%", aspectRatio: "1", borderRadius: "50%", background: "#fff6c9", opacity: 0.92 }} />
          <i style={{ left: "-10%", right: "-10%", bottom: "-10%", height: "34%", borderRadius: "50% 50% 0 0/100% 100% 0 0", background: "#3fc9a2", opacity: 0.6 }} />
          <i style={{ left: "-30%", right: "12%", bottom: "-12%", height: "24%", borderRadius: "50% 50% 0 0/100% 100% 0 0", background: "#0d9488", opacity: 0.55 }} />
        </>
      )}
      {kind === "studio" && (
        <>
          <i style={{ left: "20%", right: "20%", top: "7%", bottom: "10%", borderRadius: "999px 999px 0 0", background: "rgba(255,255,255,.5)" }} />
          <i style={{ left: "49.5%", width: "1%", top: "7%", bottom: "10%", background: "#b6a3ff", opacity: 0.6 }} />
          <i style={{ left: 0, right: 0, bottom: 0, height: "12%", background: "rgba(139,124,240,.38)" }} />
        </>
      )}
      {kind === "sun" && (
        <>
          <i style={{ left: "50%", top: "46%", width: "150%", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(255,255,255,.33)" }} />
          <i style={{ left: "50%", top: "46%", width: "104%", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(255,255,255,.35)" }} />
          <i style={{ left: 0, right: 0, bottom: 0, height: "12%", background: "rgba(255,106,43,.32)" }} />
        </>
      )}
      {kind === "night" && (
        <>
          <i style={{ left: "8%", top: "12%", width: "1.6%", aspectRatio: "1", borderRadius: "50%", background: "#fff" }} />
          <i style={{ left: "34%", top: "6%", width: "1.2%", aspectRatio: "1", borderRadius: "50%", background: "#fff" }} />
          <i style={{ left: "52%", top: "20%", width: "1.2%", aspectRatio: "1", borderRadius: "50%", background: "#fff" }} />
          <i style={{ left: "68%", top: "9%", width: "20%", aspectRatio: "1", borderRadius: "50%", background: "#ffe8a3" }} />
          <i style={{ left: 0, right: 0, bottom: 0, height: "12%", background: "#06303a" }} />
        </>
      )}
      {kind === "lime" && (
        <>
          <i style={{ left: "-10%", right: "-10%", bottom: "-30%", height: "70%", borderRadius: "50% 50% 0 0", background: "rgba(255,255,255,.5)" }} />
          <i style={{ left: "8%", top: "8%", width: "20%", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,255,255,.65)" }} />
        </>
      )}
      {kind === "live" && (
        <i style={{ left: "50%", top: "30%", width: "120%", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,.35),transparent 65%)" }} />
      )}
      {kind === "teal" && (
        <>
          <i style={{ left: "50%", top: "50%", width: "130%", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
          <i style={{ left: "50%", top: "50%", width: "90%", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
        </>
      )}
    </div>
  );
}

/* ---------------- floor-anchored props ---------------- */
const PROP_SVG: Record<string, React.ReactNode> = {
  kettlebell: (
    <svg viewBox="0 0 60 72"><path d="M16,26 Q30,-4 44,26" stroke="#0a2230" strokeWidth="8" fill="none" strokeLinecap="round" /><circle cx="30" cy="47" r="23" fill="#ff6a2b" stroke="#0a2230" strokeWidth="3" /><circle cx="22" cy="39" r="5" fill="#fff" opacity=".35" /></svg>
  ),
  dumbbells: (
    <svg viewBox="0 0 90 34"><rect x="14" y="13" width="62" height="8" rx="3" fill="#2b3a45" /><rect x="2" y="3" width="12" height="28" rx="4" fill="#0a2230" /><rect x="76" y="3" width="12" height="28" rx="4" fill="#0a2230" /></svg>
  ),
  bands: (
    <svg viewBox="0 0 200 26"><ellipse cx="100" cy="13" rx="99" ry="12" fill="#14b8a6" /><ellipse cx="100" cy="11" rx="86" ry="7" fill="#fff" opacity=".18" /></svg>
  ),
  bottle: (
    <svg viewBox="0 0 40 90"><rect x="12" y="2" width="16" height="12" rx="4" fill="#0a2230" /><rect x="6" y="12" width="28" height="76" rx="10" fill="#14b8a6" /><rect x="6" y="40" width="28" height="30" fill="#fff" opacity=".85" /></svg>
  ),
};

/** Position a prop relative to the feet of the cut-out (y≈.985). */
function propStyle(axFrac: number, ay: number, widthFrac: number, fx: number): React.CSSProperties {
  return {
    left: `calc(var(--px)*100cqw + (${axFrac} - ${fx})*var(--s)*31.76cqh)`,
    top: `calc(var(--py)*100cqh + (${ay} - var(--fy))*var(--s)*100cqh)`,
    width: `calc(${widthFrac}*var(--s)*100cqh)`,
    zIndex: 3,
  };
}

/* ---------------- main component ---------------- */
export interface CoachSceneProps {
  pose?: ScenePose;
  backdrop?: Backdrop;
  crop?: "full" | "threeQuarter" | "bust" | "face";
  flip?: boolean;
  props?: PropName[];
  chips?: SceneChip[];
  className?: string;
  alt?: string;
}

const CHIP_CLASS: Record<string, string> = { white: "", dark: "dk", lime: "lm" };

export function CoachScene(props: CoachSceneProps) {
  // Resolve a named pose preset, then allow explicit overrides.
  const preset = props.pose ? SCENES[props.pose] : undefined;
  const backdrop = props.backdrop ?? preset?.backdrop ?? "park";
  const crop = props.crop ?? preset?.crop ?? "full";
  const flip = props.flip ?? preset?.flip ?? false;
  const propList = props.props ?? preset?.props ?? [];
  const chips = props.chips ?? preset?.chips ?? [];
  const isVideo = preset?.variant === "video";
  const poseImage = preset?.poseImage;

  const c = CROPS[crop];
  const styleVars = {
    "--s": c.s,
    "--fx": c.fx,
    "--fy": c.fy,
    "--px": c.px,
    "--py": c.py,
  } as React.CSSProperties;

  return (
    <div className={`cbs ${props.className ?? ""}`} style={styleVars}>
      <Backdrop kind={backdrop} />
      <CoachImage flip={flip} poseImage={poseImage} alt={props.alt} />

      {/* floor-anchored props */}
      {propList.includes("shadow") && (
        <div className="pr" style={propStyle(0.5, 0.99, 0.55, c.fx)}>
          <svg viewBox="0 0 100 20"><ellipse cx="50" cy="10" rx="48" ry="8" fill="#0a2230" opacity=".28" /></svg>
        </div>
      )}
      {propList.includes("mat") && (
        <div className="pr" style={propStyle(0.5, 0.985, 0.7, c.fx)}>
          <svg viewBox="0 0 200 26"><ellipse cx="100" cy="13" rx="99" ry="12" fill="#ff6a2b" /><ellipse cx="100" cy="11" rx="86" ry="7" fill="#fff" opacity=".18" /></svg>
        </div>
      )}
      {propList.includes("kettlebell") && (
        <div className="pr" style={propStyle(-0.42, 0.975, 0.13, c.fx)}>{PROP_SVG.kettlebell}</div>
      )}
      {propList.includes("dumbbells") && (
        <div className="pr" style={propStyle(1.42, 0.99, 0.2, c.fx)}>{PROP_SVG.dumbbells}</div>
      )}
      {propList.includes("bands") && (
        <div className="pr" style={propStyle(1.38, 0.93, 0.2, c.fx)}>{PROP_SVG.bands}</div>
      )}
      {propList.includes("bottle") && (
        <div className="pr" style={propStyle(1.35, 0.93, 0.1, c.fx)}>{PROP_SVG.bottle}</div>
      )}

      {/* video-call frame overlay (the $97 session) */}
      {isVideo && (
        <>
          <div className="vc-top"><span className="rec" />LIVE · 45:00<b>Coach B</b></div>
          <div className="vc-self">You</div>
          <div className="vc-bar"><i>🎤</i><i>📹</i><i className="end">✕</i></div>
        </>
      )}

      {/* chips */}
      {chips.map((chip, i) => (
        <span key={i} className={`cchip ${CHIP_CLASS[chip.tone ?? "white"]}`} style={cssFromInline(chip.position)}>
          {chip.text}
        </span>
      ))}
    </div>
  );
}

/** Parse a "left:12px;top:14px" string into a style object. */
function cssFromInline(s: string): React.CSSProperties {
  const style: Record<string, string> = {};
  s.split(";").forEach((rule) => {
    const [k, v] = rule.split(":");
    if (k && v) style[k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v.trim();
  });
  return style as React.CSSProperties;
}

export default CoachScene;
