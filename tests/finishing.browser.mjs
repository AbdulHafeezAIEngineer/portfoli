import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Local production app required.");
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Reject All", exact: true }).click();
  await page.getByLabel("Animation preference").selectOption("full");
  assert.equal(await page.locator("[data-velocity-marquee]").count(), 1);
  await page.mouse.wheel(0, 350);
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-velocity-marquee]")].some((el) =>
      el.getAnimations().some((a) => a.playbackRate > 1.01),
    ),
  );
  await page.waitForFunction(() =>
    document
      .querySelector("[data-parallax=hero]")
      ?.style.getPropertyValue("--image-drift"),
  );
  await page.goto(base + "/websites");
  await page
    .getByRole("button", { name: /^View screenshots:/ })
    .first()
    .click();
  const gallery = page.getByRole("dialog");
  await gallery.waitFor();
  await page.waitForFunction(() => {
    const image = document.querySelector("dialog .gallery-media img");
    return image?.complete && image.naturalWidth > 0;
  });
  await page
    .getByRole("button", { name: "Next screenshot", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await gallery.waitFor({ state: "detached" });
  await page.goto(base + "/certificates");
  await page.locator(".certificate-preview").first().click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.goto(base + "/contact");
  await page
    .locator("#faq")
    .evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await page.waitForFunction(
    () => document.querySelector("#faq")?.dataset.faqEnhanced === "true",
  );
  const first = page.locator("#faq details").first();
  const summary = first.locator("summary");
  await summary.click();
  assert.ok(
    await first
      .locator(".faq-answer")
      .evaluate((el) => el.getAnimations().length > 0),
  );
  await first
    .locator(".faq-answer")
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  assert.equal(await first.getAttribute("open"), "");
  await summary.click();
  await first
    .locator(".faq-answer")
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  assert.equal(await first.getAttribute("open"), null);
  // A rapid reversal finishes in the requested state and releases animation handles.
  await summary.click();
  await summary.click();
  await first
    .locator(".faq-answer")
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  assert.equal(await first.getAttribute("open"), null);
  await summary.focus();
  await page.keyboard.press("Enter");
  await first
    .locator(".faq-answer")
    .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  assert.equal(await first.getAttribute("open"), "");
  await page.getByLabel("Animation preference").selectOption("reduced");
  await page.waitForFunction(
    () => !document.querySelector("#faq")?.dataset.faqEnhanced,
  );
  await summary.click();
  assert.equal(await first.getAttribute("open"), null);
  assert.equal(
    await first
      .locator(".faq-answer")
      .evaluate((el) => el.getAnimations().length),
    0,
  );
  assert.deepEqual(errors, []);
  await page.close();
  const bare = await browser.newContext({ javaScriptEnabled: false });
  const p = await bare.newPage();
  await p.goto(base + "/contact");
  const native = p.locator("#faq details").first();
  await native.locator("summary").click();
  assert.equal(await native.getAttribute("open"), "");
  assert.ok(await native.locator(".faq-answer").isVisible());
  await bare.close();
  console.log(
    "PASS velocity marquees, desktop parallax, project/certificate dialogs, ready animated FAQ, rapid reversal, keyboard operation, reduced-motion cleanup, native no-JS FAQ and zero browser errors.",
  );
} finally {
  await browser.close();
}
