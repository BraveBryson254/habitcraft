import { NextRequest } from "next/server";
import { z } from "zod";
import { aiEnabled } from "@/lib/config";
import { chatCompletion, type ChatMessage } from "@/lib/ai/provider";
import { systemPrompt } from "@/lib/ai/prompt";
import { TOOL_DEFS, runTool } from "@/lib/ai/tools";
import { preCheck } from "@/lib/ai/safety";
import { scriptedReply } from "@/lib/ai/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Coach B chat endpoint.
 * - Runs a safety pre-check (medical/results) before anything else.
 * - If AI is configured: runs a tool-calling loop against the provider,
 *   streaming the final text token-by-token via Server-Sent Events, and
 *   emitting any tool UI block as a `ui` event.
 * - If AI is not configured: returns a scripted (but honest) reply so the
 *   widget works out of the box.
 */

const BodySchema = z.object({
  site: z.enum(["fitness", "store"]).default("fitness"),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(40),
});

function sse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const last = [...body.messages].reverse().find((m) => m.role === "user");
  const userText = last?.content ?? "";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (d: unknown) => controller.enqueue(enc.encode(sse(d)));

      try {
        // 1) Safety pre-check — short-circuit the riskiest asks.
        const safety = preCheck(userText);
        if (safety) {
          for (const ch of safety.reply.split(/(?<=\s)/)) {
            send({ type: "token", value: ch });
          }
          send({ type: "ui", value: { kind: "handoff", supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL } });
          send({ type: "done" });
          controller.close();
          return;
        }

        // 2) No AI configured — scripted fallback.
        if (!aiEnabled) {
          const reply = scriptedReply(userText, body.site);
          for (const ch of reply.text.split(/(?<=\s)/)) send({ type: "token", value: ch });
          if (reply.ui) send({ type: "ui", value: reply.ui });
          if (reply.quickReplies) send({ type: "quick", value: reply.quickReplies });
          send({ type: "done" });
          controller.close();
          return;
        }

        // 3) Real AI with tool-calling loop.
        const messages: ChatMessage[] = [
          { role: "system", content: systemPrompt(body.site) },
          ...body.messages.map((m) => ({ role: m.role, content: m.content })),
        ];

        let uiBlocks: unknown[] = [];
        // Up to 3 tool rounds, then force a final answer.
        for (let round = 0; round < 3; round++) {
          const msg = await chatCompletion({ messages, tools: TOOL_DEFS });

          if (msg.tool_calls?.length) {
            messages.push(msg);
            for (const call of msg.tool_calls) {
              const result = await runTool(call.function.name, call.function.arguments);
              if (result.ui) uiBlocks.push(result.ui);
              messages.push({
                role: "tool",
                tool_call_id: call.id,
                name: call.function.name,
                content: JSON.stringify(result.data),
              });
            }
            continue; // let the model use the tool results
          }

          // Final text answer — stream it out.
          const text = msg.content ?? "";
          for (const ch of text.split(/(?<=\s)/)) send({ type: "token", value: ch });
          for (const ui of uiBlocks) send({ type: "ui", value: ui });
          send({ type: "done" });
          controller.close();
          return;
        }

        // Safety net if we exhausted tool rounds.
        const forced = await chatCompletion({ messages });
        for (const ch of (forced.content ?? "").split(/(?<=\s)/)) send({ type: "token", value: ch });
        for (const ui of uiBlocks) send({ type: "ui", value: ui });
        send({ type: "done" });
        controller.close();
      } catch (err) {
        console.error("chat error", err);
        // Degrade to scripted reply on provider error.
        const reply = scriptedReply(userText, body.site);
        send({ type: "token", value: reply.text });
        if (reply.ui) send({ type: "ui", value: reply.ui });
        send({ type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
