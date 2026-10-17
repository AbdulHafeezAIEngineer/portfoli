import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { Client } from "pg";
if (process.env.AGENCY_TEST_DATABASE !== "isolated")
  throw new Error("Explicit isolated test database required.");
const supplied = new URL(process.env.DIRECT_URL || "");
if (
  !["localhost", "127.0.0.1"].includes(supplied.hostname) ||
  supplied.port !== "55432"
)
  throw new Error("Disposable local PostgreSQL only.");
const name = `elvora_agency_test_setup_${Date.now()}`;
const root = new URL(supplied);
root.pathname = "/postgres";
const admin = new Client({ connectionString: root.href });
await admin.connect();
await admin.query(`CREATE DATABASE ${name}`);
const url = new URL(supplied);
url.pathname = `/${name}`;
const password = `Test-Owner!9-${randomBytes(18).toString("hex")}`;
const env = {
  ...process.env,
  DATABASE_URL: url.href,
  DIRECT_URL: url.href,
  ADMIN_EMAIL: "owner@example.test",
  ADMIN_PASSWORD: password,
  NEXTAUTH_SECRET: randomBytes(48).toString("base64"),
  NEXTAUTH_URL: "https://127.0.0.1:3443",
  NEXT_PUBLIC_SITE_URL: "https://127.0.0.1:3443",
  AUTH_ALLOW_IN_MEMORY_LIMITER: "true",
  ADMIN_BOOTSTRAP_ON_BUILD: "true",
  VERCEL: "",
  VERCEL_ENV: "production",
  NODE_ENV: "production",
};
const run = (patch) =>
  spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/prepare-production.ts"],
    { env: { ...env, ...patch }, encoding: "utf8", timeout: 120000 },
  );
let db;
try {
  const badUrl = run({ DATABASE_URL: "DATABASE_URL=masked-value" });
  assert.equal(badUrl.status, 1);
  assert.match(badUrl.stderr, /complete PostgreSQL URL/);
  const weak = run({ ADMIN_PASSWORD: "lowercasepassword" });
  assert.equal(weak.status, 1);
  assert.match(weak.stderr, /uppercase letter, a number, a symbol/);
  assert.ok(!weak.stderr.includes("lowercasepassword"));
  const invalidEmail = run({ ADMIN_EMAIL: "invalid-fixture-email" });
  assert.equal(invalidEmail.status, 1);
  assert.match(invalidEmail.stderr, /ADMIN_EMAIL must contain/);
  const good = run({});
  assert.equal(good.status, 0);
  assert.match(good.stdout, /First owner account created/);
  assert.ok(!(good.stdout + good.stderr).includes(password));
  db = new Client({ connectionString: url.href });
  await db.connect();
  const before = await db.query('SELECT id, "passwordHash" FROM "AdminUser"');
  assert.equal(before.rows.length, 1);
  for (const ADMIN_PASSWORD of [
    "",
    `Another-private-fixture!8-${randomBytes(16).toString("hex")}`,
  ]) {
    const preserved = run({ ADMIN_PASSWORD });
    assert.equal(preserved.status, 0);
    assert.match(preserved.stdout, /Existing administrator preserved/);
    const after = await db.query('SELECT id, "passwordHash" FROM "AdminUser"');
    assert.deepEqual(after.rows, before.rows);
  }
  console.log(
    "PASS private setup: masked URL rejection, specific password/email errors, real migrations and first-owner creation, no secret output, existing credentials preserved.",
  );
} finally {
  await db?.end();
  await admin.query(`DROP DATABASE ${name} WITH (FORCE)`);
  await admin.end();
}
