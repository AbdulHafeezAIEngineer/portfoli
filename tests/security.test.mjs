import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const nativeRequire = createRequire(import.meta.url);
function fixture(options = {}) {
  const context = vm.createContext({
    Buffer,
    URL,
    URLSearchParams,
    Request,
    Response,
    Headers,
    AbortSignal,
    setTimeout,
    clearTimeout,
    process: {
      env: {
        NODE_ENV: "test",
        TOTP_ENCRYPTION_KEY: Buffer.alloc(32, 7).toString("base64"),
        ...options.env,
      },
    },
    fetch:
      options.fetch ||
      (async () =>
        Response.json({
          success: true,
          hostname: "elvora.example",
          action: "contact",
        })),
  });
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} };
    cache.set(absolute, module);
    const { outputText } = ts.transpileModule(
      fs.readFileSync(absolute, "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      },
    );
    const require = (id) => {
      if (id === "server-only") return {};
      if (id === "@/lib/db") return { db: {} };
      if (id.startsWith("@/")) return load(`${id.slice(2)}.ts`);
      if (id.startsWith("."))
        return load(`${path.resolve(path.dirname(absolute), id)}.ts`);
      return nativeRequire(id);
    };
    vm.runInContext(
      `(function(require,module,exports){${outputText}\n})`,
      context,
    )(require, module, module.exports);
    return module.exports;
  }
  return { load, context };
}

test("strong passwords enforce bcrypt byte limits and character diversity", () => {
  const { strongPassword } = fixture().load("lib/admin/password.ts");
  assert.equal(strongPassword("shortA1!"), false);
  assert.equal(strongPassword("aaaaaaaaaaaaaaa"), false);
  assert.equal(strongPassword("A-long-random-passphrase-92!"), true);
  assert.equal(strongPassword(`Aa1!${"界".repeat(24)}`), false);
});

test("TOTP matches RFC 6238 vectors; malformed/incorrect codes fail", () => {
  const f = fixture();
  vm.runInContext("Date.now=()=>59000", f.context);
  const { matchingStep } = f.load("lib/admin/totp.ts");
  assert.equal(matchingStep("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", "287082"), 1);
  assert.equal(
    matchingStep("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", "000000"),
    null,
  );
  assert.equal(
    matchingStep("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", "2870820"),
    null,
  );
});

test("2FA encryption authenticates ciphertext and rejects tampering or missing keys", () => {
  const { seal, unseal } = fixture().load("lib/admin/totp.ts");
  const sealed = seal({ purpose: "test", secret: "not-a-real-secret" });
  assert.equal(unseal(sealed).secret, "not-a-real-secret");
  const bytes = Buffer.from(sealed, "base64url");
  bytes[bytes.length - 1] ^= 1;
  assert.throws(() => unseal(bytes.toString("base64url")));
  assert.throws(() =>
    fixture({ env: { TOTP_ENCRYPTION_KEY: "" } })
      .load("lib/admin/totp.ts")
      .seal("test"),
  );
});

test("admin content schemas reject unsafe image URLs, config mismatch and prototype response paths", () => {
  const { schemas, imageUrl, connectionSchema } = fixture().load(
    "lib/admin/schemas.ts",
  );
  assert.equal(imageUrl.safeParse("/projects/restaurant-1.webp").success, true);
  const projectLink = schemas.projects.shape.demoUrl;
  assert.equal(projectLink.safeParse("https://elvora.pplx.app").success, true);
  assert.equal(projectLink.safeParse("/demo/restaurant").success, true);
  for (const link of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:password@example.com",
    "not-a-url",
  ])
    assert.equal(projectLink.safeParse(link).success, false);
  for (const value of [
    "javascript:alert(1)",
    "//evil.example/image.png",
    "https://evil.example/image.png",
    "/foo?x=1",
  ])
    assert.equal(imageUrl.safeParse(value).success, false);
  assert.equal(
    connectionSchema.safeParse({
      method: "api",
      endpoint: "https://provider.example/chat",
      requestField: "message",
      responsePath: "__proto__.secret",
      authHeader: "Authorization",
      authPrefix: "Bearer ",
    }).success,
    false,
  );
  assert.equal(
    schemas.skills.safeParse({
      id: "x",
      name: "Next.js",
      category: "Unknown",
      published: true,
    }).success,
    false,
  );
});

test("Turnstile checks production setup, success, action and exact hostname", async () => {
  const missing = fixture({ env: { NODE_ENV: "production" } }).load(
    "lib/contact/turnstile.ts",
  );
  await assert.rejects(
    () => missing.verifyTurnstile("token"),
    (error) => error.status === 503,
  );
  for (const result of [
    { success: false },
    { success: true, hostname: "evil.example", action: "contact" },
    { success: true, hostname: "elvora.example", action: "other" },
  ]) {
    const f = fixture({
      env: {
        TURNSTILE_SECRET_KEY: "test-only",
        NEXT_PUBLIC_SITE_URL: "https://elvora.example",
      },
      fetch: async () => Response.json(result),
    }).load("lib/contact/turnstile.ts");
    await assert.rejects(
      () => f.verifyTurnstile("token"),
      (error) => error.status === 422,
    );
  }
  const valid = fixture({
    env: {
      TURNSTILE_SECRET_KEY: "test-only",
      NEXT_PUBLIC_SITE_URL: "https://elvora.example",
    },
  }).load("lib/contact/turnstile.ts");
  await valid.verifyTurnstile("token");
});

test("uploads decode and re-encode real images while rejecting SVG, malformed and undersized files", async () => {
  const sharp = nativeRequire("sharp");
  const { encodePortfolioImage } = fixture().load("lib/admin/images.ts");
  const png = await sharp({
    create: { width: 300, height: 200, channels: 3, background: "#d4af37" },
  })
    .png()
    .toBuffer();
  const output = await encodePortfolioImage(
    new File([png], "photo.png", { type: "image/png" }),
  );
  const meta = await sharp(output).metadata();
  assert.equal(meta.format, "webp");
  assert.equal(meta.width, 300);
  assert.equal(meta.exif, undefined);
  const svg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><script>alert(1)</script></svg>',
  );
  for (const file of [
    new File([svg], "disguised.png", { type: "image/png" }),
    new File([png], "wrong.svg", { type: "image/svg+xml" }),
    new File([Buffer.alloc(50)], "broken.jpg", { type: "image/jpeg" }),
  ])
    await assert.rejects(
      () => encodePortfolioImage(file),
      (error) => error.status === 422,
    );
  const small = await sharp({
    create: { width: 50, height: 50, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  await assert.rejects(
    () =>
      encodePortfolioImage(
        new File([small], "small.png", { type: "image/png" }),
      ),
    (error) => error.status === 422,
  );
});

test("only permission-approved genuine review records can be published", () => {
  const { schemas } = fixture().load("lib/admin/schemas.ts");
  const review = {
    id: "review-fixture",
    name: "Test fixture",
    role: "Test only",
    quote: "A schema test, not customer feedback.",
    portrait: "",
    permissionConfirmed: false,
    published: false,
  };
  assert.equal(schemas.testimonials.safeParse(review).success, true);
  assert.equal(
    schemas.testimonials.safeParse({ ...review, published: true }).success,
    false,
  );
  assert.equal(
    schemas.testimonials.safeParse({
      ...review,
      published: true,
      permissionConfirmed: true,
    }).success,
    true,
  );
  assert.equal(
    schemas.testimonials.safeParse({
      ...review,
      portrait: "https://unapproved.example/portrait.jpg",
    }).success,
    false,
  );
});
