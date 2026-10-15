import "server-only";
import { createHash } from "node:crypto";
import { ChatError, publicHttpsUrl } from "./http";

type Counter = { count: number; until: number };
const runtime = globalThis as typeof globalThis & {
  portfolioChatLimiter?: { counters: Map<string, Counter>; active: number };
};
const state = (runtime.portfolioChatLimiter ??= {
  counters: new Map(),
  active: 0,
});
const perMinute = 6;
const perDay = 30;

const lua = `
for i=1,3 do
  if tonumber(redis.call('GET',KEYS[i]) or '0') >= tonumber(ARGV[i]) then
    return {0, math.max(1, redis.call('TTL',KEYS[i]))}
  end
end
for i=1,3 do
  local count = redis.call('INCR',KEYS[i])
  if count == 1 then redis.call('EXPIRE',KEYS[i],ARGV[i+3]) end
end
return {1,0}`;

export async function reserveRequest(request: Request): Promise<void> {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const day = Math.floor(now / 86400000);
  const minuteTtl = Math.ceil(((minute + 1) * 60000 - now) / 1000);
  const dayTtl = Math.ceil(((day + 1) * 86400000 - now) / 1000);
  const rawCap = Number(process.env.CHAT_DAILY_REQUEST_CAP || "100");
  const cap =
    Number.isInteger(rawCap) && rawCap >= 1 && rawCap <= 1000 ? rawCap : 100;
  const header = process.env.CHAT_TRUSTED_IP_HEADER?.toLowerCase();
  const allowed = [
    "x-vercel-forwarded-for",
    "cf-connecting-ip",
    "x-real-ip",
    "x-forwarded-for",
  ];
  // A shared bucket is safer than trusting spoofable forwarding headers by default.
  const identity =
    header && allowed.includes(header)
      ? request.headers.get(header)?.split(",")[0]?.trim().slice(0, 128) ||
        "shared"
      : "shared";
  const hash = createHash("sha256").update(identity).digest("hex").slice(0, 32);
  const keys = [
    `portfolio:minute:${minute}:${hash}`,
    `portfolio:day:${day}:${hash}`,
    `portfolio:global:${day}`,
  ];
  const limits = [perMinute, perDay, cap];
  const ttls = [minuteTtl, dayTtl, dayTtl];
  const redisUrl = process.env.CHAT_REDIS_REST_URL;
  const redisToken = process.env.CHAT_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const response = await fetch(publicHttpsUrl(redisUrl), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          "EVAL",
          lua,
          "3",
          ...keys,
          ...limits.map(String),
          ...ttls.map(String),
        ]),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("Rate store unavailable");
      const data: unknown = await response.json();
      const result =
        data && typeof data === "object" && "result" in data
          ? data.result
          : null;
      if (
        !Array.isArray(result) ||
        result.length !== 2 ||
        ![0, 1].includes(result[0]) ||
        !Number.isFinite(result[1])
      )
        throw new Error("Invalid rate result");
      if (result[0] === 0)
        throw new ChatError(
          429,
          "This demo has reached its usage limit. Please try again later.",
          Math.max(1, Math.ceil(result[1])),
        );
      return;
    } catch (error) {
      if (error instanceof ChatError && error.status === 429) throw error;
      throw new ChatError(
        503,
        "The demo's usage protection is temporarily unavailable. Please try again later.",
      );
    }
  }
  if (
    redisUrl ||
    redisToken ||
    (process.env.NODE_ENV === "production" &&
      process.env.CHAT_ALLOW_IN_MEMORY_LIMITER !== "true")
  )
    throw new ChatError(
      503,
      "This demo's usage protection is not configured yet.",
    );
  for (const [key, counter] of state.counters)
    if (counter.until <= now) state.counters.delete(key);
  if (state.counters.size > 4096)
    throw new ChatError(503, "The demos are busy. Please try again later.");
  for (let i = 0; i < keys.length; i++) {
    const counter = state.counters.get(keys[i]);
    if (counter && counter.count >= limits[i])
      throw new ChatError(
        429,
        "This demo has reached its usage limit. Please try again later.",
        Math.max(1, Math.ceil((counter.until - now) / 1000)),
      );
  }
  for (let i = 0; i < keys.length; i++) {
    const counter = state.counters.get(keys[i]);
    state.counters.set(keys[i], {
      count: (counter?.count || 0) + 1,
      until: counter?.until || now + ttls[i] * 1000,
    });
  }
}

export function acquireSlot(): () => void {
  if (state.active >= 2)
    throw new ChatError(
      429,
      "The demos are busy. Please try again in a moment.",
      10,
    );
  state.active++;
  return () => {
    state.active = Math.max(0, state.active - 1);
  };
}
