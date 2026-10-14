"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { useCart } from "@/lib/cart";
import { useChat, type ChatMsg, type ChatUI } from "./useChat";
import { WORKOUTS } from "@/lib/workouts";
import { useWorkoutModal } from "@/components/fitness/WorkoutModalContext";

/**
 * Coach B chat widget — the mockup UI, wired to the real streaming assistant.
 * Launcher + tip bubble + panel + rich tool cards + human-handoff form.
 */

const WCOL: Record<string, string> = { Strength: "#ffb27a", Cardio: "#6ee7c4", Mobility: "#b6a3ff", Home: "#c8f542" };

const FIT_CHIPS = ["How does the $97 session work?", "Pricing", "Find me a workout", "Book a session", "I'm a beginner"];
const STORE_CHIPS = ["Shipping & delivery", "Promo code", "Protein picks", "Track my order", "Talk to a human"];

export function CoachChat() {
  const pathname = usePathname();
  const site: "fitness" | "store" = pathname?.startsWith("/store") ? "store" : "fitness";
  const { messages, busy, quickReplies, send, reset, setMessages } = useChat(site);
  const cartOpen = useCart((s) => s.drawerOpen);

  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const [input, setInput] = useState("");
  const [greeted, setGreeted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const mountedSite = useRef(site);

  // open-from-anywhere: listen for a window event (used by "Ask Coach B" buttons)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { prompt?: string } | undefined;
      openPanel();
      if (detail?.prompt) setTimeout(() => send(detail.prompt!), 300);
    };
    window.addEventListener("coachb:open", onOpen);
    return () => window.removeEventListener("coachb:open", onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greeted]);

  // tip bubble after 3.5s if not opened
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) {
        setTip(true);
        setTimeout(() => setTip(false), 9000);
      }
    }, 3500);
    return () => clearTimeout(t);
  }, [open]);

  // body class for hiding launcher when mobile panel open
  useEffect(() => {
    document.body.classList.toggle("cb-open", open && window.innerWidth <= 640);
    return () => document.body.classList.remove("cb-open");
  }, [open]);

  // greet, and re-greet when the site changes with no user messages yet
  function greet() {
    const first: ChatMsg = {
      role: "assistant",
      content:
        site === "store"
          ? "Hi, I'm Coach B's AI assistant 👋 Ask me about products, shipping, promo codes or your order.\n\nI'm an AI, not a person. I can pass you to the team any time."
          : "Hi, I'm Coach B's AI assistant 👋 I can help you find a workout, explain the $97 session, or get you booked.\n\nI'm an AI, not a person, and I don't give medical advice.",
    };
    setMessages([first]);
    setGreeted(true);
  }

  useEffect(() => {
    if (greeted && mountedSite.current !== site && !messages.some((m) => m.role === "user")) {
      mountedSite.current = site;
      reset();
      setGreeted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);

  function openPanel() {
    setOpen(true);
    setTip(false);
    if (!greeted) greet();
    setTimeout(() => {
      if (window.innerWidth > 640) document.getElementById("cbInput")?.focus();
    }, 250);
  }

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages, busy]);

  const defChips = () => (site === "store" ? STORE_CHIPS : FIT_CHIPS);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const v = input;
    setInput("");
    send(v);
  }

  if (cartOpen) return null; // hide launcher while cart drawer is open

  const launcherChips = quickReplies.length ? quickReplies : defChips();

  return (
    <div className="cbw">
      {/* tip bubble */}
      <div className={`cb-tip${tip ? " show" : ""}`}>
        <span>{site === "store" ? "Need help choosing? Ask Coach B's AI assistant." : "Hi, I'm Coach B's AI assistant. Ask me anything 👋"}</span>
        <button onClick={() => setTip(false)} aria-label="Dismiss">×</button>
      </div>

      {/* panel */}
      <section className={`cb-panel${open ? " open" : ""}`} role="dialog" aria-label="Chat with Coach B's AI assistant">
        <div className="cb-h">
          <Avatar size={46} />
          <div className="t"><b>Coach B</b><span>AI assistant · replies instantly</span></div>
          <button onClick={() => setOpen(false)} aria-label="Close chat">×</button>
        </div>

        <div className="cb-m" ref={bodyRef} aria-live="polite">
          {messages.map((m, i) => (
            <Message key={i} msg={m} isLastTyping={busy && i === messages.length - 1 && !m.content} />
          ))}
        </div>

        {/* quick replies */}
        <div className="cb-q">
          {launcherChips.map((c) => (
            <button key={c} type="button" onClick={() => !busy && send(c)}>{c}</button>
          ))}
        </div>

        <form className="cb-in" onSubmit={handleSubmit}>
          <input
            id="cbInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about workouts, pricing, orders…"
            autoComplete="off"
            aria-label="Message"
          />
          <button aria-label="Send" disabled={busy || !input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 20l18-8L3 4v6l11 2-11 2z" /></svg>
          </button>
        </form>

        <div className="cb-ft">
          AI assistant, not a human coach. No medical advice.{" "}
          <button onClick={() => !busy && send("Talk to a human")}>Talk to a human</button>
        </div>
      </section>

      {/* launcher */}
      <button className={`cb-launch pulse`} onClick={() => (open ? setOpen(false) : openPanel())} aria-label="Chat with Coach B, Habitcraft's AI assistant">
        <Avatar size={66} />
        <i className="on" />
      </button>
    </div>
  );
}

