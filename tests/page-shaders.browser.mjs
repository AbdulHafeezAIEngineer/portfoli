import assert from "node:assert/strict";
import fs from "node:fs";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local production app required");
const routes = {
  websites: "/websites",
  bots: "/ai-bots",
  collection: "/bunch-of-work",
  about: "/about",
  testimonials: "/testimonials",
  contact: "/contact",
};
const runtimeChunks = fs
  .readdirSync(".next/static/chunks")
  .filter(
    (name) =>
      name.endsWith(".js") &&
      fs
        .readFileSync(".next/static/chunks/" + name, "utf8")
        .includes("Unknown component type"),
  );
assert.ok(runtimeChunks.length, "A separate lazy SDK chunk is built");
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
const results = [];
const instrument = async (context) =>
  context.addInitScript(() => {
    window.__pageGPU = { created: 0, destroyed: 0, submissions: 0 };
    if (!navigator.gpu) return;
    const original = navigator.gpu.requestAdapter.bind(navigator.gpu);
    navigator.gpu.requestAdapter = async (...args) => {
      const adapter = await original(...args);
      if (!adapter) return adapter;
      const request = adapter.requestDevice.bind(adapter);
      adapter.requestDevice = async (...values) => {
        const device = await request(...values);
        window.__pageGPU.created++;
        const destroy = device.destroy.bind(device),
          submit = device.queue.submit.bind(device.queue);
        device.destroy = () => {
          window.__pageGPU.destroyed++;
          return destroy();
        };
        device.queue.submit = (...calls) => {
          window.__pageGPU.submissions++;
          return submit(...calls);
        };
        return device;
      };
      return adapter;
    };
  });
const pixels = async (page) =>
  page.locator(".page-shader-canvas").evaluate(async (canvas) => {
    const png = canvas.toDataURL();
    const image = new Image();
    image.src = png;
    await image.decode();
    const sample = document.createElement("canvas");
    sample.width = 128;
    sample.height = 128;
    const ctx = sample.getContext("2d");
    ctx.drawImage(image, 0, 0, 128, 128);
    const data = ctx.getImageData(0, 0, 128, 128).data;
    const luma = (rgb) =>
      rgb.reduce((total, value, index) => {
        const c = value / 255;
        return (
          total +
          [0.2126, 0.7152, 0.0722][index] *
            (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
        );
      }, 0);
    let min = 1,
      max = 0,
      opaque = 0;
    const colors = new Set();
    for (let i = 0; i < data.length; i += 4) {
      const rgb = [data[i], data[i + 1], data[i + 2]],
        lum = luma(rgb);
      min = Math.min(min, lum);
      max = Math.max(max, lum);
      if (data[i + 3] === 255) opaque++;
      colors.add(rgb.join(","));
    }
    const main = getComputedStyle(document.querySelector("main"));
    const contrast = (value) => {
      const s = value.trim();
      const rgb = s.startsWith("#")
        ? [1, 3, 5].map((n) => parseInt(s.slice(n, n + 2), 16))
        : s
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number);
      const fg = luma(rgb);
      return Math.min(
        ...[min, max].map(
          (bg) => (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05),
        ),
      );
    };
    return {
      png,
      width: canvas.width,
      height: canvas.height,
      min,
      max,
      opaque,
      uniqueColors: colors.size,
      contrast: {
        text: contrast(main.getPropertyValue("--text")),
        muted: contrast(main.getPropertyValue("--muted")),
        accent: contrast(main.getPropertyValue("--accent-text")),
      },
    };
  });
