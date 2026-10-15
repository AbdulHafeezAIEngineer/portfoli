## scripts/capture.ts

``````typescript
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
``````

## scripts/generate-certificate.mjs

``````javascript
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(
  root,
  "public/certificates/prompt-engineering-placeholder.png",
);
try {
  await fs.access(destination);
  console.log("Existing certificate image preserved.");
} catch {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1120" viewBox="0 0 1600 1120"><rect width="1600" height="1120" fill="#15151f"/><rect x="55" y="55" width="1490" height="1010" rx="10" fill="none" stroke="#d4af37" stroke-opacity=".4"/><path d="M120 200h1360M120 900h1360" stroke="#ffffff" stroke-opacity=".12"/><g font-family="sans-serif" text-anchor="middle"><text x="800" y="150" font-size="22" letter-spacing="8" fill="#d4af37">ELVORA / CERTIFICATION</text><text x="800" y="410" font-size="38" fill="#d4af37">[PLACEHOLDER]</text><text x="800" y="515" font-size="64" fill="#f3f1eb">Prompt Engineering</text><text x="800" y="595" font-size="26" fill="#b8b5c5">Replace with your actual degree or certificate image.</text><text x="800" y="710" font-size="22" fill="#b8b5c5">No issuer, award date, or credential has been supplied.</text><text x="800" y="975" font-size="20" letter-spacing="3" fill="#d4af37">NOT A CREDENTIAL / IMAGE PENDING</text></g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(destination);
  console.log("Clearly marked PNG certificate placeholder generated.");
}
``````

## scripts/generate-client.mjs

``````javascript
import internals from "@prisma/internals";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Pinned Prisma 6.19 compiler: generate the JS driver client using its WASM parser.
// This avoids downloading native query/schema tools just to generate a client.
const generators = await internals.getGenerators({
  schemaPath: "prisma/schema.prisma",
  skipDownload: true,
  registry: {
    "prisma-client-js": {
      type: "rpc",
      generatorPath: require.resolve("@prisma/client/generator-build"),
      isNode: true,
    },
  },
});
for (const generator of generators) {
  try {
    await generator.generate();
  } finally {
    generator.stop();
  }
}
console.log("Prisma JavaScript client generated.");
``````

## scripts/reset-admin.ts

``````typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { strongPassword } from "../lib/admin/password";
async function main() {
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: [],
  });
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || !strongPassword(password))
      throw new Error("Invalid private reset settings");
    await db.$transaction(async (tx) => {
      const user = await tx.adminUser.update({
        where: { email },
        data: {
          passwordHash: await hash(password, 12),
          passwordVersion: { increment: 1 },
          failedAttempts: 0,
          lockedUntil: null,
          ...(process.env.RESET_ADMIN_2FA === "true"
            ? { totpSecret: null, totpLastStep: null }
            : {}),
        },
      });
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "password-reset-cli",
          resource: "security",
          recordId: user.id,
        },
      });
    });
    console.log(
      "Admin password reset. Existing sessions are invalidated on their next server check.",
    );
  } catch {
    console.error(
      "Reset failed. Check private settings and database availability. No credentials are printed.",
    );
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "Operation failed. Check the documented environment and installation requirements.",
  );
  process.exitCode = 1;
});
``````

