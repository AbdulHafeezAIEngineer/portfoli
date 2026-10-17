import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw new Error("Local production app required.");
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const touch of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: touch ? 390 : 1440, height: 900 },
      hasTouch: touch,
      isMobile: touch,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    await page.getByLabel("Animation preference").selectOption("full");
    const logo = page.locator("[data-logo-flip]");
    assert.equal(await logo.locator(".emblem-face").count(), 2);
    assert.equal(
      await logo
        .locator(".emblem-face-back")
        .evaluate((el) => getComputedStyle(el).backfaceVisibility),
      "hidden",
    );
    await logo.evaluate((el) => {
      const scene = el.closest(".hero-emblem");
      const top = scene.getBoundingClientRect().top + scrollY + el.offsetTop;
      window.scrollTo({
        top: Math.max(120, top - innerHeight * 0.4),
        behavior: "instant",
      });
    });
    await page.waitForFunction(
      () =>
        parseFloat(
          document
            .querySelector("[data-logo-flip]")
            .style.getPropertyValue("--logo-turn"),
        ) > 0,
    );
    await page.waitForFunction(
      () =>
        document.querySelector("[data-logo-flip]").dataset.logoVisible ===
        "true",
    );
    assert.equal(
      await logo
        .locator(".emblem-shine")
        .first()
        .evaluate((el) => getComputedStyle(el).animationPlayState),
      "running",
    );
    const paragraph = page.locator(".about-story [data-reading-text]").nth(1);
    await paragraph.scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      document
        .querySelectorAll(".about-story [data-reading-text]")[1]
        .closest("[data-reveal]")
        .classList.contains("is-revealed"),
    );
    await paragraph.evaluate(async (el) => {
      const reveal = el.closest("[data-reveal]");
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      await Promise.all(
        reveal
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    const geometry = await paragraph.evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.getBoundingClientRect().height,
      total: el.querySelectorAll(".reading-word").length,
      width: el.querySelector(".reading-word").getBoundingClientRect().width,
    }));
    async function readAt(viewportPosition) {
      await page.evaluate(
        ({ top, viewportPosition }) =>
          window.scrollTo({
            top: top - innerHeight * viewportPosition,
            behavior: "instant",
          }),
        { ...geometry, viewportPosition },
      );
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
          ),
      );
      return paragraph.locator(".is-read").count();
    }
    const first = await readAt(0.75);
    const later = await readAt(0.2);
    assert.ok(
      later > first + geometry.total * 0.4,
      "Words brighten in reading order as scroll advances.",
    );
    assert.ok(
      Math.abs(
        (await paragraph
          .locator(".reading-word")
          .first()
          .evaluate((el) => el.getBoundingClientRect().width)) - geometry.width,
      ) < 0.1,
      "Emphasis must not change word width.",
    );
    const reversed = await readAt(0.75);
    assert.ok(
      Math.abs(reversed - first) <= 2,
      "Returning to the same reading position restores the earlier emphasis.",
    );
    assert.equal(await logo.getAttribute("data-logo-visible"), "false");
    assert.equal(
      await logo
        .locator(".emblem-shine")
        .first()
        .evaluate((el) => getComputedStyle(el).animationPlayState),
      "paused",
    );
    await page.getByLabel("Animation preference").selectOption("reduced");
    await page.waitForFunction(
      () => !document.querySelector("[data-reading-active]"),
    );
    assert.equal(
      await logo.evaluate((el) => el.style.getPropertyValue("--logo-turn")),
      "",
    );
    assert.equal(
      await logo
        .locator(".emblem-shine")
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    assert.ok(
      await page
        .getByRole("heading", { name: "Wall of love.", exact: true })
        .isVisible(),
    );
    assert.equal(
      await page.locator(".love-card").count(),
      0,
      "No invented reviews in file mode.",
    );
    assert.equal(await page.locator(".love-empty").count(), 1);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    assert.deepEqual(errors, []);
    await context.close();
    console.log(
      `PASS ${touch ? "touch" : "desktop"}: two-face flip, visible-only shine, reversible reading emphasis, stable word widths, reduced-motion cleanup and honest review empty state.`,
    );
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const page = await nojs.newPage();
  await page.goto(base);
  assert.ok(
    await page.locator(".about-story .reading-base").first().isVisible(),
  );
  assert.ok(
    await page
      .locator(".about-story .reading-text > .sr-only")
      .first()
      .textContent(),
  );
  await nojs.close();
  console.log(
    "PASS server-rendered reading text stays available without JavaScript.",
  );
} finally {
  await browser.close();
}
