import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes, createHmac } from "node:crypto";
import { request } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
const base = process.env.NEXTAUTH_URL || "";
const url = new URL(process.env.DATABASE_URL || "https://invalid");
if (
  process.env.AGENCY_TEST_DATABASE !== "isolated" ||
  !/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base) ||
  url.hostname !== "127.0.0.1" ||
  !url.pathname.startsWith("/elvora_agency_test")
)
  throw new Error("Explicit isolated local fixture required.");
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  log: [],
});
let count = 20;
async function ctx() {
  return request.newContext({
    baseURL: base,
    ignoreHTTPSErrors: process.env.AGENCY_TEST_TLS === "self-signed-local",
    extraHTTPHeaders: { "x-real-ip": `127.0.1.${count++}` },
  });
}
async function login(client, password = process.env.ADMIN_PASSWORD, code = "") {
  const csrf = await (await client.get("/api/auth/csrf")).json();
  await client.post("/api/auth/callback/credentials", {
    form: {
      csrfToken: csrf.csrfToken,
      email: process.env.ADMIN_EMAIL,
      password,
      code,
      json: "true",
      callbackUrl: base + "/admin",
    },
  });
  return (await client.get("/api/admin/dashboard")).status();
}
function codeAt(secret, step) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0,
    value = 0;
  const bytes = [];
  for (const c of secret) {
    value = (value << 5) | alphabet.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = createHmac("sha1", Buffer.from(bytes))
    .update(counter)
    .digest();
  const offset = digest[19] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(
    6,
    "0",
  );
}
const mutate = (client, data) =>
  client.post("/api/admin/security", {
    headers: { Origin: base },
    data: {
      currentPassword: process.env.ADMIN_PASSWORD,
      newPassword: "",
      code: "",
      ...data,
    },
  });
test("database-backed two-factor and password lifecycle invalidate previous sessions", async (t) => {
  const clients = [];
  const make = async () => {
    const client = await ctx();
    clients.push(client);
    return client;
  };
  try {
    const first = await make();
    assert.equal(await login(first), 200);
    await t.test(
      "authenticator confirmation requires a valid code and invalidates the current session",
      async () => {
        const setup = await mutate(first, { operation: "totp-setup" });
        assert.equal(setup.status(), 200);
        const data = await setup.json();
        assert.ok(data.secret);
        globalThis.fixtureTotp = data;
        assert.equal(
          (
            await mutate(first, {
              operation: "totp-confirm",
              ticket: data.ticket,
              code: "bad",
            })
          ).status(),
          422,
        );
        const step = Math.floor(Date.now() / 30000) - 1;
        assert.equal(
          (
            await mutate(first, {
              operation: "totp-confirm",
              ticket: data.ticket,
              code: codeAt(data.secret, step),
            })
          ).status(),
          200,
        );
        assert.equal((await first.get("/api/admin/dashboard")).status(), 401);
      },
    );
    await t.test(
      "password alone is rejected, a fresh authenticator code signs in, disabling revokes the session",
      async () => {
        const alone = await make();
        assert.equal(await login(alone), 401);
        const second = await make();
        const setup = globalThis.fixtureTotp;
        assert.equal(
          await login(
            second,
            process.env.ADMIN_PASSWORD,
            codeAt(setup.secret, Math.floor(Date.now() / 30000)),
          ),
          200,
        );
        assert.equal(
          (
            await mutate(second, {
              operation: "totp-disable",
              code: codeAt(setup.secret, Math.floor(Date.now() / 30000) + 1),
            })
          ).status(),
          200,
        );
        assert.equal((await second.get("/api/admin/dashboard")).status(), 401);
      },
    );
    await t.test(
      "password changes reject the old password and revoke captured sessions",
      async () => {
        const third = await make();
        assert.equal(await login(third), 200);
        const next = "Fixture!8" + randomBytes(18).toString("hex");
        assert.equal(
          (
            await mutate(third, { operation: "password", newPassword: next })
          ).status(),
          200,
        );
        assert.equal((await third.get("/api/admin/dashboard")).status(), 401);
        const old = await make();
        assert.equal(await login(old), 401);
        const fresh = await make();
        assert.equal(await login(fresh, next), 200);
      },
    );
  } finally {
    // This reset is restricted above to the disposable local fixture account and database.
    await db.adminUser.update({
      where: { email: process.env.ADMIN_EMAIL },
      data: {
        passwordHash: await hash(process.env.ADMIN_PASSWORD, 12),
        totpSecret: null,
        totpLastStep: null,
        passwordVersion: { increment: 1 },
        failedAttempts: 0,
        lockedUntil: null,
      },
    });
    delete globalThis.fixtureTotp;
    for (const client of clients) await client.dispose();
    await db.$disconnect();
  }
});
