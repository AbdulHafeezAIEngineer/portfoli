import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { consentVisibilityScript, parseConsent } from "../lib/consent";
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

test("initial visibility script shares expiry and version validation without granting permission", () => {
  const samples = [
    null,
    "bad",
    JSON.stringify({
      version: consentContent.version,
      external: false,
      updatedAt: Date.now() - 1000,
    }),
    JSON.stringify({
      version: consentContent.version,
      external: true,
      updatedAt: Date.now() + 86400000,
    }),
  ];
  for (const raw of samples) {
    const dataset: Record<string, string> = {};
    vm.runInNewContext(consentVisibilityScript(), {
      document: { documentElement: { dataset } },
      localStorage: { getItem: () => raw },
    });
    assert.equal(dataset.consentChoice, parseConsent(raw) ? "saved" : "needed");
  }
  const dataset: Record<string, string> = {};
  vm.runInNewContext(consentVisibilityScript(), {
    document: { documentElement: { dataset } },
    localStorage: {
      getItem: () => {
        throw new Error("storage blocked");
      },
    },
  });
  assert.equal(dataset.consentChoice, "needed");
});
