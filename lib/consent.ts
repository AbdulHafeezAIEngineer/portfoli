import { consentContent } from "@/data/privacy";
export type ConsentRecord = {
  version: number;
  external: boolean;
  updatedAt: number;
};
export function parseStoredConsent(
  raw: string | null,
  now: number,
  version: number,
  retentionDays: number,
): ConsentRecord | null {
  if (!raw) return null;
  try {
    const record: unknown = JSON.parse(raw);
    if (!record || typeof record !== "object") return null;
    const value = record as Partial<ConsentRecord>;
    if (
      value.version !== version ||
      typeof value.external !== "boolean" ||
      typeof value.updatedAt !== "number" ||
      !Number.isFinite(value.updatedAt)
    )
      return null;
    const age = now - value.updatedAt;
    if (age < 0 || age >= retentionDays * 86400000) return null;
    return {
      version: value.version,
      external: value.external,
      updatedAt: value.updatedAt,
    };
  } catch {
    return null;
  }
}

export function parseConsent(raw: string | null, now = Date.now()) {
  return parseStoredConsent(
    raw,
    now,
    consentContent.version,
    consentContent.retentionDays,
  );
}
export function consentVisibilityScript() {
  return `(function(){var valid=false;try{valid=!!(${parseStoredConsent.toString()})(localStorage.getItem(${JSON.stringify(consentContent.key)}),Date.now(),${consentContent.version},${consentContent.retentionDays});}catch(e){}document.documentElement.dataset.consentChoice=valid?'saved':'needed';})();`;
}
