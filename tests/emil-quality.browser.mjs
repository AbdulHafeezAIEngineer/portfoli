import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local production app required");
const videoRequest = (url) => /\/videos\/[^?]+\.(webm|mp4)(\?|$)/.test(url);
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];

async function toolbarMatches(page) {
  await page.waitForFunction(() => {
    const theme = document.documentElement.dataset.theme;
    const color = theme === "light" ? "#FAFAFC" : "#0A0A0F";
    const tags = [...document.querySelectorAll('meta[name="theme-color"]')];
    return (
      tags.length > 0 &&
      tags.every((tag) => tag.content.toLowerCase() === color.toLowerCase())
    );
  });
}

try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      isMobile: width < 768,
      hasTouch: width < 768,
      colorScheme: "light",
    });
    await context.addInitScript(() => {
      localStorage.setItem("elvora-motion", "reduced");
      localStorage.setItem("portfolio-theme", "light");
    });
    const page = await context.newPage();
    const requests = [],
      errors = [];
    page.on("request", (r) => {
      if (videoRequest(r.url())) requests.push(r.url());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll(".showcase-video img").length === 3,
    );
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("video").count(), 0);
    assert.deepEqual(
      requests,
      [],
      "Saved Off never exposes video URLs to the preload scanner",
    );
    await toolbarMatches(page);
    await page.getByLabel("Animation preference").selectOption("full");
    await page.waitForFunction(() => {
      const videos = [...document.querySelectorAll("video")];
      return (
        videos.length === 3 &&
        videos.every((v) => v.readyState >= 2 && v.currentSrc)
      );
    });
    assert.equal(
      requests.length,
      3,
      "On selects one responsive source per video without duplicate loads",
    );
    assert.ok(
      requests.every((url) =>
        width < 768 ? url.includes("-mobile.") : !url.includes("-mobile."),
      ),
    );
    assert.ok(
      await page
        .locator(".editorial-footer")
        .evaluate((e) =>
          e
            .getAnimations({ subtree: true })
            .every((a) => a.playState === "paused"),
        ),
    );
    const footer = page.locator(".editorial-footer");
    await footer.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector(".editorial-footer").dataset.footerActive ===
        "true",
    );
    const running = await footer.evaluate(
      (e) =>
        e
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
    );
    assert.ok(running >= 4, "Original wordmark, waves and emblem resume");
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForFunction(
      () =>
        document.querySelector(".editorial-footer").dataset.footerActive ===
        "false",
    );
    assert.ok(
      await footer.evaluate((e) =>
        e
          .getAnimations({ subtree: true })
          .every((a) => a.playState === "paused"),
      ),
    );
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForFunction(
      () =>
        document.querySelector(".editorial-footer").dataset.footerActive ===
        "true",
    );
    await page.getByLabel("Animation preference").selectOption("reduced");
    await page.waitForFunction(
      () =>
        document.querySelector(".editorial-footer").dataset.footerActive ===
        "false",
    );
    await page
      .getByRole("button", { name: "Switch to dark theme", exact: true })
      .click();
    await toolbarMatches(page);
    await page
      .getByRole("button", { name: "Switch to light theme", exact: true })
      .click();
    await toolbarMatches(page);
    await page.locator('.footer-editorial-colophon a[href="/cookies"]').click();
    await page.waitForURL(base + "/cookies");
    await toolbarMatches(page);
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    assert.deepEqual(errors, []);
    results.push({
      width,
      savedOffVideoRequests: 0,
      onVideoRequests: requests.length,
      footerRunningWhenVisible: running,
      toolbarTracksSelectedTheme: true,
    });
    console.log(
      `PASS ${width}px: saved Off zero video requests, On one source each, footer visibility/tab pause, theme toolbar and legal navigation`,
    );
    await context.close();
  }

  for (const width of [320, 390, 768, 1440]) {
    const touch = width < 1000;
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      isMobile: touch,
      hasTouch: touch,
    });
    const page = await context.newPage();
    await page.goto(base + "/contact");
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    if (touch) {
      const fonts = await page
        .locator(".motion-control select, .form-field select")
        .evaluateAll((els) =>
          els.map((e) => parseFloat(getComputedStyle(e).fontSize)),
        );
      assert.ok(
        fonts.length >= 2 && fonts.every((n) => n >= 16),
        "Touch selects keep 16px text",
      );
      const heights = await page
        .locator(
          ".footer-editorial-colophon nav a, .footer-editorial-colophon nav button, .footer-brief-link",
        )
        .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
      assert.ok(
        heights.length >= 5 && heights.every((n) => n >= 44),
        "Touch footer actions are at least 44px high",
      );
      const button = page.locator('#contact button[type="submit"]');
      await button.hover();
      assert.equal(
        await button.evaluate((e) => getComputedStyle(e).transform),
        "none",
        "Touch cannot retain a hover lift",
      );
      assert.equal(
        await button.evaluate((e) => getComputedStyle(e).touchAction),
        "manipulation",
      );
      const viewport = await page
        .locator('meta[name="viewport"]')
        .getAttribute("content");
      assert.ok(!/user-scalable=no|maximum-scale=1/.test(viewport));
    }
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      await toolbarMatches(page);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${width}px ${theme}: no overflow`,
      );
    }
    assert.notEqual(
      await page
        .locator("main")
        .evaluate((e) => getComputedStyle(e).userSelect),
      "none",
    );
    if (width === 390) {
      await page.locator(".footer-editorial-colophon").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: "docs/emil-mobile-footer.png",
        animations: "disabled",
      });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: "docs/emil-mobile-contact.png",
        animations: "disabled",
      });
    }
    console.log(
      `PASS ${width}px: controls, both themes, zoom allowed, selectable content and no overflow`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(
  "/tmp/elvora-emil-browser-results.json",
  JSON.stringify(results, null, 2),
);
