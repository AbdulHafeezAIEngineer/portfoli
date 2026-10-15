import "server-only";
import { createHash } from "node:crypto";
import { ChatError, publicHttpsUrl } from "@/lib/chat/http";
const runtime = globalThis as typeof globalThis & {
  elvoraLoginCounters?: Map<string, { count: number; until: number }>;
};
const counters = (runtime.elvoraLoginCounters ??= new Map());
export async function limitLogin(
  headers: Record<string, string | string[] | undefined>,
) {
  const configured = process.env.AUTH_TRUSTED_IP_HEADER?.toLowerCase();
  const raw =
    configured &&
    [
      "x-real-ip",
      "x-forwarded-for",
      "x-vercel-forwarded-for",
      "cf-connecting-ip",
    ].includes(configured)
      ? headers[configured]
      : "shared";
  const identity =
    (Array.isArray(raw) ? raw[0] : raw)?.split(",")[0]?.trim().slice(0, 128) ||
    "shared";
  const now = Date.now();
  const window = Math.floor(now / 60000);
  const key = `elvora:login:${window}:${createHash("sha256").update(identity).digest("hex").slice(0, 32)}`;
  const ttl = Math.max(1, Math.ceil(((window + 1) * 60000 - now) / 1000));
  const url =
    process.env.AUTH_REDIS_REST_URL || process.env.CHAT_REDIS_REST_URL;
  const token =
    process.env.AUTH_REDIS_REST_TOKEN || process.env.CHAT_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const response = await fetch(publicHttpsUrl(url), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          "EVAL",
          "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n",
          "1",
          key,
          String(ttl),
        ]),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(4000),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("result" in result) ||
        typeof result.result !== "number"
      )
        throw new Error();
      if (result.result > 5)
        throw new ChatError(429, "Please try again later.", ttl);
      return;
    } catch (error) {
      if (error instanceof ChatError) throw error;
      throw new ChatError(503, "Login is temporarily unavailable.");
    }
  }
  if (
    url ||
    token ||
    (process.env.NODE_ENV === "production" &&
      process.env.AUTH_ALLOW_IN_MEMORY_LIMITER !== "true")
  )
    throw new ChatError(503, "Login protection is not configured.");
  for (const [k, value] of counters) if (value.until <= now) counters.delete(k);
  if (counters.size > 4096)
    throw new ChatError(503, "Login is temporarily unavailable.");
  const current = counters.get(key);
  if (current && current.count >= 5)
    throw new ChatError(429, "Please try again later.", ttl);
  counters.set(key, {
    count: (current?.count || 0) + 1,
    until: now + ttl * 1000,
  });
}
