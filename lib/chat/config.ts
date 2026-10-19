import "server-only";
import type { ChatSetup } from "@/data/bots";
import { chatRedisConfiguration } from "./redis-configuration";

export function chatProvider(): "openai" | "gemini" | null {
  const selected = process.env.CHAT_PROVIDER?.trim() || "auto";
  if (selected === "gemini" || selected === "openai") return selected;
  if (selected !== "auto") return null;
  return process.env.GEMINI_API_KEY?.trim() ? "gemini" : "openai";
}

export function chatApiKey(): string {
  if (chatProvider() === "gemini") return process.env.GEMINI_API_KEY?.trim() || "";
  if (chatProvider() !== "openai") return "";
  return process.env.ELVORA_CHAT_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim() || "";
}

export function chatSetup(): ChatSetup {
  if (process.env.CHAT_ENABLED === "false") return "paused";
  if (!chatProvider()) return "provider";
  if (!chatApiKey()) return "key";
  const { url, token } = chatRedisConfiguration();
  const quotasConfigured =
    url || token
      ? Boolean(url && token)
      : process.env.NODE_ENV !== "production" || process.env.CHAT_ALLOW_IN_MEMORY_LIMITER === "true";
  return quotasConfigured ? "ready" : "quota";
}

export function chatIsConnected(): boolean {
  return chatSetup() === "ready";
}
