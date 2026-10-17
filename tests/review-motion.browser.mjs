/** Actual review component with explicit local QA records; no provider, CMS or public fixture route. */
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { build } from "esbuild";
import { chromium } from "@playwright/test";

const root = process.cwd();
const bundle = await build({
  stdin: {
    contents: `import React from 'react'; import {createRoot} from 'react-dom/client';
      import {MotionProvider} from './components/motion-provider';
      import {MotionControl} from './components/motion-preference';
      import {WallOfLove} from './components/wall-of-love';
      const reviews = [1,2,3].map(n=>({id:'local-qa-'+n,name:'Local review fixture '+n,role:'Browser verification only',portrait:'',quote:'Explicit QA review '+n+'. This is test content for checking smooth card transitions, keyboard controls and touch navigation. It is never published as a client endorsement.'}));
      createRoot(document.getElementById('root')).render(<MotionProvider><MotionControl/><WallOfLove testimonials={reviews}/></MotionProvider>);`,
    resolveDir: root,
    loader: "tsx",
  },
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  tsconfig: path.join(root, "tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    {
      name: "unused-portrait",
      setup(builder) {
        // These QA records have no portraits. The real image component is covered by application tests.
        builder.onResolve({ filter: /^next\/image$/ }, () => ({
          path: "unused-image",
          namespace: "qa",
        }));
        builder.onLoad({ filter: /.*/, namespace: "qa" }, () => ({
          contents: "export default function Image(){return null}",
          loader: "js",
        }));
      },
    },
  ],
});
const styles = [
  "globals",
  "studio",
  "editorial",
  "refinement",
  "reference-motion",
]
  .map((name) => fs.readFileSync(path.join(root, "app", name + ".css"), "utf8"))
  .join("\n") + "\n.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}";
const server = http.createServer((request, response) => {
  if (request.url === "/bundle.js") {
    response.setHeader("Content-Type", "text/javascript");
    response.end(bundle.outputFiles[0].text);
  } else if (request.url === "/style.css") {
    response.setHeader("Content-Type", "text/css");
    response.end(styles);
  } else {
    response.setHeader("Content-Type", "text/html");
    response.end(
      '<!doctype html><html lang="en" data-theme="dark" data-motion="full"><head><title>Local review motion QA</title><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><main id="root"></main><script src="/bundle.js"></script></body></html>',
    );
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base);
  const stage = page.getByRole("region", { name: "Testimonials" });
  await stage.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      document.querySelector(".love-stage").dataset.rotationActive === "true",
  );
  const slide = page.getByRole("group", { name: /^Review \d of 3$/ });
  await page.waitForFunction(
    () =>
      document.querySelector(".love-stage").dataset.rotationActive === "true",
  );
  assert.equal(await slide.count(), 1);
  await page.getByRole("button", { name: "Next review" }).click();
  await page.getByRole("group", { name: "Review 2 of 3" }).waitFor();
  assert.equal(await slide.count(), 1);
  assert.equal(
    await page.locator(".love-stage").getAttribute("data-rotation-active"),
    "false",
  );
  await stage.focus();
  await page.keyboard.press("ArrowLeft");
  await page.getByRole("group", { name: "Review 1 of 3" }).waitFor();
  // Restart, then remove focus/hover so autoplay can run; entering the card pauses it.
  await page.getByRole("button", { name: "Play review rotation" }).click();
  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.move(0, 0);
  await page.waitForFunction(
    () =>
      document.querySelector(".love-stage").dataset.rotationActive === "true",
  );
  await page
    .getByRole("group", { name: "Review 2 of 3" })
    .waitFor({ timeout: 9000 });
  await stage.hover();
  await page.waitForFunction(
    () =>
      document.querySelector(".love-stage").dataset.rotationActive === "false",
  );
  await page.getByLabel("Animation preference").selectOption("system");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () => document.querySelector(".love-progress").dataset.autoplay === "false",
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Play review rotation" })
      .isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Next review" }).click();
  await page.getByRole("group", { name: "Review 3 of 3" }).waitFor();
  assert.deepEqual(errors, []);
  await page.close();
  const touch = await browser.newPage({
    viewport: { width: 390, height: 900 },
    hasTouch: true,
    isMobile: true,
  });
  await touch.goto(base);
  await touch
    .getByRole("region", { name: "Testimonials" })
    .scrollIntoViewIfNeeded();
  await touch
    .locator(".love-stage")
    .dispatchEvent("pointerdown", {
      pointerType: "touch",
      clientX: 300,
      clientY: 350,
    });
  await touch
    .locator(".love-stage")
    .dispatchEvent("pointerup", {
      pointerType: "touch",
      clientX: 150,
      clientY: 355,
    });
  await touch.getByRole("group", { name: "Review 2 of 3" }).waitFor();
  assert.equal(
    await touch.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await touch.close();
  console.log(
    "PASS actual review component: one accessible slide, next/keyboard controls, autoplay advance, focus/hover pause, touch swipe and mobile overflow. QA records never enter application content.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