try {
  for (const width of [1440, 390])
    for (const theme of ["dark", "light"])
      for (const [name, route] of Object.entries(routes)) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          isMobile: width < 768,
          hasTouch: width < 768,
          deviceScaleFactor: width < 768 ? 3 : 1,
          reducedMotion: width < 768 ? "reduce" : "no-preference",
        });
        await context.addInitScript((theme) => {
          localStorage.setItem("portfolio-theme", theme);
          localStorage.setItem("elvora-motion", "full");
        }, theme);
        await instrument(context);
        const page = await context.newPage(),
          errors = [],
          external = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => {
          if (m.type() === "error") errors.push(m.text());
        });
        page.on("request", (r) => {
          if (!r.url().startsWith(base)) external.push(r.url());
        });
        await page.goto(base + route);
        const reject = page.getByRole("button", {
          name: "Reject All",
          exact: true,
        });
        if (await reject.count()) await reject.click();
        await page.waitForFunction(
          () =>
            document.querySelector("[data-page-shader]")?.dataset.state ===
            "ready",
          null,
          { timeout: 90000 },
        );
        await page.waitForFunction(() => window.__pageGPU.submissions > 5);
        await page.mouse.move(0, 0);
        const before = await pixels(page);
        assert.equal(
          before.opaque,
          128 * 128,
          "The full background is painted, not a transparent overlay",
        );
        assert.ok(before.uniqueColors > 1, "Real rendered variation");
        for (const [kind, ratio] of Object.entries(before.contrast))
          assert.ok(ratio >= 4.5, `${name}/${theme}/${kind}: ${ratio}`);
        assert.ok(
          before.width <= 960 && before.height <= 720,
          "Render resolution is bounded",
        );
        const root = page.locator("[data-page-shader]");
        assert.equal(await root.getAttribute("data-page-shader"), name);
        const bounds = await root.boundingBox();
        assert.equal(bounds.width, width);
        assert.equal(bounds.height, 900);
        const submits = await page.evaluate(() => window.__pageGPU.submissions);
        await page.waitForFunction(
          (n) => window.__pageGPU.submissions > n + 2,
          submits,
        );
        const after = await pixels(page);
        assert.notEqual(
          before.png,
          after.png,
          "Shader pixels actually change over time",
        );
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        if (await page.locator(".page-tabs").count())
          assert.ok(
            await page
              .locator(".page-tabs")
              .evaluate((e) => Number(getComputedStyle(e).zIndex) >= 2),
            "Category navigation remains above the backdrop",
          );
        if (name === "testimonials") {
          const card = page.locator(".testimonial-float").first();
          const transform = () =>
            card.evaluate((e) => getComputedStyle(e).transform);
          const first = await transform();
          await page.waitForTimeout(400);
          assert.notEqual(
            await transform(),
            first,
            "Reviews float on desktop and touch with OS reduced motion when site Motion is On",
          );
          const drift = await card.evaluate((e) => {
            const m = new DOMMatrix(getComputedStyle(e).transform);
            return { x: m.m41, y: m.m42 };
          });
          assert.ok(Math.abs(drift.x) <= (width < 768 ? 4 : 12) + 0.01);
          assert.ok(Math.abs(drift.y) <= (width < 768 ? 6 : 10) + 0.01);
          await page
            .getByRole("button", {
              name: "Pause testimonial animations",
              exact: true,
            })
            .click();
          const stopped = await transform();
          await page.waitForTimeout(200);
          assert.equal(await transform(), stopped);
          await page
            .getByRole("button", {
              name: "Resume testimonial animations",
              exact: true,
            })
            .click();
          assert.equal(await page.locator("[data-sample=true]").count(), 4);
        }
        if (name === "websites" || name === "bots") {
          const video = page.locator("main video").first();
          await page.waitForFunction(() => {
            const v = document.querySelector("main video");
            return !v.paused && v.currentTime > 0.1;
          });
          assert.equal(await video.evaluate((v) => v.controls), false);
        }
        if (name === "contact") {
          await page
            .getByRole("textbox", { name: "Your name", exact: true })
            .fill("Shader layout check");
          assert.equal(
            await page
              .getByRole("textbox", { name: "Your name", exact: true })
              .inputValue(),
            "Shader layout check",
          );
        }
        if (process.env.UPDATE_SHADER_POSTERS === "1" && width === 1440)
          await sharp(Buffer.from(after.png.split(",")[1], "base64"))
            .webp({ lossless: true })
            .toFile(`public/shaders/${name}-${theme}.webp`);
        if (width === 1440 || name === "testimonials") {
          // Work around the software GPU screenshot compositor using the actual canvas frame.
          await page.evaluate(async () => {
            const c = document.querySelector(".page-shader-canvas"),
              img = new Image();
            img.dataset.testFrame = "";
            img.src = c.toDataURL();
            img.style.cssText =
              "position:absolute;inset:0;width:100%;height:100%";
            await img.decode();
            c.after(img);
          });
          await page.screenshot({
            path: `docs/page-shader-${name}-${theme}-${width}.png`,
          });
          await page.locator("[data-test-frame]").evaluate((e) => e.remove());
        }
        await page.getByLabel("Animation preference").selectOption("reduced");
        await page.waitForFunction(
          () => window.__pageGPU.created === window.__pageGPU.destroyed,
        );
        assert.notEqual(await root.getAttribute("data-state"), "ready");
        assert.equal(
          await page
            .locator(".page-shader-canvas")
            .evaluate((e) => getComputedStyle(e).opacity),
          "0",
        );
        const image = await root.evaluate(
          (e) => getComputedStyle(e).backgroundImage,
        );
        assert.ok(image.includes(`/shaders/${name}-${theme}.webp`));
        const resource = await page.request.get(
          base + `/shaders/${name}-${theme}.webp`,
        );
        assert.equal(resource.status(), 200);
        assert.deepEqual(errors, []);
        assert.deepEqual(external, []);
        const {
          png,
          width: bufferWidth,
          height: bufferHeight,
          ...stats
        } = after;
        results.push({
          name,
          theme,
          viewportWidth: width,
          bufferWidth,
          bufferHeight,
          ...stats,
          gpu: await page.evaluate(() => window.__pageGPU),
          errors,
          external,
        });
        console.log(
          `PASS ${name} ${theme} ${width}: painted/animated background, AA text bounds, native content, Off cleanup`,
        );
        await context.close();
      }
  // Fresh homepage and saved-Off visits must not download the page shader runtime.
  for (const route of ["/", "/websites"]) {
    const context = await browser.newContext();
    await context.addInitScript(() =>
      localStorage.setItem("elvora-motion", "reduced"),
    );
    const page = await context.newPage(),
      requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto(base + route);
    await page.waitForTimeout(400);
    assert.ok(
      !requests.some((url) => runtimeChunks.some((name) => url.includes(name))),
    );
    assert.equal(
      await page.locator("[data-page-shader]").count(),
      route === "/" ? 0 : 1,
    );
    await context.close();
  }
  // No WebGPU: the same complete design is a local static background.
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript(() =>
    Object.defineProperty(navigator, "gpu", { get: () => undefined }),
  );
  const page = await context.newPage();
  await page.goto(base + "/testimonials");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-page-shader]")?.dataset.state ===
      "unsupported",
  );
  assert.equal(await page.locator(".testimonial-card").count(), 4);
  assert.equal(
    (await page.request.get(base + "/shaders/testimonials-dark.webp")).status(),
    200,
  );
  await context.close();
  fs.writeFileSync(
    "docs/page-shader-browser-results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    "PASS homepage exclusion, saved-Off runtime exclusion and static fallback",
  );
} finally {
  await browser.close();
}
