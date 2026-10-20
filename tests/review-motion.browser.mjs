/** Real testimonial component, with local QA records that never enter site content. */
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { build } from "esbuild";
import { chromium } from "@playwright/test";
const bundle = await build({
  stdin: {
    contents: `import React from 'react';import{createRoot}from'react-dom/client';import{MotionProvider}from'./components/motion-provider';import{Testimonials}from'./components/testimonials';const reviews=location.search?[1,2,3,4].map(n=>({id:'qa-'+n,name:'Local QA record '+n,role:'Browser verification only',portrait:'',quote:'Explicit test record '+n+'. This is local verification content, never published as an endorsement.'})):[];createRoot(document.getElementById('root')).render(<MotionProvider><Testimonials testimonials={reviews}/></MotionProvider>);`,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  tsconfig: path.resolve("tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_SITE_URL": '""' },
  plugins: [
    {
      name: "unused-portrait",
      setup(b) {
        b.onResolve({ filter: /^next\/image$/ }, () => ({
          path: "image",
          namespace: "qa",
        }));
        b.onLoad({ filter: /.*/, namespace: "qa" }, () => ({
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
  "theme-tokens",
  "atelier",
  "pages",
]
  .map((n) => fs.readFileSync("app/" + n + ".css", "utf8"))
  .join("\n");
const server = http.createServer((req, res) => {
  if (req.url === "/bundle.js") {
    res.setHeader("Content-Type", "text/javascript");
    res.end(bundle.outputFiles[0].text);
  } else if (req.url === "/styles.css") {
    res.setHeader("Content-Type", "text/css");
    res.end(styles);
  } else
    res.end(
      '<!doctype html><html lang="en" data-theme="light" data-motion="full"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local testimonial QA</title><link rel="stylesheet" href="/styles.css"></head><body><main id="root"></main><script src="/bundle.js"></script></body></html>',
    );
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [390, 700, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const genuine of [false, true]) {
      await page.goto(
        `http://127.0.0.1:${server.address().port}/${genuine ? "?genuine" : ""}`,
      );
      await page
        .getByRole("heading", { name: "Testimonials.", exact: true })
        .waitFor();
      assert.equal(await page.locator(".testimonial-card").count(), genuine ? 4 : 0);
      assert.equal(
        await page.locator('[data-sample="true"]').count(),
        0,
      );
      assert.equal(
        await page.locator(".testimonial-sample-note").count(),
        0,
      );
      const columns = await page
        .locator(".testimonials-grid")
        .evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
        );
      assert.equal(columns, width === 390 ? 1 : width === 700 ? 2 : 3);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (!genuine) {
        assert.equal(await page.locator(".testimonial-sample-label").count(), 0);
        const feedback = page.getByRole("link", { name: "Send your feedback", exact: true });
        assert.ok(await feedback.isVisible());
        assert.match(await feedback.getAttribute("href"), /^mailto:/);
        assert.equal(await page.getByText(/Nora Vale|Ethan Reed|Maya Lane|Omar Ellis/).count(), 0);
      }
      if (genuine)
        assert.match(
          await page.locator(".testimonial-card").first().innerText(),
          /Local QA record 1/,
        );
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS testimonials: three/two/one columns, no fabricated reviews, feedback invitation and genuine review rendering, no overflow or runtime errors.",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
