import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local production app required");
const gpuEnvironment = { ...process.env };
if (
  !gpuEnvironment.VK_ICD_FILENAMES &&
  fs.existsSync("/usr/lib/chromium/vk_swiftshader_icd.json")
) {
  gpuEnvironment.VK_ICD_FILENAMES = "/usr/lib/chromium/vk_swiftshader_icd.json";
}
const browser = await chromium.launch({
  env: gpuEnvironment,
  executablePath: "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--enable-unsafe-webgpu",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--enable-features=Vulkan",
    "--disable-vulkan-surface",
  ],
});
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__devices = [];
    const original = navigator.gpu.requestAdapter.bind(navigator.gpu);
    navigator.gpu.requestAdapter = async (...args) => {
      const adapter = await original(...args);
      if (!adapter) return adapter;
      const request = adapter.requestDevice.bind(adapter);
      adapter.requestDevice = async (...values) => {
        const device = await request(...values),
          record = { device, destroyed: false };
        window.__devices.push(record);
        const destroy = device.destroy.bind(device);
        device.destroy = () => {
          record.destroyed = true;
          return destroy();
        };
        return device;
      };
      return adapter;
    };
  });
  await page.goto(base + "/websites");
  await page.getByRole("button", { name: "Reject All", exact: true }).click();
  const ready = () =>
    page.waitForFunction(
      () =>
        document.querySelector("[data-page-shader]")?.dataset.state === "ready",
      null,
      { timeout: 90000 },
    );
  const released = () =>
    page.waitForFunction(() => window.__devices.every((d) => d.destroyed));
  await ready();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await released();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await ready();
  await page.setViewportSize({ width: 1440, height: 400 });
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await released();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await ready();
  await page.setViewportSize({ width: 1440, height: 900 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-contrast", value: "more" }],
  });
  await released();
  assert.equal(
    await page
      .locator("[data-page-shader]")
      .evaluate((e) => getComputedStyle(e).backgroundImage),
    "none",
  );
  await cdp.send("Emulation.setEmulatedMedia", { features: [] });
  await ready();
  const beforeTheme = await page.evaluate(() => window.__devices.length);
  await page.getByRole("button", { name: /Switch to light theme/ }).click();
  await page.waitForFunction((n) => window.__devices.length > n, beforeTheme);
  await ready();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  await page.getByLabel("Animation preference").selectOption("reduced");
  await released();
  const created = await page.evaluate(() => window.__devices.length);
  await page.getByLabel("Animation preference").selectOption("full");
  await page.waitForFunction((n) => window.__devices.length > n, created);
  await page.getByLabel("Animation preference").selectOption("reduced");
  await released();
  await page.getByLabel("Animation preference").selectOption("full");
  await ready();
  await page.locator('.desktop-nav a[href="/"]').first().click();
  await page.waitForURL(base + "/");
  await page.waitForFunction(
    () => !document.querySelector("[data-page-shader]"),
  );
  await released();
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    "docs/page-shader-lifecycle-results.json",
    JSON.stringify(
      {
        hiddenTab: true,
        offscreenCleanup: true,
        contrastFallback: true,
        themeChange: true,
        pendingInitializationCleanup: true,
        spaHomeCleanup: true,
        devices: await page.evaluate(() =>
          window.__devices.map((d) => ({ destroyed: d.destroyed })),
        ),
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS hidden-tab, contrast, theme, pending initialization and SPA-home GPU cleanup",
  );
} finally {
  await browser.close();
}
