import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nativeRequire = createRequire(import.meta.url);

function fixture(options = {}) {
  const calls = [];
  const mails = [];
  const transports = [];
  const stored = [];
  const deliveries = [];
  const env = {
    NODE_ENV: "test",
    CONTACT_TURNSTILE_REQUIRED: "false",
    GMAIL_APP_PASSWORD: "unit-test-placeholder",
    ...options.env,
  };
  const context = vm.createContext({
    console,
    Request,
    Response,
    Headers,
    URL,
    AbortSignal,
    TextDecoder,
    Uint8Array,
    setTimeout,
    clearTimeout,
    process: { env },
    fetch: async (url, init) => {
      calls.push({ url: String(url), init, body: JSON.parse(init.body) });
      return options.fetch
        ? options.fetch(url, init)
        : Response.json({ result: [1, 0] });
    },
  });
  // Freeze quota time so minute/day boundary timing cannot make limits flaky.
  vm.runInContext("Date.now = () => 1792054800000;", context);
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(root, file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} };
    cache.set(absolute, module);
    const source = fs.readFileSync(absolute, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    });
    const localRequire = (id) => {
      if (id === "@/lib/records")
        return {
          async recordContact(fields) {
            if (options.storageFailure)
              throw new Error("private database error");
            stored.push(fields);
            return "fixture-inquiry";
          },
          async markDelivery(id, status) {
            if (options.statusFailure) throw new Error("private status error");
            deliveries.push({ id, status });
          },
        };
      if (id === "server-only") return {};
      if (id === "gmail-smtp")
        return {
          createTransport(config) {
            transports.push(config);
            return {
              async sendMail(mail) {
                mails.push(mail);
                return options.send
                  ? options.send(mail)
                  : { accepted: ["abdulhafeez@elvoraai.online"], rejected: [] };
              },
              close() {},
            };
          },
        };
      if (id.startsWith("@/")) return load(`${id.slice(2)}.ts`);
      if (id.startsWith("."))
        return load(`${path.resolve(path.dirname(absolute), id)}.ts`);
      return nativeRequire(id);
    };
    vm.runInContext(
      `(function(require,module,exports){${outputText}\n})`,
      context,
      { filename: absolute },
    )(localRequire, module, module.exports);
    return module.exports;
  }
  const route = load("app/api/contact/route.ts");
  function post(body = valid, headers = {}) {
    return route.POST(
      new Request("https://portfolio.example/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    );
  }
  return { calls, mails, transports, stored, deliveries, env, load, post };
}

const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  message: "I would like to discuss a new website for my business.",
  website: "",
};

test("validated mail uses the public domain recipient and separate Gmail sender, plaintext, safe reply-to and verified TLS", async () => {
  const f = fixture();
  const response = await f.post({
    ...valid,
    name: " Test Visitor ",
    email: " Visitor@Example.com ",
  });
  assert.equal(response.status, 202);
  assert.equal((await response.json()).ok, true);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const mail = f.mails[0];
  assert.equal(mail.to, "abdulhafeez@elvoraai.online");
  assert.equal(mail.from.address, "buildwithelvora@gmail.com");
  assert.equal(mail.replyTo, "visitor@example.com");
  assert.equal(mail.subject, "Elvora enquiry from Test Visitor");
  assert.equal(mail.html, undefined);
  assert.ok(mail.text.endsWith(valid.message));
  assert.equal(f.transports[0].host, "smtp.gmail.com");
  assert.equal(f.transports[0].secure, true);
  assert.equal(f.transports[0].tls.rejectUnauthorized, true);
});

test("invalid input, header injection, extra recipients and oversized bodies never reach SMTP", async () => {
  const f = fixture();
  for (const body of [
    null,
    {},
    { ...valid, name: "A" },
    { ...valid, name: "Name\r\nBcc: x@example.com" },
    { ...valid, email: "a@b" },
    { ...valid, message: "short" },
    { ...valid, message: "x".repeat(3001) },
    { ...valid, name: "x".repeat(81) },
    { ...valid, to: "attacker@example.com" },
    { ...valid, website: 12 },
  ])
    assert.equal((await f.post(body)).status, 422);
  assert.equal((await f.post("not-json")).status, 400);
  assert.equal((await f.post("x".repeat(32769))).status, 413);
  assert.equal(
    (await f.post(valid, { "Content-Type": "text/plain" })).status,
    415,
  );
  assert.equal(f.mails.length, 0);
});

test("cross-site requests are rejected; filled honeypots are quietly discarded", async () => {
  const f = fixture();
  assert.equal(
    (await f.post(valid, { Origin: "https://attacker.example" })).status,
    403,
  );
  assert.equal(
    (await f.post(valid, { "Sec-Fetch-Site": "cross-site" })).status,
    403,
  );
  assert.equal(
    (await f.post({ ...valid, website: "spam.example" })).status,
    202,
  );
  assert.equal(f.mails.length, 0);
});

