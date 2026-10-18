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
    for (const name of [
      "work-showcase",
      "ai-bot",
      "home-ai-bot",
      "home-websites",
      "home-collection",
    ]) {
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
        cover: name === "home-websites" ? "contain" : "cover",
      });
      assert.equal(
        await banner.locator("video").evaluate((v) => v.videoWidth),
        width < 768 ? 854 : 1280,
      );
      assert.equal(await banner.getByRole("button").count(), 0);
      const box = await banner.boundingBox();
      if (name.startsWith("home-")) {
        const isWebsite = name === "home-websites";
        const isCollection = name === "home-collection";
        if (isCollection) {
          assert.equal(
            await banner.getAttribute("data-video-background"),
            "alpha",
          );
          const alpha = await banner.locator("video").evaluate((media) => {
            const canvas = document.createElement("canvas");
            canvas.width = 2;
            canvas.height = 1;
            const context = canvas.getContext("2d");
            context.drawImage(media, 0, 0, 1, 1, 0, 0, 1, 1);
            context.drawImage(
              media,
              media.videoWidth / 2,
              media.videoHeight / 2,
              1,
              1,
              1,
              0,
              1,
              1,
            );
            const pixels = context.getImageData(0, 0, 2, 1).data;
            return [pixels[3], pixels[7]];
          });
          assert.deepEqual(
            alpha,
            [0, 255],
            "Clear outer background; dark gallery center remains opaque",
          );
        }
        const preview = page.locator(
          isWebsite
            ? ".home-website-preview"
            : isCollection
              ? ".home-collection-preview"
              : ".home-bot-preview",
        );
        const parent = await preview.boundingBox();
        assert.ok(Math.abs(box.width - parent.width) < 1);
        assert.ok(Math.abs(box.x - parent.x) < 1);
        assert.ok(
          await page
            .locator(
              isWebsite
                ? '.home-feature-websites[href="/websites"]'
                : isCollection
                  ? '.home-feature-collection[href="/bunch-of-work"]'
                  : '.home-feature-bots[href="/ai-bots"]',
            )
            .count(),
        );
        if (isWebsite) {
          const ratio = width < 768 ? 16 / 9 : 2;
          assert.ok(Math.abs(box.width / box.height - ratio) < 0.01);
          assert.ok(
            box.width > width * 0.9,
            "Website preview spans the horizon",
          );
          assert.notEqual(
            await banner
              .locator("video")
              .evaluate((v) => getComputedStyle(v).maskImage),
            "none",
          );
        }
        {
          const rounded = await preview.evaluate((el) => {
            const s = getComputedStyle(el);
            return (
              [
                s.borderTopLeftRadius,
                s.borderTopRightRadius,
                s.borderBottomLeftRadius,
                s.borderBottomRightRadius,
              ].every((r) => parseFloat(r) >= 16) && s.overflow === "hidden"
            );
          });
          assert.ok(
            rounded,
            "All four corners are rounded and clipped on each homepage video",
          );
          if (isWebsite)
            await banner.screenshot({
              path: `docs/home-websites-loop-${width}.png`,
            });
          else if (isCollection) {
            assert.ok(Math.abs(box.width / box.height - 16 / 9) < 0.01);
            await banner.screenshot({
              path: `docs/home-collection-loop-${width}.png`,
            });
          } else
            await banner.screenshot({
              path: `docs/home-bot-loop-${width}.png`,
            });
        }
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
      `PASS ${width}px / OS reduced ${osReduced}: all five silent loops, no controls, actual loop wrap, Off/On, offscreen pause and consent intact.`,
    );
  }
  for (const width of [390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    await page.addInitScript(() => {
      const read = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function (...args) {
        const pixels = read.apply(this, args);
        if (this.canvas.width === 1 && this.canvas.height === 1)
          pixels.data[3] = 255;
        return pixels;
      };
    });
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    const banner = page.locator('[data-showcase-video="home-collection"]');
    await banner.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const v = document.querySelector(
        '[data-showcase-video="home-collection"] video',
      );
      return (
        v && v.currentSrc.endsWith(".mp4") && !v.paused && v.currentTime > 0.1
      );
    });
    assert.equal(
      await banner.getAttribute("data-video-background"),
      "composited",
    );
    const pixel = await banner.locator("video").evaluate((v) => {
      const c = document.createElement("canvas");
      c.width = 2;
      c.height = 1;
      const context = c.getContext("2d");
      context.drawImage(v, 0, 0, 1, 1, 0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data];
    });
    assert.ok(
      pixel.slice(0, 3).every((v, i) => Math.abs(v - [27, 13, 52][i]) < 5),
      "MP4 background matches the purple panel",
    );
    await page.getByLabel("Animation preference").selectOption("reduced");
    await page.waitForFunction(
      () =>
        !document.querySelector(
          '[data-showcase-video="home-collection"] video',
        ),
    );
    await page.getByLabel("Animation preference").selectOption("full");
    await page.waitForFunction(() => {
      const v = document.querySelector(
        '[data-showcase-video="home-collection"] video',
      );
      return v && v.currentSrc.endsWith(".mp4") && !v.paused;
    });
    await page.close();
    console.log(
      `PASS ${width}px: simulated missing alpha support selects purple MP4, including Motion Off/On.`,
    );
  }
} finally {
  await browser.close();
}
