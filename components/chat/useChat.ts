"use client";

import { useCallback, useRef, useState } from "react";

/** A rendered chat message, with optional rich UI block from a tool. */
export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  ui?: ChatUI;
}
export type ChatUI =
  | { kind: "workouts"; items: Array<{ id: number; name: string; type: string; level: string; min: number; equipment: string }> }
  | { kind: "products"; items: Array<{ id: string; slug: string; name: string; price: string; mode: string; category: string }>; note?: string }
  | { kind: "navigate"; href: string; label: string }
  | { kind: "order"; orderNumber: string }
  | { kind: "handoff"; supportEmail: string }
  | { kind: "pricing"; pricing: Record<string, string> };

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

/**
 * Chat state + streaming client. Talks to /api/chat (SSE). Keeps the mockup's
 * feel: a typing indicator before each reply, then streamed text, then any UI.
 */
export function useChat(site: "fitness" | "store") {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [busy, setBusy] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setMessages([]);
    setQuickReplies([]);
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || busy) return;
      setBusy(true);
      setQuickReplies([]);

      const history: ChatMsg[] = [...messages, { role: "user", content: text }];
      setMessages(history);

      // typing indicator delay (mockup: ~0.45s + 7ms/char, capped 1.4s)
      const delay = reduceMotion() ? 60 : Math.min(1400, 450 + text.length * 7);
      // placeholder assistant bubble flagged as "typing" via empty content
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      await new Promise((r) => setTimeout(r, delay));

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            site,
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: ctrl.signal,
        });
        if (!res.body) throw new Error("No stream");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";

        const update = (partial: string, ui?: ChatUI) =>
          setMessages((m) => {
            const copy = [...m];
            const lastIdx = copy.length - 1;
            copy[lastIdx] = { role: "assistant", content: partial, ui: ui ?? copy[lastIdx].ui };
            return copy;
          });

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.replace(/^data: /, "").trim();
            if (!trimmed) continue;
            let evt: { type: string; value?: unknown };
            try {
              evt = JSON.parse(trimmed);
            } catch {
              continue;
            }
            if (evt.type === "token") {
              acc += evt.value as string;
              update(acc);
            } else if (evt.type === "ui") {
              update(acc, evt.value as ChatUI);
            } else if (evt.type === "quick") {
              setQuickReplies(evt.value as string[]);
            }
          }
        }
        if (!acc.trim()) {
          update("Sorry — I didn't catch that. Try again, or tap 'Talk to a human'.");
        }
      } catch {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "I'm having trouble connecting right now. Please try again in a moment, or email the team.",
          };
          return copy;
        });
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages, site]
  );

  return { messages, busy, quickReplies, setQuickReplies, send, reset, setMessages };
}
