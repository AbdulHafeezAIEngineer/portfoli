import test from "node:test";
import assert from "node:assert/strict";
import { submitAdminLogin } from "../lib/admin/login-client";
import { adminContent as copy } from "../data/admin";
const fields = {
  email: "owner@example.test",
  password: "Explicit-test-fixture-only!9",
  code: "",
};
function fixture(responses: Response[]) {
  const calls: { input: string; init: RequestInit | undefined }[] = [];
  const fetcher = (async (input, init) => {
    calls.push({ input: String(input), init });
    const response = responses.shift();
    if (!response) throw new Error("Unexpected request");
    return response;
  }) as typeof fetch;
  return { calls, fetcher };
}
test("missing server auth configuration produces a visible error without a provider/error redirect", async () => {
  const f = fixture([
    Response.json({ message: "Private upstream detail" }, { status: 500 }),
  ]);
  await assert.rejects(submitAdminLogin(fields, f.fetcher), {
    message: copy.loginUnavailable,
  });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].input, "/api/auth/csrf");
  assert.equal(f.calls[0].init?.redirect, "error");
});
test("incorrect credentials, infrastructure outage and throttling have distinct safe messages", async () => {
  for (const [code, expected] of [
    ["CredentialsSignin", copy.loginError],
    ["AdminUnavailable", copy.loginUnavailable],
    ["AdminRateLimited", copy.loginLimited],
    ["private-unexpected-detail", copy.loginUnavailable],
  ]) {
    const f = fixture([
      Response.json({ csrfToken: "explicit-test-csrf" }),
      Response.json(
        { url: `https://site.example/admin/login?error=${code}` },
        { status: 401 },
      ),
    ]);
    await assert.rejects(submitAdminLogin(fields, f.fetcher), {
      message: expected,
    });
    assert.equal(f.calls.length, 2);
  }
});
test("success requires both CSRF-protected credential acceptance and a saved authorized session", async () => {
  const f = fixture([
    Response.json({ csrfToken: "explicit-test-csrf" }),
    Response.json({ url: "https://site.example/admin" }),
    Response.json({ projects: 0 }),
  ]);
  await submitAdminLogin(fields, f.fetcher);
  assert.deepEqual(
    f.calls.map((call) => call.input),
    [
      "/api/auth/csrf",
      "/api/auth/callback/credentials",
      "/api/admin/dashboard",
    ],
  );
  const body = f.calls[1].init?.body as URLSearchParams;
  assert.equal(body.get("csrfToken"), "explicit-test-csrf");
  assert.equal(body.get("email"), fields.email);
  assert.equal(body.get("callbackUrl"), "/admin");
  assert.equal(f.calls[1].init?.credentials, "same-origin");
});
test("callback success with a missing cookie stays on login with session guidance", async () => {
  const f = fixture([
    Response.json({ csrfToken: "explicit-test-csrf" }),
    Response.json({ url: "https://site.example/admin" }),
    Response.json({ error: "Please sign in again." }, { status: 401 }),
  ]);
  await assert.rejects(submitAdminLogin(fields, f.fetcher), {
    message: copy.loginSessionError,
  });
});
test("malformed CSRF or callback responses do not establish a session", async () => {
  for (const responses of [
    [Response.json({})],
    [Response.json({ csrfToken: "fixture" }), Response.json({})],
  ]) {
    const f = fixture(responses);
    await assert.rejects(submitAdminLogin(fields, f.fetcher), {
      message: copy.loginUnavailable,
    });
    assert.ok(!f.calls.some((call) => call.input === "/api/admin/dashboard"));
  }
});
