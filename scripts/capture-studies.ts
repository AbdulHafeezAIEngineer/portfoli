import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { studies } from "../data/studies";
import { consentContent } from "../data/privacy";
async function main() {
  const base = process.env.CAPTURE_BASE_URL || "http://127.0.0.1:3110";
  const ownServer = !process.env.CAPTURE_BASE_URL;
  const server = ownServer
    ? spawn("npm", ["run", "dev", "--", "--port", "3110"], {
        stdio: "ignore",
        detached: process.platform !== "win32",
      })
    : null;
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      try {
        const response = await fetch(`${base}/studies/noma`, {
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
    await desktop.addInitScript(
      ({ key, version }) =>
        localStorage.setItem(
          key,
          JSON.stringify({ version, external: false, updatedAt: Date.now() }),
        ),
      { key: consentContent.key, version: consentContent.version },
    );
    const output = path.join(process.cwd(), "public/studies");
    await mkdir(output, { recursive: true });
    for (const study of studies) {
      const page = await desktop.newPage();
      await page.goto(`${base}/studies/${study.id}`, {
        waitUntil: "networkidle",
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images).map((image) =>
            image.decode().catch(() => {}),
          ),
        );
      });
      await sharp(await page.screenshot({ animations: "disabled" }))
        .webp({ quality: 90 })
        .toFile(path.join(output, `${study.id}.webp`));
      await page.close();
      console.log(`Captured ${study.id}: actual browser UI study.`);
    }
    await writeFile(
      path.join(output, "capture.json"),
      JSON.stringify(
        {
          source: "/studies/[slug]",
          studies: studies.map(({ id }) => id),
          viewport: [1440, 900],
          scale: 2,
          method:
            "Chromium captures of actual coded concept interfaces; fictional demo data",
        },
        null,
        2,
      ),
    );
    await desktop.close();
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
