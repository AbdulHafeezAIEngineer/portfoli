import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.NEXTAUTH_URL || "";
if (
  process.env.AGENCY_TEST_DATABASE !== "isolated" ||
  process.env.AGENCY_TEST_DATABASE_UNAVAILABLE !== "true" ||
  !/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base)
)
  throw new Error(
    "Explicit isolated local app with its disposable database stopped required.",
  );
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
    ignoreHTTPSErrors: process.env.AGENCY_TEST_TLS === "self-signed-local",
    extraHTTPHeaders: { "x-real-ip": "127.0.3.12" },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.goto(base + "/admin/login");
  await page.getByRole("button", { name: "Reject All", exact: true }).click();
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Owner sign-in is temporarily unavailable" })
    .waitFor();
  assert.equal(new URL(page.url()).pathname, "/admin/login");
  assert.equal(
    await page.getByLabel("Password", { exact: true }).inputValue(),
    process.env.ADMIN_PASSWORD,
  );
  assert.ok(!(await page.locator("body").innerText()).includes("Prisma"));
  console.log(
    "Actual database outage keeps sign-in readable and shows a safe inline failure without redirecting.",
  );
} finally {
  await browser.close();
}
