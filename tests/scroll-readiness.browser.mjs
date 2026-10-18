/** Local scroll/loading regression. Frame timings are observations, not a device FPS guarantee. */
import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const route of ["/", "/websites", "/bunch-of-work"]) {
      const p = await b.newPage({
        viewport: { width, height: 900 },
        isMobile: width < 768,
        hasTouch: width < 768,
      });
      await p.goto("http://127.0.0.1:3008" + route);
      await p.getByRole("button", { name: "Reject All", exact: true }).click();
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(1200);
      try {
        await p.waitForFunction(
          () =>
            [...document.images].every((i) => i.complete && i.naturalWidth > 0),
          null,
          { polling: 100 },
        );
      } catch (error) {
        console.error(
          "Pending/broken images",
          width,
          await p.evaluate(() =>
            [...document.images]
              .filter((i) => !i.complete || !i.naturalWidth)
              .map((i) => ({
                src: i.currentSrc,
                loading: i.loading,
                complete: i.complete,
                width: i.naturalWidth,
              })),
          ),
        );
        throw error;
      }
      const r = await p.evaluate(async () => {
        const start = performance.now();
        const before = [...document.images].filter(
          (i) => i.complete && i.naturalWidth,
        ).length;
        const times = [];
        const tasks = [];
        const o = new PerformanceObserver((l) =>
          tasks.push(
            ...l
              .getEntries()
              .filter((e) => e.startTime >= start)
              .map((e) => e.duration),
          ),
        );
        o.observe({ type: "longtask", buffered: true });
        let previous = performance.now();
        for (let n = 0; n <= 160; n++) {
          scrollTo({
            top:
              ((document.documentElement.scrollHeight - innerHeight) * n) / 160,
            behavior: "instant",
          });
          await new Promise(requestAnimationFrame);
          const now = performance.now();
          times.push(now - previous);
          previous = now;
        }
        await new Promise((r) => setTimeout(r, 500));
        o.disconnect();
        const resources = performance
          .getEntriesByType("resource")
          .filter((r) => r.startTime >= start);
        return {
          imagesBefore: before,
          totalImages: document.images.length,
          scrollResourceRequests: resources.length,
          scrollImageRequests: resources.filter(
            (r) => r.initiatorType === "img",
          ).length,
          scrollScriptRequests: resources.filter(
            (r) => r.initiatorType === "script",
          ).length,
          framesOver50ms: times.filter((t) => t > 50).length,
          worstFrameMs: Math.round(Math.max(...times)),
          longTasks: tasks.length,
          longTaskMs: Math.round(tasks.reduce((a, b) => a + b, 0)),
        };
      });
      assert.equal(
        r.imagesBefore,
        r.totalImages,
        "All page images are loaded before scrolling",
      );
      assert.equal(
        r.scrollImageRequests,
        0,
        "No image requests start on scroll",
      );
      assert.equal(
        r.scrollScriptRequests,
        0,
        "No component scripts load on scroll",
      );
      results.push({ width, route, ...r });
      if (route === "/bunch-of-work") {
        const wall = p.locator(".dome-gallery");
        assert.equal(await wall.locator(".dome-tile").count(), 54);
        await wall.scrollIntoViewIfNeeded();
        await p.waitForFunction(
          () =>
            document.querySelector(".dome-gallery").dataset.visible === "true",
        );
        await p.mouse.wheel(0, 10);
        await p.waitForFunction(() =>
          document
            .querySelector(".dome-cylinder")
            .style.transform.includes("translateY"),
        );
        await p.getByLabel("Animation preference").selectOption("reduced");
        await p.waitForFunction(
          () => !document.querySelector(".dome-cylinder").style.transform,
        );
      }
      await p.close();
    }
  }
} finally {
  await b.close();
}
fs.writeFileSync(
  process.argv[2] || "/tmp/elvora-scroll-readiness.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results));
