import "server-only";

/** Accept Vercel-provisioned stores too, but never mix tokens from different pairs. */
export function chatRedisConfiguration(env: NodeJS.ProcessEnv = process.env) {
  const pairs = [
    ["CHAT_REDIS_REST_URL", "CHAT_REDIS_REST_TOKEN"],
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ] as const;
  for (const [urlKey, tokenKey] of pairs) {
    const url = env[urlKey]?.trim();
    const token = env[tokenKey]?.trim();
    if (url || token) return { url, token };
  }
  return { url: undefined, token: undefined };
}
