import type { Config } from "tailwindcss";

/**
 * Design tokens — exactly the palette from the brief (section 3).
 * Fonts are wired in app/layout.tsx via next/font (Bricolage Grotesque + DM Sans).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a2230",
        deep: "#053b3a",
        teal: "#0d9488",
        "teal-b": "#14b8a6",
        emerald: "#34d399",
        mint: "#d9f7ef",
        "mint-2": "#eefcf7",
        lime: "#c8f542",
        orange: "#ff6a2b",
        "orange-d": "#e5531a",
        sun: "#ffb627",
        cream: "#fff8ec",
        paper: "#f4fbf8",
        violet: "#8b7cf0",
        muted: "#4b6470",
        "muted-2": "#7d949c",
        line: "#d6e8e2",
      },
      fontFamily: {
        disp: ["var(--font-bricolage)", "DM Sans", "system-ui", "sans-serif"],
        body: ["var(--font-dmsans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        r: "20px",
        "r-lg": "32px",
      },
      boxShadow: {
        soft: "0 22px 46px -24px rgba(5,59,58,.55)",
        "soft-sm": "0 10px 24px -14px rgba(5,59,58,.4)",
        "orange-glow": "0 14px 28px -12px rgba(255,106,43,.75)",
      },
      maxWidth: {
        site: "1200px",
      },
      keyframes: {
        fl1: { "50%": { transform: "translateY(-10px) rotate(-1.6deg)" } },
        fl2: { "50%": { transform: "translateY(10px) rotate(3deg)" } },
        mq: { to: { transform: "translateX(-50%)" } },
        cbp: {
          "0%": { transform: "scale(1)", opacity: "0.9" },
          "100%": { transform: "scale(1.45)", opacity: "0" },
        },
        cbt: {
          "0%,60%,100%": { transform: "translateY(0)", opacity: "0.5" },
          "30%": { transform: "translateY(-5px)", opacity: "1" },
        },
        pop: { from: { transform: "scale(0)" } },
      },
      animation: {
        fl1: "fl1 7s ease-in-out infinite",
        fl2: "fl2 8s ease-in-out infinite",
        mq: "mq 30s linear infinite",
        cbp: "cbp 2.8s ease-out 1.2s 3",
        cbt: "cbt 1s infinite",
        pop: "pop .5s cubic-bezier(.3,1.6,.5,1)",
      },
    },
  },
  plugins: [],
};

export default config;
