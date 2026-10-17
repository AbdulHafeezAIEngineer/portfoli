import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.NEXTAUTH_URL || "";
const unconfigured = process.env.AGENCY_TEST_UNCONFIGURED_URL || "";
const local = (value) =>
  /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(value);
if (
  process.env.AGENCY_TEST_DATABASE !== "isolated" ||
  !local(base) ||
  !local(unconfigured)
)
  throw new Error(
    "Explicit isolated local configured and unconfigured apps required.",
  );
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const errors = [];
async function context() {
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: process.env.AGENCY_TEST_TLS === "self-signed-local",
    extraHTTPHeaders: { "x-real-ip": "127.0.2.11" },
  });
  const p = await ctx.newPage();
  p.setDefaultTimeout(12000);
  p.on("pageerror", (error) => errors.push(error.message));
  await p.goto(base + "/admin/login");
  if (
    await p.getByRole("button", { name: "Reject All", exact: true }).isVisible()
  )
    await p.getByRole("button", { name: "Reject All", exact: true }).click();
  return { ctx, p };
}
try {
  const bare = await browser.newContext();
  const bp = await bare.newPage();
  await bp.goto(unconfigured + "/admin/login");
  assert.equal(
    await bp
      .getByRole("heading", { name: "Owner sign-in needs setup" })
      .isVisible(),
    true,
  );
  assert.equal(
    await bp.getByRole("button", { name: "Sign in", exact: true }).isDisabled(),
    true,
  );
  assert.equal(
    await bp.getByLabel("Admin email", { exact: true }).inputValue(),
    "abdulhafeez@elvoraai.online",
  );
  await bp.getByRole("button", { name: "Check again", exact: true }).click();
  assert.equal(new URL(bp.url()).pathname, "/admin/login");
  await bare.close();
  console.log(
    "Unconfigured deployment displays setup guidance and cannot enter the redirect loop.",
  );

  const { ctx, p } = await context();
  await p
    .getByLabel("Password", { exact: true })
    .fill("Wrong-test-fixture-password!9");
  await p.getByRole("button", { name: "Sign in", exact: true }).click();
  await p
    .getByRole("alert")
    .filter({ hasText: "Sign-in details were not accepted" })
    .waitFor();
  assert.equal(new URL(p.url()).pathname, "/admin/login");
  assert.equal(
    await p.getByLabel("Password", { exact: true }).inputValue(),
    "Wrong-test-fixture-password!9",
  );
  await p
    .getByLabel("Password", { exact: true })
    .fill(process.env.ADMIN_PASSWORD);
  await p.getByRole("button", { name: "Sign in", exact: true }).click();
  await p.waitForURL("**/admin");
  await p.getByRole("heading", { name: "Dashboard", exact: true }).waitFor();
  await p.getByRole("button", { name: "Sign out", exact: true }).click();
  await p.waitForURL("**/admin/login");
  await ctx.close();
  console.log(
    "Business owner created by private build setup signs in to the real dashboard; wrong password feedback and logout pass.",
  );

  const dropped = await context();
  await dropped.p.route("**/api/auth/callback/credentials", async (route) => {
    const response = await route.fetch();
    const headers = response.headers();
    delete headers["set-cookie"];
    await dropped.ctx.clearCookies({ name: "__Secure-elvora.session-token" });
    await route.fulfill({ response, headers });
  });
  await dropped.p
    .getByLabel("Password", { exact: true })
    .fill(process.env.ADMIN_PASSWORD);
  await dropped.p.getByRole("button", { name: "Sign in", exact: true }).click();
  await dropped.p
    .getByRole("alert")
    .filter({ hasText: "Your sign-in session could not be saved" })
    .waitFor();
  assert.equal(new URL(dropped.p.url()).pathname, "/admin/login");
  await dropped.ctx.close();
  console.log(
    "An explicitly dropped session cookie produces visible guidance instead of a dashboard/login loop.",
  );

  const outage = await context();
  await outage.p.route("**/api/auth/csrf", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Private fixture detail" }),
    }),
  );
  await outage.p
    .getByLabel("Password", { exact: true })
    .fill("Test-only-never-a-real-password!9");
  await outage.p.getByRole("button", { name: "Sign in", exact: true }).click();
  await outage.p
    .getByRole("alert")
    .filter({ hasText: "Owner sign-in is temporarily unavailable" })
    .waitFor();
  assert.equal(new URL(outage.p.url()).pathname, "/admin/login");
  assert.ok(
    !(await outage.p.locator("body").innerText()).includes(
      "Private fixture detail",
    ),
  );
  await outage.p.unroute("**/api/auth/csrf");
  await outage.p.goto(base + "/admin/login?error=AdminUnavailable");
  await outage.p
    .getByRole("alert")
    .filter({ hasText: "Owner sign-in is temporarily unavailable" })
    .waitFor();
  await outage.ctx.close();
  assert.deepEqual(errors, []);
  console.log(
    "Authentication outage and old error redirects show safe messages with no page/hydration errors.",
  );
} finally {
  await browser.close();
}
