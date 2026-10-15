import "server-only";
import { createHash } from "node:crypto";
import { ChatError, publicHttpsUrl } from "@/lib/chat/http";
import {
  contactContent as copy,
  contactPolicy as policy,
} from "@/data/contact";

type Counter = { count: number; until: number };
const runtime = globalThis as typeof globalThis & {
  elvoraContactLimiter?: { counters: Map<string, Counter>; active: number };
};
const state = (runtime.elvoraContactLimiter ??= {
  counters: new Map(),
  active: 0,
});
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

export async function reserveContact(request: Request): Promise<void> {
  const now = Date.now();
  const window = Math.floor(now / 600000);
  const day = Math.floor(now / 86400000);
  const shortTtl = Math.ceil(((window + 1) * 600000 - now) / 1000);
  const dayTtl = Math.ceil(((day + 1) * 86400000 - now) / 1000);
  const rawCap = Number(process.env.CONTACT_DAILY_SEND_CAP || "50");
  const cap =
    Number.isInteger(rawCap) && rawCap >= 1 && rawCap <= 500 ? rawCap : 50;
  const header = (
    process.env.CONTACT_TRUSTED_IP_HEADER || process.env.CHAT_TRUSTED_IP_HEADER
  )?.toLowerCase();
  const allowed = [
    "x-vercel-forwarded-for",
    "cf-connecting-ip",
    "x-real-ip",
    "x-forwarded-for",
  ];
  // Without a verified proxy header, all visitors share a conservative bucket.
  const identity =
    header && allowed.includes(header)
      ? request.headers.get(header)?.split(",")[0]?.trim().slice(0, 128) ||
        "shared"
      : "shared";
  const hash = createHash("sha256").update(identity).digest("hex").slice(0, 32);
  const keys = [
    `elvora:contact:short:${window}:${hash}`,
    `elvora:contact:day:${day}:${hash}`,
    `elvora:contact:global:${day}`,
  ];
  const limits = [policy.perTenMinutes, policy.perDay, cap];
  const ttls = [shortTtl, dayTtl, dayTtl];
  const redisUrl =
    process.env.CONTACT_REDIS_REST_URL || process.env.CHAT_REDIS_REST_URL;
  const token =
    process.env.CONTACT_REDIS_REST_TOKEN || process.env.CHAT_REDIS_REST_TOKEN;
  if (redisUrl && token) {
    try {
      const response = await fetch(publicHttpsUrl(redisUrl), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
          copy.errors.limited,
          Math.max(1, Math.ceil(result[1])),
        );
      return;
    } catch (error) {
      if (error instanceof ChatError && error.status === 429) throw error;
      throw new ChatError(503, copy.errors.protection);
    }
  }
  if (
    redisUrl ||
    token ||
    (process.env.NODE_ENV === "production" &&
      process.env.CONTACT_ALLOW_IN_MEMORY_LIMITER !== "true")
  )
    throw new ChatError(503, copy.errors.protection);
  for (const [key, value] of state.counters)
    if (value.until <= now) state.counters.delete(key);
  if (state.counters.size > 4096)
    throw new ChatError(503, copy.errors.protection);
  for (let i = 0; i < keys.length; i++) {
    const counter = state.counters.get(keys[i]);
    if (counter && counter.count >= limits[i])
      throw new ChatError(
        429,
        copy.errors.limited,
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

export function acquireContactSlot(): () => void {
  if (state.active >= 2) throw new ChatError(429, copy.errors.limited, 10);
  state.active++;
  return () => {
    state.active = Math.max(0, state.active - 1);
  };
}
