import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw new Error("Local unconfigured production app required.");
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [360, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    const submissions = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.url().includes("/api/auth/callback/credentials"))
        submissions.push(request.url());
    });
    await page.goto(base + "/admin/login");
    const reject = page.getByRole("button", { name: "Reject All", exact: true });
    if (await reject.isVisible()) await reject.click();
    await page
      .getByRole("heading", { name: "Owner sign-in needs setup" })
      .waitFor();
    const email = page.getByLabel("Admin email", { exact: true });
    const password = page.getByLabel("Password", { exact: true });
    await email.fill("owner@example.test");
    await password.fill("Explicit-test-fixture-only!9");
    assert.equal(await password.inputValue(), "Explicit-test-fixture-only!9");
    assert.equal(await password.getAttribute("type"), "password");
    await page
      .getByRole("button", { name: "Show password", exact: true })
      .click();
    assert.equal(await password.getAttribute("type"), "text");
    await page
      .getByRole("button", { name: "Hide password", exact: true })
      .click();
    assert.equal(await password.getAttribute("type"), "password");
    const code = page.getByLabel("Authenticator code (if enabled)");
    assert.equal(await code.isVisible(), false);
    await page
      .getByText("Use an authenticator code (optional)", { exact: true })
      .click();
    assert.ok(await code.isVisible());
    assert.equal(await code.getAttribute("required"), null);
    assert.equal(await code.inputValue(), "");
    assert.equal(
      await page
        .getByRole("button", { name: "Sign in", exact: true })
        .isDisabled(),
      true,
    );
    await password.press("Enter");
    assert.equal(new URL(page.url()).pathname, "/admin/login");
    assert.equal(
      submissions.length,
      0,
      "Incomplete setup must not submit credentials.",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}px: editable credentials, password reveal, optional authenticator, setup submission guard, no overflow or browser errors.`,
    );
  }
} finally {
  await browser.close();
}