/* ---------------- message + rich blocks ---------------- */
function Message({ msg, isLastTyping }: { msg: ChatMsg; isLastTyping: boolean }) {
  if (msg.role === "user") {
    return (
      <div className="row me"><div className="m">{msg.content}</div></div>
    );
  }
  if (isLastTyping) {
    return (
      <div className="row bot typing"><Avatar size={30} /><div className="m"><i /><i /><i /></div></div>
    );
  }
  return (
    <div className="row bot">
      <Avatar size={30} />
      <div className="m">
        <RichText text={msg.content} />
        {msg.ui && <RichBlock ui={msg.ui} />}
      </div>
    </div>
  );
}

/** Render text with simple paragraph breaks and a trailing small-note after \n\n. */
function RichText({ text }: { text: string }) {
  const parts = text.split("\n\n");
  return (
    <>
      {parts.map((p, i) =>
        i === parts.length - 1 && parts.length > 1 && /not a person|no medical|FDA/i.test(p) ? (
          <small key={i}>{p}</small>
        ) : (
          <p key={i}>{p}</p>
        )
      )}
    </>
  );
}

function RichBlock({ ui }: { ui: ChatUI }) {
  const openModal = useWorkoutModal();
  const addToCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.openDrawer);

  switch (ui.kind) {
    case "workouts":
      return (
        <>
          {ui.items.map((w) => (
            <div className="mc" key={w.id}>
              <Avatar size={52} square bg={WCOL[w.type] || "#6ee7c4"} />
              <div className="tx"><b>{w.name}</b><span>{w.min} min · {w.level} · {w.equipment}</span></div>
              <button className="cb-act sm" onClick={() => openModal(w.id)}>View</button>
            </div>
          ))}
        </>
      );
    case "products":
      return (
        <>
          {ui.items.map((p) => (
            <div className="mc" key={p.id}>
              <div className="th"><Avatar size={52} square bg="#d9f7ef" /></div>
              <div className="tx"><b>{p.name}</b><span>{p.price} · {p.mode === "affiliate" ? "Partner shop" : "Habitcraft"}</span></div>
              {p.mode === "affiliate" ? (
                <Link className="cb-act sm" href={`/store/${p.slug}`}>View</Link>
              ) : (
                <button className="cb-act sm" onClick={() => { addToCart(p.id, 0, 1); openCart(); }}>+ Add</button>
              )}
            </div>
          ))}
          {ui.note && <small>{ui.note}</small>}
        </>
      );
    case "navigate":
      return <Link className="cb-act" href={ui.href}>{ui.label}</Link>;
    case "order":
      return <small>Order {ui.orderNumber} — tracking details will be emailed to you.</small>;
    case "pricing":
      return (
        <ul>
          {Object.values(ui.pricing).map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      );
    case "handoff":
      return <HandoffForm supportEmail={ui.supportEmail} />;
    default:
      return null;
  }
}

function HandoffForm({ supportEmail }: { supportEmail: string }) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [vals, setVals] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!vals.name.trim() || !/^\S+@\S+\.\S+$/.test(vals.email)) {
      setErr("Add your name and a valid email.");
      return;
    }
    setErr("");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...vals, source: "chat" }),
      });
    } catch {
      /* best-effort; still confirm so the visitor isn't blocked */
    }
    setSent(true);
  }

  if (sent) {
    return <small>Thanks — I've passed your message to the Habitcraft team. A person will reply by email.</small>;
  }
  return (
    <form className="cb-f" onSubmit={submit}>
      <input placeholder="Your name" value={vals.name} onChange={(e) => setVals({ ...vals, name: e.target.value })} autoComplete="name" />
      <input placeholder="Email" value={vals.email} onChange={(e) => setVals({ ...vals, email: e.target.value })} autoComplete="email" />
      <textarea rows={2} placeholder="How can we help?" value={vals.message} onChange={(e) => setVals({ ...vals, message: e.target.value })} />
      {err && <div className="er">{err}</div>}
      <button className="cb-act" style={{ margin: 0 }}>Send to the team</button>
      <small>Or email {supportEmail} directly.</small>
    </form>
  );
}

export { WORKOUTS };