test("missing Gmail credentials fail honestly without consuming quota", async () => {
  const f = fixture({ env: { GMAIL_APP_PASSWORD: "" } });
  for (let i = 0; i < 5; i++) assert.equal((await f.post()).status, 503);
  assert.equal(f.mails.length, 0);
});

test("visitor limits and global caps reject excess mail with Retry-After", async () => {
  const f = fixture();
  for (let i = 0; i < 3; i++) assert.equal((await f.post()).status, 202);
  const response = await f.post();
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
  assert.equal(f.mails.length, 3);
  const capped = fixture({ env: { CONTACT_DAILY_SEND_CAP: "1" } });
  assert.equal((await capped.post()).status, 202);
  assert.equal((await capped.post()).status, 429);
});

test("production requires shared protection or explicit single-process fallback", async () => {
  const f = fixture({ env: { NODE_ENV: "production" } });
  assert.equal((await f.post()).status, 503);
  assert.equal(f.mails.length, 0);
  const memory = fixture({
    env: { NODE_ENV: "production", CONTACT_ALLOW_IN_MEMORY_LIMITER: "true" },
  });
  assert.equal((await memory.post()).status, 202);
  const shared = fixture({
    env: {
      NODE_ENV: "production",
      CHAT_REDIS_REST_URL: "https://store.example",
      CHAT_REDIS_REST_TOKEN: "test-only",
    },
  });
  assert.equal((await shared.post()).status, 202);
  assert.equal(shared.calls[0].body[0], "EVAL");
  assert.ok(shared.calls[0].body[3].startsWith("elvora:contact:"));
});

test("Redis denial, outage and invalid responses never bypass protection", async () => {
  for (const result of [[0, 90], null, [2, 0]]) {
    const f = fixture({
      env: {
        CONTACT_REDIS_REST_URL: "https://store.example",
        CONTACT_REDIS_REST_TOKEN: "test",
      },
      fetch: async () => Response.json({ result }),
    });
    assert.equal((await f.post()).status, result?.[0] === 0 ? 429 : 503);
    assert.equal(f.mails.length, 0);
  }
  const f = fixture({
    env: {
      CONTACT_REDIS_REST_URL: "https://store.example",
      CONTACT_REDIS_REST_TOKEN: "test",
    },
    fetch: async () => {
      throw new Error("private upstream failure");
    },
  });
  assert.equal((await f.post()).status, 503);
});

test("SMTP rejection and failure never report success or expose upstream errors", async () => {
  for (const send of [
    async () => {
      throw new Error("private secret");
    },
    async () => ({ accepted: [], rejected: [valid.email] }),
  ]) {
    const f = fixture({ send });
    const response = await f.post();
    assert.equal(response.status, 502);
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.ok(!JSON.stringify(body).includes("private secret"));
  }
});

test("concurrency slots can be released and reused", async () => {
  const f = fixture();
  const limiter = f.load("lib/contact/rate-limit.ts");
  const first = limiter.acquireContactSlot();
  const second = limiter.acquireContactSlot();
  assert.equal((await f.post()).status, 429);
  first();
  second();
  assert.equal((await f.post()).status, 202);
});

test("database acceptance works without SMTP and records the actual optional fields", async () => {
  const f = fixture({
    env: { CONTACT_STORAGE: "database", GMAIL_APP_PASSWORD: "" },
  });
  const result = await f.post({
    ...valid,
    company: "Example studio",
    service: "web",
  });
  assert.equal(result.status, 202);
  assert.deepEqual(await result.json(), {
    ok: true,
    acceptance: "stored",
    notification: "not-configured",
  });
  assert.equal(f.stored.length, 1);
  assert.equal(f.stored[0].company, "Example studio");
  assert.equal(f.stored[0].service, "web");
  assert.equal(f.mails.length, 0);
});
test("SMTP failure after durable storage reports stored acceptance without claiming email delivery", async () => {
  const f = fixture({
    env: { CONTACT_STORAGE: "database" },
    send: async () => {
      throw new Error("private SMTP error");
    },
  });
  const response = await f.post();
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.acceptance, "stored");
  assert.equal(body.notification, "failed");
  assert.equal(f.stored.length, 1);
});
test("database write failure never sends mail or reports success", async () => {
  const f = fixture({
    env: { CONTACT_STORAGE: "database" },
    storageFailure: true,
  });
  const response = await f.post();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(f.mails.length, 0);
});
test("optional fields reject unbounded and unsupported values before writing", async () => {
  const f = fixture({ env: { CONTACT_STORAGE: "database" } });
  for (const body of [
    { ...valid, company: "a".repeat(151) },
    { ...valid, service: "unknown" },
    { ...valid, company: "bad\r\nBcc: test" },
  ])
    assert.equal((await f.post(body)).status, 422);
  assert.equal(f.stored.length, 0);
});
