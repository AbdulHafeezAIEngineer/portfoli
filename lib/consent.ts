import { consentContent } from "@/data/privacy";
export type ConsentRecord = {
  version: number;
  external: boolean;
  updatedAt: number;
};
export function parseConsent(
  raw: string | null,
  now = Date.now(),
): ConsentRecord | null {
  if (!raw) return null;
  try {
    const record: unknown = JSON.parse(raw);
    if (!record || typeof record !== "object") return null;
    const value = record as Partial<ConsentRecord>;
    if (
      value.version !== consentContent.version ||
      typeof value.external !== "boolean" ||
      typeof value.updatedAt !== "number" ||
      !Number.isFinite(value.updatedAt)
    )
      return null;
    const age = now - value.updatedAt;
    if (age < 0 || age >= consentContent.retentionDays * 86400000) return null;
    return {
      version: value.version,
      external: value.external,
      updatedAt: value.updatedAt,
    };
  } catch {
    return null;
  }
}
