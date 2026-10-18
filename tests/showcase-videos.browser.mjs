import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local production app required");
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const [width, osReduced] of [
    [1440, false],
    [390, false],
    [1440, true],
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
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (/botpress|api\.openai/.test(request.url()))
        external.push(request.url());
    });
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    assert.equal(
      await page.getByLabel("Animation preference").inputValue(),
      "full",
    );
    for (const name of ["work-showcase", "ai-bot", "home-ai-bot"]) {
      await page.goto(
        base +
          (name === "work-showcase"
            ? "/websites"
            : name === "ai-bot"
              ? "/ai-bots"
              : "/"),
      );
      const banner = page.locator(`[data-showcase-video="${name}"]`);
      await banner.scrollIntoViewIfNeeded();
      await page.waitForFunction((n) => {
        const v = document.querySelector(`[data-showcase-video="${n}"] video`);
        return v && !v.paused && v.currentTime > 0.1 && v.duration > 0;
      }, name);
      const state = await banner.locator("video").evaluate((v) => ({
        loop: v.loop,
        muted: v.muted,
        inline: v.playsInline,
        controls: v.controls,
        preload: v.preload,
        types: [...v.querySelectorAll("source")].map((s) => s.type),
        cover: getComputedStyle(v).objectFit,
      }));
      assert.deepEqual(state, {
        loop: true,
        muted: true,
        inline: true,
        controls: false,
        preload: "auto",
        types: ["video/webm", "video/mp4", "video/webm", "video/mp4"],
        cover: "cover",
      });
      assert.equal(
        await banner.locator("video").evaluate((v) => v.videoWidth),
        width < 768 ? 854 : 1280,
      );
      assert.equal(await banner.getByRole("button").count(), 0);
      const box = await banner.boundingBox();
      if (name === "home-ai-bot") {
        const parent = await page.locator(".home-bot-preview").boundingBox();
        assert.ok(Math.abs(box.width - parent.width) < 1);
        assert.ok(Math.abs(box.x - parent.x) < 1);
        assert.ok(
          await page.locator('.home-feature-bots[href="/ai-bots"]').count(),
        );
        await banner.screenshot({ path: `docs/home-bot-loop-${width}.png` });
      } else
        assert.ok(
          box.width > width * 0.9 && box.x >= 0 && box.x < 45,
          "Wide edge-to-edge frame",
        );
      await banner
        .locator("video")
        .evaluate((v) => (v.currentTime = v.duration - 0.12));
      await page.waitForFunction((n) => {
        const v = document.querySelector(`[data-showcase-video="${n}"] video`);
        return v.currentTime < 2 && !v.paused && !v.ended;
      }, name);
      await page.getByLabel("Animation preference").selectOption("reduced");
      await page.waitForFunction(
        () => document.querySelectorAll(".showcase-video video").length === 0,
      );
      assert.equal(await banner.locator("img").count(), 1);
      await page.getByLabel("Animation preference").selectOption("full");
      await banner.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (n) =>
          !document.querySelector(`[data-showcase-video="${n}"] video`).paused,
        name,
      );
      await page.locator(".editorial-footer").scrollIntoViewIfNeeded();
      await page.waitForFunction(
        (n) =>
          document.querySelector(`[data-showcase-video="${n}"] video`).paused,
        name,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await page.close();
    console.log(
      `PASS ${width}px / OS reduced ${osReduced}: all three silent loops, no controls, actual loop wrap, Off/On, offscreen pause and consent intact.`,
    );
  }
} finally {
  await browser.close();
}
