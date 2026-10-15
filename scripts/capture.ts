import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { demos } from "../data/demos";
async function main() {
  const base = process.env.CAPTURE_BASE_URL || "http://127.0.0.1:3100";
  const ownServer = !process.env.CAPTURE_BASE_URL;
  const server = ownServer
    ? spawn("npm", ["run", "dev", "--", "--port", "3100"], {
        stdio: "ignore",
        detached: process.platform !== "win32",
      })
    : null;
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      try {
        const response = await fetch(`${base}/demo/restaurant`, {
          signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready)
      throw new Error(
        "Capture server did not become ready. Set CAPTURE_BASE_URL to your running app.",
      );
    let executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
    if (!executablePath) {
      try {
        await access("/usr/bin/chromium");
        executablePath = "/usr/bin/chromium";
      } catch {}
    }
    browser = await chromium.launch({
      executablePath,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const output = path.join(process.cwd(), "public/projects");
    await mkdir(output, { recursive: true });
    for (const slug of Object.keys(demos)) {
      const page = await desktop.newPage();
      const phone = await mobile.newPage();
      await page.goto(`${base}/demo/${slug}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await phone.goto(`${base}/demo/${slug}`, { waitUntil: "networkidle" });
      await phone.evaluate(() => document.fonts.ready);
      for (const [number, target] of [
        [1, "home"],
        [2, "inner"],
        [4, "feature"],
      ] as const) {
        await page.evaluate((part) => {
          const element = document.querySelector(`[data-capture="${part}"]`);
          window.scrollTo({
            top:
              part === "home"
                ? 0
                : (element?.getBoundingClientRect().top || 0) + scrollY,
            behavior: "instant",
          });
        }, target);
        const bytes = await page.screenshot({ animations: "disabled" });
        await sharp(bytes)
          .webp({ quality: 88 })
          .toFile(path.join(output, `${slug}-${number}.webp`));
      }
      await sharp(await phone.screenshot({ animations: "disabled" }))
        .webp({ quality: 88 })
        .toFile(path.join(output, `${slug}-3.webp`));
      await writeFile(
        path.join(output, `${slug}-capture.json`),
        JSON.stringify(
          {
            source: `/demo/${slug}`,
            desktop: [1440, 900],
            mobile: [390, 844],
            scale: 2,
            method: "Chromium screenshots of actual local concept pages",
          },
          null,
          2,
        ),
      );
      await page.close();
      await phone.close();
      console.log(`Captured ${slug}: 4 real page screenshots.`);
    }
    await desktop.close();
    await mobile.close();
  } finally {
    await browser?.close();
    if (server?.pid) {
      if (process.platform !== "win32") {
        try {
          process.kill(-server.pid, "SIGTERM");
        } catch {}
      } else server.kill();
    }
  }
}
main().catch(() => {
  console.error(
    "Operation failed. Check the documented environment and installation requirements.",
  );
  process.exitCode = 1;
});
