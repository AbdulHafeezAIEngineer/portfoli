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
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  const requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(base);
  await page.getByRole("button", { name: "Reject All", exact: true }).click();
  assert.equal(
    await page.getByLabel("Animation preference").inputValue(),
    "full",
  );
  const work = page.locator('[data-showcase-video="work-showcase"]');
  await work.locator("video").waitFor();
  assert.equal(
    requests.filter((x) => /\.(webm|mp4)(\?|$)/.test(x)).length,
    0,
    "preload none does not fetch videos above the fold",
  );
  const attributes = await work.locator("video").evaluate((v) => ({
    muted: v.muted,
    loop: v.loop,
    inline: v.playsInline,
    preload: v.preload,
    poster: v.getAttribute("poster"),
    types: [...v.querySelectorAll("source")].map((s) => s.type),
  }));
  assert.deepEqual(attributes, {
    muted: true,
    loop: true,
    inline: true,
    preload: "none",
    poster: "/videos/work-showcase-poster.webp",
    types: ["video/webm", "video/mp4"],
  });
  await work.locator(".showcase-video-frame").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const v = document.querySelector(
      '[data-showcase-video="work-showcase"] video',
    );
    return v && !v.paused && v.currentTime > 0.1;
  });
  await work
    .getByRole("button", { name: "Pause website showcase video" })
    .click();
  assert.equal(await work.locator("video").evaluate((v) => v.paused), true);
  await work
    .getByRole("button", { name: "Play website showcase video" })
    .click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForFunction(
    () =>
      document.querySelector('[data-showcase-video="work-showcase"] video')
        .paused,
  );
  await work.locator(".showcase-video-frame").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      !document.querySelector('[data-showcase-video="work-showcase"] video')
        .paused,
  );
  await page.getByRole("tab", { name: /AI chatbots & demos/ }).click();
  const bot = page.locator('[data-showcase-video="ai-bot"]');
  await bot.locator(".showcase-video-frame").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const v = document.querySelector('[data-showcase-video="ai-bot"] video');
    return v && !v.paused && v.duration > 0;
  });
  assert.equal(await bot.locator("video").evaluate((v) => v.loop), false);
  await bot.getByRole("button", { name: "Pause AI bot video" }).click();
  await bot.getByRole("button", { name: "Play AI bot video" }).click();
  await page.waitForFunction(
    () =>
      !document.querySelector('[data-showcase-video="ai-bot"] video').paused,
  );
  await bot
    .locator("video")
    .evaluate((v) => (v.currentTime = v.duration - 0.15));
  await bot.getByRole("button", { name: "Replay AI bot video" }).waitFor();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await bot.scrollIntoViewIfNeeded();
  assert.equal(
    await bot.locator("video").evaluate((v) => v.paused),
    true,
    "ended AI video never auto-restarts",
  );
  await bot.getByRole("button", { name: "Replay AI bot video" }).click();
  await page.waitForFunction(() => {
    const v = document.querySelector('[data-showcase-video="ai-bot"] video');
    return !v.paused && v.currentTime < 3;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bot.locator("img").waitFor();
  assert.equal(await page.locator(".showcase-video video").count(), 0);
  assert.equal(
    await page.getByLabel("Animation preference").inputValue(),
    "full",
    "videos respect OS independently of general On",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await bot.locator("video").waitFor();
  await page.getByLabel("Animation preference").selectOption("reduced");
  await bot.locator("img").waitFor();
  assert.equal(await page.locator(".showcase-video video").count(), 0);
  assert.equal(
    requests.filter((x) => /botpress|api\.openai/.test(x)).length,
    0,
    "consent/Botpress unchanged",
  );
  assert.deepEqual(errors, []);
  await page.close();
  for (const config of [
    { width: 390, reduce: false },
    { width: 767, reduce: false },
    { width: 1440, reduce: true },
  ]) {
    const p = await browser.newPage({
      viewport: { width: config.width, height: 900 },
      reducedMotion: config.reduce ? "reduce" : "no-preference",
    });
    const media = [];
    p.on("request", (r) => {
      if (/\.(webm|mp4)(\?|$)/.test(r.url())) media.push(r.url());
    });
    await p.goto(base);
    await p.getByRole("button", { name: "Reject All", exact: true }).click();
    await p
      .locator('[data-showcase-video="work-showcase"] img')
      .scrollIntoViewIfNeeded();
    await p.getByRole("tab", { name: /AI chatbots & demos/ }).click();
    await p
      .locator('[data-showcase-video="ai-bot"] img')
      .scrollIntoViewIfNeeded();
    assert.equal(await p.locator(".showcase-video video").count(), 0);
    assert.deepEqual(media, []);
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.close();
  }
  console.log(
    "PASS videos: deferred native playback, WebM/MP4 order, visible loop/pause, AI once/replay, OS/explicit reduced motion and mobile poster-only, no consent bypass.",
  );
} finally {
  await browser.close();
}
