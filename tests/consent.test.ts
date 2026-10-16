import test from "node:test";
import assert from "node:assert/strict";
import { parseConsent } from "../lib/consent";
import { consentContent } from "../data/privacy";
const now = 1800000000000;
const record = (changes: Record<string, unknown> = {}) =>
  JSON.stringify({
    version: consentContent.version,
    external: false,
    updatedAt: now - 1000,
    ...changes,
  });
test("no saved choice or malformed data never enables optional embeds", () => {
  for (const raw of [
    null,
    "",
    "invalid",
    "null",
    "[]",
    "true",
    "{}",
    record({ external: "true" }),
    record({ external: 1 }),
    record({ updatedAt: "today" }),
  ])
    assert.equal(parseConsent(raw, now), null);
});
test("a genuine saved rejection remains a valid choice without granting optional permission", () => {
  assert.deepEqual(parseConsent(record(), now), {
    version: consentContent.version,
    external: false,
    updatedAt: now - 1000,
  });
});
test("explicit current permission enables only its declared external category", () => {
  assert.equal(
    parseConsent(record({ external: true, analytics: true }), now)?.external,
    true,
  );
  assert.equal(
    "analytics" in
      parseConsent(record({ external: true, analytics: true }), now)!,
    false,
  );
});
test("expired, future and superseded consent requires a new choice", () => {
  const expires = consentContent.retentionDays * 86400000;
  assert.equal(
    parseConsent(record({ external: true, updatedAt: now - expires }), now),
    null,
  );
  assert.equal(
    parseConsent(record({ external: true, updatedAt: now + 1 }), now),
    null,
  );
  assert.equal(
    parseConsent(
      record({ external: true, version: consentContent.version + 1 }),
      now,
    ),
    null,
  );
  assert.equal(
    parseConsent(record({ external: true, updatedAt: now - expires + 1 }), now)
      ?.external,
    true,
  );
});
