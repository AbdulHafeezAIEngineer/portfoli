/** Server-side only: use one complete provider pair, never combine unrelated credentials. */
export function loginRedisConfiguration(env: NodeJS.ProcessEnv = process.env) {
  const pairs = [
    ["AUTH_REDIS_REST_URL", "AUTH_REDIS_REST_TOKEN"],
    ["CHAT_REDIS_REST_URL", "CHAT_REDIS_REST_TOKEN"],
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ] as const;
  for (const [urlKey, tokenKey] of pairs) {
    const url = env[urlKey]?.trim();
    const token = env[tokenKey]?.trim();
    // Explicit partial configuration is an error; don't silently switch providers.
    if (url || token) return { url, token };
  }
  return { url: undefined, token: undefined };
}
