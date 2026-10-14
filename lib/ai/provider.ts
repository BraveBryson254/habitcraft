/**
 * Provider adapter (brief §7.3).
 * Coach B talks to any OpenAI-compatible Chat Completions API with tool calling.
 * Default: DeepSeek (deepseek-chat). Switch providers with the AI_PROVIDER env
 * var — the only things that change are the base URL and default model.
 *
 * NOTE on model names/pricing: always confirm the current model id in your
 * provider's docs before shipping. These defaults were correct at build time
 * but providers rename models; AI_MODEL overrides whatever is set here.
 */

export interface ProviderConfig {
  baseUrl: string;
  defaultModel: string;
}

const PROVIDERS: Record<string, ProviderConfig> = {
  // https://api-docs.deepseek.com — OpenAI-compatible, tool calling supported.
  deepseek: { baseUrl: "https://api.deepseek.com/v1", defaultModel: "deepseek-chat" },
  // https://platform.openai.com
  openai: { baseUrl: "https://api.openai.com/v1", defaultModel: "gpt-4o-mini" },
  // https://console.groq.com — fast, OpenAI-compatible.
  groq: { baseUrl: "https://api.groq.com/openai/v1", defaultModel: "llama-3.3-70b-versatile" },
  // https://docs.together.ai
  together: { baseUrl: "https://api.together.xyz/v1", defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo" },
};

export function resolveProvider(): { config: ProviderConfig; apiKey: string; model: string } {
  const name = (process.env.AI_PROVIDER || "deepseek").toLowerCase();
  const config = PROVIDERS[name] ?? PROVIDERS.deepseek;
  const baseUrl = process.env.AI_BASE_URL || config.baseUrl;
  const model = process.env.AI_MODEL || config.defaultModel;
  return {
    config: { ...config, baseUrl },
    apiKey: process.env.AI_API_KEY || "",
    model,
  };
}

/** Minimal shapes we use from the Chat Completions API. */
export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

export interface ToolDef {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

/** One non-streaming completion (used for the tool-calling loop). */
export async function chatCompletion(args: {
  messages: ChatMessage[];
  tools?: ToolDef[];
  temperature?: number;
  signal?: AbortSignal;
}): Promise<ChatMessage> {
  const { config, apiKey, model } = resolveProvider();
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: args.messages,
      tools: args.tools,
      tool_choice: args.tools?.length ? "auto" : undefined,
      temperature: args.temperature ?? 0.4,
      max_tokens: 500,
    }),
    signal: args.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI provider error ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const msg = data.choices?.[0]?.message;
  if (!msg) throw new Error("AI provider returned no message");
  return msg as ChatMessage;
}
