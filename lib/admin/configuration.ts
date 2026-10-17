import "server-only";
import { loginRedisConfiguration } from "./redis-configuration";

/** Safe to expose only the aggregate readiness, never individual secret values. */
export function adminConfigurationReady(env: NodeJS.ProcessEnv = process.env) {
  if (!env.DATABASE_URL?.trim() || !env.NEXTAUTH_SECRET?.trim()) return false;
  if (env.NODE_ENV !== "production") return true;
  const { url: redisUrl, token: redisToken } = loginRedisConfiguration(env);
  // A partial shared-store configuration must not silently use memory.
  if (redisUrl || redisToken) return Boolean(redisUrl && redisToken);
  return env.AUTH_ALLOW_IN_MEMORY_LIMITER === "true";
}
