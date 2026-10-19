import "server-only";

export function chatApiKey(): string {
  return process.env.ELVORA_CHAT_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim() || "";
}

export function chatIsConnected(): boolean {
  const quotasConfigured =
    process.env.NODE_ENV !== "production" ||
    Boolean(process.env.CHAT_REDIS_REST_URL && process.env.CHAT_REDIS_REST_TOKEN) ||
    process.env.CHAT_ALLOW_IN_MEMORY_LIMITER === "true";
  return process.env.CHAT_ENABLED !== "false" && Boolean(chatApiKey()) && quotasConfigured;
}
