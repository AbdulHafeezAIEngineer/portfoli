import "server-only";
import { chatPolicy, type ChatMessage, type DemoBotId } from "@/data/bots";
import { supportPrompt } from "@/data/prompts/support";
import { bookingPrompt } from "@/data/prompts/booking";
import { voicePrompt } from "@/data/prompts/voice";
import { botRuntime } from "@/lib/bot-runtime";
import { systemBoundary } from "./guard";
import { ChatError, publicHttpsUrl, readUpstreamJson } from "./http";

const prompts: Record<DemoBotId, string> = {
  support: supportPrompt,
  booking: bookingPrompt,
  voice: voicePrompt,
};
const maxTokens = 256;

export async function ensureConfigured(botId: string): Promise<void> {
  if (process.env.CHAT_ENABLED === "false")
    throw new ChatError(
      503,
      "The live demos are paused. Please try again later.",
    );
  const runtime = await botRuntime(botId);
  if (!runtime) throw new ChatError(400, "This bot is unavailable.");
  if (runtime.config) {
    if (runtime.config.method !== "api" || !runtime.config.endpoint)
      throw new ChatError(503, "This bot connection is not configured yet.");
    publicHttpsUrl(runtime.config.endpoint);
  } else if (!process.env.OPENAI_API_KEY?.trim())
    throw new ChatError(
      503,
      "The AI demos are not connected yet. Please try again later.",
    );
}

function readPath(value: unknown, path: string): unknown {
  let current = value;
  if (!path) return current;
  for (const part of path.split(".")) {
    if (
      ["__proto__", "constructor", "prototype"].includes(part) ||
      !current ||
      typeof current !== "object" ||
      !Object.hasOwn(current, part)
    )
      return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export async function callBot(
  botId: string,
  messages: ChatMessage[],
  signal: AbortSignal,
): Promise<{ reply: string; truncated: boolean }> {
  const combined = AbortSignal.any([signal, AbortSignal.timeout(20000)]);
  let url: string;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  let body: unknown;
  let responsePath = "choices.0.message.content";
  const runtime = await botRuntime(botId);
  if (!runtime) throw new ChatError(400, "This bot is unavailable.");
  const realBotConfig = runtime?.config;
  if (realBotConfig) {
    if (realBotConfig.method !== "api")
      throw new ChatError(503, "This bot is not configured for API chat.");
    url = publicHttpsUrl(realBotConfig.endpoint).href;
    const key = process.env.REAL_BOT_API_KEY?.trim();
    if (key)
      headers[realBotConfig.authHeader] = `${realBotConfig.authPrefix}${key}`;
    body = {
      [realBotConfig.requestField]:
        realBotConfig.requestField === "message"
          ? messages[messages.length - 1].content
          : messages,
    };
    responsePath = realBotConfig.responsePath;
  } else {
    url = "https://api.openai.com/v1/chat/completions";
    headers.Authorization = `Bearer ${process.env.OPENAI_API_KEY}`;
    const date = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeZone: "Asia/Karachi",
    }).format(new Date());
    body = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${systemBoundary}\n\n${runtime?.prompt || prompts[botId as DemoBotId] || "Help visitors understand this portfolio. Do not invent business facts."}\n\nCurrent date: ${date}. Timezone: Asia/Karachi.`,
        },
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      stream: false,
    };
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: combined,
    cache: "no-store",
    redirect: "error",
  });
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 429)
      throw new ChatError(
        503,
        "The AI provider's usage limit has been reached. Please try again later.",
      );
    throw new ChatError(
      502,
      "The bot provider is unavailable. Please try again later.",
    );
  }
  const data = await readUpstreamJson(response);
  const reply = readPath(data, responsePath);
  if (typeof reply !== "string" || !reply.trim())
    throw new ChatError(502, "The bot provider returned an empty reply.");
  return {
    reply: reply
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
      .trim()
      .slice(0, chatPolicy.maxReply),
    truncated:
      reply.trim().length > chatPolicy.maxReply ||
      (botId !== "real" &&
        readPath(data, "choices.0.finish_reason") === "length"),
  };
}
