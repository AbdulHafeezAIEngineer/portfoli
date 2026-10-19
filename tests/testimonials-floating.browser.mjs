import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local app required");
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const [width, osReduced] of [
    [1440, false],
    [390, false],
    [390, true],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      isMobile: width < 768,
      hasTouch: width < 768,
      reducedMotion: osReduced ? "reduce" : "no-preference",
    });
    const errors = [],
      external = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (!r.url().startsWith(base)) external.push(r.url());
    });
    await page.goto(base + "/testimonials");
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    await page.mouse.move(0, 0);
    const scene = page.locator(".testimonial-scene");
    await page.waitForFunction(
      () =>
        document.querySelector(".testimonial-scene").dataset
          .testimonialsActive === "true",
    );
    assert.equal(await page.locator(".testimonial-float").count(), 4);
    assert.equal(
      await page.locator('[data-page-shader="testimonials"]').count(),
      1,
    );
    assert.equal(await page.locator('[data-sample="true"]').count(), 4);
    assert.match(
      await page.locator(".testimonial-sample-note").innerText(),
      /fictional profiles/,
    );
    assert.equal(
      new Set(await page.locator(".testimonial-card strong").allTextContents())
        .size,
      4,
    );
    assert.equal(
      await page
        .locator('.testimonial-card img[src*="/avatars/demo-"]')
        .count(),
      4,
    );
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll(".testimonial-avatar img")].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      null,
      { polling: 100 },
    );
    const card = page.locator(".testimonial-float").first();
    const background = page.locator('[data-page-shader="testimonials"]');
    const state = async (el) =>
      el.evaluate((e) => ({
        transform: getComputedStyle(e).transform,
        play: getComputedStyle(e).animationPlayState,
        animation: getComputedStyle(e).animationName,
      }));
    const before = await state(card);
    assert.notEqual(
      await background.evaluate((e) => getComputedStyle(e).backgroundImage),
      "none",
    );
    assert.equal(before.play, "running");
    await page.waitForTimeout(500);
    assert.notEqual(
      (await state(card)).transform,
      before.transform,
      "Cards actually float",
    );
    // Real WebGPU background movement is covered by page-shaders.browser.mjs.
    // This suite also covers browsers that retain the static shader artwork.
    const activate = async (button) =>
      width < 768 ? button.tap() : button.click();
    await activate(
      page.getByRole("button", {
        name: "Pause testimonial animations",
        exact: true,
      }),
    );
    await page.waitForFunction(
      () =>
        document.querySelector(".testimonial-scene").dataset
          .testimonialsActive === "false",
    );
    const stopped = await state(card);
    assert.equal(stopped.play, "paused");
    await page.waitForTimeout(250);
    assert.equal((await state(card)).transform, stopped.transform);

    await activate(
      page.getByRole("button", {
        name: "Resume testimonial animations",
        exact: true,
      }),
    );
    await page.mouse.move(0, 0);
    await page.waitForFunction(
      () =>
        document.querySelector(".testimonial-scene").dataset
          .testimonialsActive === "true",
    );
    if (width === 1440) {
      const box = await card.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      assert.equal(
        (await state(card)).play,
        "paused",
        "Hover pauses for reading",
      );
      await page.mouse.move(0, 0);
      assert.equal((await state(card)).play, "running");
    }
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
    }
    if (!osReduced)
      await page.screenshot({
        path: `docs/testimonials-floating-${width}.png`,
        fullPage: true,
      });
    await page.getByLabel("Animation preference").selectOption("reduced");
    assert.equal((await state(card)).animation, "none");

    assert.ok(
      await page
        .getByRole("button", {
          name: "Pause testimonial animations",
          exact: true,
        })
        .isDisabled(),
    );
    await page.getByLabel("Animation preference").selectOption("full");
    await page.evaluate(() =>
      scrollTo({
        top: document.querySelector(".editorial-footer").offsetTop + 180,
        behavior: "instant",
      }),
    );
    await page.waitForFunction(
      () =>
        document.querySelector(".testimonial-scene").dataset
          .testimonialsActive === "false",
    );
    assert.equal((await state(card)).play, "paused");

    await scene.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector(".testimonial-scene").dataset
          .testimonialsActive === "true",
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await page.close();
    console.log(
      `PASS ${width}px / OS reduced ${osReduced}: labeled fictional profiles, local portraits, moving cards and grey background artwork, pause/resume, hover, global Off, visible-only activity and no overflow or external requests.`,
    );
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(base + "/testimonials");
  assert.equal(await page.locator(".testimonial-card").count(), 4);
  assert.ok(await page.locator(".testimonial-card").first().isVisible());
  assert.equal(
    await page
      .locator(".testimonial-float")
      .first()
      .evaluate((e) => getComputedStyle(e).animationPlayState),
    "paused",
  );
  await page.close();
  console.log(
    "PASS no-JavaScript testimonial content remains visible and static.",
  );
} finally {
  await browser.close();
}
