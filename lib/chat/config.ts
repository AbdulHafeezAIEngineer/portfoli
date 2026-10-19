import "server-only";

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

export function chatIsConnected(): boolean {
  const quotasConfigured =
    process.env.NODE_ENV !== "production" ||
    Boolean(process.env.CHAT_REDIS_REST_URL && process.env.CHAT_REDIS_REST_TOKEN) ||
    process.env.CHAT_ALLOW_IN_MEMORY_LIMITER === "true";
  return process.env.CHAT_ENABLED !== "false" && Boolean(chatApiKey()) && quotasConfigured;
}
