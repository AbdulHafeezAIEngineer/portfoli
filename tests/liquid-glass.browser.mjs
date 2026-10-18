import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Use a local production app");
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const results = [];
const chunkFiles = fs
  .readdirSync(".next/static/chunks")
  .filter(
    (name) =>
      name.endsWith(".js") &&
      fs
        .readFileSync(".next/static/chunks/" + name, "utf8")
        .includes("LiquidGlass: WebGL"),
  );
assert.ok(chunkFiles.length > 0, "A separate WebGL runtime chunk exists");
const shaderHash = (element) => {
  const canvas = element.querySelector("canvas");
  if (!canvas) return "";
  return canvas.toDataURL();
};
const material = (element) => {
  const style = getComputedStyle(element);
  return {
    background: style.backgroundColor,
    filter: style.backdropFilter,
    border: style.borderBottomColor,
    shadow: style.boxShadow,
  };
};
try {
  for (const width of [320, 390, 768, 1440]) {
    for (const theme of ["dark", "light"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        isMobile: width < 1000,
        hasTouch: width < 1000,
      });
      await context.addInitScript((theme) => {
        localStorage.setItem("elvora-motion", "reduced");
        localStorage.setItem("portfolio-theme", theme);
      }, theme);
      const page = await context.newPage();
      const errors = [],
        requests = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("request", (r) => requests.push(r.url()));
      await page.goto(base + "/about");
      await page
        .getByRole("button", { name: "Reject All", exact: true })
        .click();
      await page.evaluate(() => document.fonts.ready);
      const header = page.locator(".portfolio-header");
      const panel = page.locator(
        width < 1200 ? "#mobile-navigation" : "#about-navigation",
      );
      const toggle = page.getByRole("button", {
        name: width < 1200 ? "Open navigation" : "Explore About Me",
        exact: true,
      });
      await toggle.click();
      await panel.waitFor({ state: "visible" });
      const normal = {
        header: await header.evaluate(material),
        panel: await panel.evaluate(material),
      };
      assert.equal(normal.header.filter, "blur(16px)");
      assert.equal(normal.panel.filter, "none");
      assert.ok(
        normal.header.background.includes("0.96"),
        "Header is 96% opaque to protect text contrast",
      );
      assert.ok(
        !normal.panel.background.includes("0.96"),
        "Large menus remain opaque for reading",
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      const cdp = await context.newCDPSession(page);
      for (const feature of [
        "prefers-reduced-transparency",
        "prefers-contrast",
      ]) {
        await cdp.send("Emulation.setEmulatedMedia", {
          features: [
            {
              name: feature,
              value: feature === "prefers-contrast" ? "more" : "reduce",
            },
          ],
        });
        for (const surface of [header, panel]) {
          const value = await surface.evaluate(material);
          assert.equal(value.filter, "none");
          assert.ok(
            !value.background.includes("0.96"),
            "Accessibility fallback is opaque",
          );
        }
      }
      await cdp.send("Emulation.setEmulatedMedia", {
        features: [{ name: "forced-colors", value: "active" }],
      });
      const forced = await panel.evaluate(material);
      assert.equal(forced.filter, "none");
      assert.equal(forced.shadow, "none");
      await cdp.send("Emulation.setEmulatedMedia", { features: [] });
      await page.keyboard.press("Escape");
      await panel.waitFor({ state: "hidden" });
      assert.ok(await toggle.evaluate((e) => e === document.activeElement));
      await toggle.press("Enter");
      await panel
        .getByRole("link", { name: "My Journey", exact: true })
        .click();
      await page.waitForURL(base + "/journey");
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        theme,
      );
      assert.equal(
        await page.locator("html").getAttribute("data-motion"),
        "reduced",
      );
      assert.ok(
        !requests.some((url) => /cdn\.jsdelivr\.net/.test(url)),
        "No external CDN",
      );
      assert.deepEqual(errors, []);
      assert.ok(
        !requests.some((url) => chunkFiles.some((name) => url.includes(name))),
        "Saved Off does not download the shader runtime",
      );
      const preference = page.getByLabel("Animation preference");
      await preference.selectOption("full");
      const scene = page.locator(".nav-glass-layer");
      const lens = page.locator(".nav-glass-lens");
      await page.waitForFunction(
        () =>
          document.querySelector(".nav-glass-layer")?.dataset.state === "ready",
        null,
        { timeout: 20000 },
      );
      assert.equal(
        await page.locator("canvas[data-navigation-glass-renderer]").count(),
        1,
      );
      assert.ok(
        await page
          .locator("canvas[data-navigation-glass-renderer]")
          .evaluate((canvas) => !canvas.getContext("webgl").isContextLost()),
      );
      const original = await lens.evaluate(shaderHash);
      assert.ok(
        original.length > 100,
        "Actual shader output has rendered pixels",
      );
      await lens.evaluate((element) => {
        const config = JSON.parse(element.dataset.config);
        element.dataset.config = JSON.stringify({ ...config, refraction: 1.1 });
      });
      await page.waitForFunction(
        (old) =>
          document.querySelector(".nav-glass-lens canvas").toDataURL() !== old,
        original,
      );
      const refracted = await lens.evaluate(shaderHash);
      assert.notEqual(
        refracted,
        original,
        "Refraction strength changes actual rendered pixels",
      );
      const darkFirst = await page.locator("html").getAttribute("data-theme");
      await page.locator(".theme-toggle").click();
      await page.waitForFunction(
        (old) => document.documentElement.dataset.theme !== old,
        darkFirst,
      );
      await page.waitForFunction(
        (old) =>
          document.querySelector(".nav-glass-lens canvas").toDataURL() !== old,
        refracted,
      );
      await page.locator(".theme-toggle").click();
      for (const feature of [
        "prefers-reduced-transparency",
        "prefers-contrast",
        "forced-colors",
      ]) {
        await cdp.send("Emulation.setEmulatedMedia", {
          features: [
            {
              name: feature,
              value:
                feature === "prefers-contrast"
                  ? "more"
                  : feature === "forced-colors"
                    ? "active"
                    : "reduce",
            },
          ],
        });
        await page.waitForFunction(
          () =>
            document.querySelectorAll("canvas[data-navigation-glass-renderer]")
              .length === 0,
        );
        await cdp.send("Emulation.setEmulatedMedia", { features: [] });
        await page.waitForFunction(
          () =>
            document.querySelector(".nav-glass-layer")?.dataset.state ===
            "ready",
        );
        assert.equal(
          await page.locator("canvas[data-navigation-glass-renderer]").count(),
          1,
        );
      }
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          value: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.waitForFunction(
        () =>
          document.querySelectorAll("canvas[data-navigation-glass-renderer]")
            .length === 0,
      );
      await page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.waitForFunction(
        () =>
          document.querySelector(".nav-glass-layer")?.dataset.state === "ready",
      );
      if (width === 390 || width === 1440) {
        await toggle.click();
        await panel.waitFor({ state: "visible" });
        await panel.evaluate(async (element) => {
          const animations = element.getAnimations({ subtree: true });
          await Promise.all(
            animations
              .filter((a) => a.effect?.getTiming().iterations !== Infinity)
              .map((a) => a.finished.catch(() => {})),
          );
        });
        await page.screenshot({
          path: `docs/liquid-glass-${width}-${theme}.png`,
        });
      }
      // Offscreen teardown and resume use one context, including touch widths.
      await scene.evaluate((element) => {
        element.style.transform = "translateY(-200px)";
      });
      await page.waitForFunction(
        () =>
          document.querySelectorAll("canvas[data-navigation-glass-renderer]")
            .length === 0,
      );
      await scene.evaluate((element) => {
        element.style.transform = "";
      });
      await page.waitForFunction(
        () =>
          document.querySelector(".nav-glass-layer")?.dataset.state === "ready",
      );
      if (width === 390 && theme === "dark") {
        await page
          .locator("canvas[data-navigation-glass-renderer]")
          .evaluate((canvas) => {
            canvas
              .getContext("webgl")
              .getExtension("WEBGL_lose_context")
              .loseContext();
          });
        await page.waitForFunction(
          () =>
            document.querySelectorAll("canvas[data-navigation-glass-renderer]")
              .length === 0,
        );
        await preference.selectOption("reduced");
        await preference.selectOption("full");
        await page.waitForFunction(
          () =>
            document.querySelector(".nav-glass-layer")?.dataset.state ===
            "ready",
        );
      }
      await preference.selectOption("reduced");
      await page.waitForFunction(
        () =>
          document.querySelectorAll("canvas[data-navigation-glass-renderer]")
            .length === 0,
      );
      assert.equal(await lens.locator("canvas").count(), 0);
      assert.deepEqual(errors, []);
      results.push({
        realWebGL: true,
        refractionChangesPixels: true,
        motionOffReleasesRenderer: true,
        width,
        theme,
        normal,
        forced,
        keyboardNavigation: true,
        appearanceFallbacks: true,
        noOverflow: true,
        pageErrors: errors,
      });
      console.log(
        `PASS ${width}px ${theme}: glass/fallbacks, keyboard menu, real navigation, theme/motion retained`,
      );
      await context.close();
    }
  }
  const fallback = await browser.newContext({
    viewport: { width: 390, height: 900 },
    isMobile: true,
    hasTouch: true,
  });
  await fallback.addInitScript(() => {
    localStorage.setItem("elvora-motion", "full");
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  const unavailable = await fallback.newPage();
  const fallbackErrors = [];
  unavailable.on("pageerror", (error) => fallbackErrors.push(error.message));
  await unavailable.goto(base + "/about");
  await unavailable
    .getByRole("button", { name: "Reject All", exact: true })
    .click();
  await unavailable.waitForFunction(
    () =>
      document.querySelector(".nav-glass-layer")?.dataset.state ===
      "unavailable",
  );
  assert.equal(
    await unavailable.locator("canvas[data-navigation-glass-renderer]").count(),
    0,
  );
  await unavailable
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await unavailable
    .locator("#mobile-navigation")
    .getByRole("link", { name: "My Journey", exact: true })
    .click();
  await unavailable.waitForURL(base + "/journey");
  assert.deepEqual(fallbackErrors, []);
  results.push({
    webGLUnavailable: true,
    nativeNavigationWorks: true,
    pageErrors: fallbackErrors,
  });
  await fallback.close();
  console.log(
    "PASS blocked WebGL: native navigation, CSS fallback, no leaked canvas or page errors",
  );
  fs.writeFileSync(
    "docs/liquid-glass-browser-results.json",
    JSON.stringify(results, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
