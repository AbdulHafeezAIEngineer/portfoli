## scripts/bootstrap-admin.ts

``````ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { strongPassword } from "../lib/admin/password";
import { site } from "../data/site";
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (
    !process.env.DATABASE_URL ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !password ||
    !strongPassword(password)
  )
    throw new Error("Invalid private bootstrap settings.");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: [],
  });
  try {
    const passwordHash = await hash(password, 12);
    await db.$transaction(
      async (tx) => {
        if (await tx.adminUser.count())
          throw new Error(
            "An administrator already exists. Use documented recovery.",
          );
        await tx.adminUser.create({ data: { email, passwordHash } });
        await tx.siteSettings.upsert({
          where: { id: "main" },
          update: {},
          create: {
            id: "main",
            brand: site.brand,
            email: site.email,
            title: site.title,
            description: site.description,
          },
        });
      },
      { isolationLevel: "Serializable" },
    );
    console.log(
      "Initial administrator created. No credentials were printed. Remove ADMIN_PASSWORD from the runtime environment.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "Bootstrap refused or failed. Check the database, password requirements and whether an administrator already exists. No credentials were printed.",
  );
  process.exitCode = 1;
});
``````

## scripts/capture-studies.ts

``````ts
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
``````

## scripts/capture.ts

``````ts
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, access, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { concepts } from "../data/concepts";
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
        const response = await fetch(`${base}/demo/solenne`, {
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
    for (const slug of Object.keys(concepts)) {
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

## scripts/generate-image-previews.mjs

``````javascript
// Regenerate tiny local placeholders without modifying the source images.
import fs from "node:fs";
import sharp from "sharp";
const paths = ["projects", "studies", "certificates"].flatMap((folder) =>
  fs
    .readdirSync(`public/${folder}`)
    .filter(
      (name) =>
        name.endsWith(".webp") &&
        (folder !== "projects" ||
          /^(solenne|vanta|aster|kovo)-\d\.webp$/.test(name)),
    )
    .map((name) => `/${folder}/${name}`),
);
const previews = {};
for (const src of paths) {
  const buffer = await sharp(`public${src}`)
    .resize({ width: 16, withoutEnlargement: true })
    .webp({ quality: 35 })
    .toBuffer();
  previews[src] = `data:image/webp;base64,${buffer.toString("base64")}`;
}
fs.writeFileSync(
  "data/image-previews.ts",
  `// Generated by scripts/generate-image-previews.mjs. Local, non-sensitive assets only.\nexport const imagePreviews: Record<string, string> = ${JSON.stringify(previews, null, 2)};\n`,
);
console.log(`Generated ${paths.length} tiny local image placeholders.`);
``````

## scripts/package-source.py

``````python
"""Refresh the reviewable source snapshot without private/local runtime files."""
from pathlib import Path
import hashlib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE = {".git", ".next", "node_modules", "delivery", "coverage", "out", "__pycache__"}
files = []
for path in sorted(ROOT.rglob("*")):
    relative = path.relative_to(ROOT)
    if not path.is_file() or any(part in EXCLUDE for part in relative.parts):
        continue
    if path.name.startswith(".env") and path.name != ".env.example":
        continue
    if path.name == "next-env.d.ts" or path.name.endswith((".log", ".tsbuildinfo")):
        continue
    files.append(path)

delivery = ROOT / "delivery"
delivery.mkdir(exist_ok=True)
groups = [("root", [path for path in files if len(path.relative_to(ROOT).parts) == 1])]
groups += [(name, [path for path in files if path.relative_to(ROOT).parts[0] == name]) for name in sorted({path.relative_to(ROOT).parts[0] for path in files if len(path.relative_to(ROOT).parts) > 1})]
links = []
for number, (name, paths) in enumerate(groups, 1):
    destination = f"{number:02d}-{name}.md"
    chunks = []
    for path in paths:
        relative = path.relative_to(ROOT).as_posix()
        data = path.read_bytes()
        try:
            content = data.decode("utf-8")
        except UnicodeDecodeError:
            chunks.append(f"## {relative}\n\nBinary asset: {len(data)} bytes. SHA-256 `{hashlib.sha256(data).hexdigest()}`. Available in the repository and source ZIP.\n")
            continue
        extension = path.suffix.lstrip(".")
        language = {"tsx": "tsx", "ts": "ts", "mjs": "javascript", "py": "python", "svg": "xml"}.get(extension, extension or "text")
        chunks.append(f"## {relative}\n\n``````{language}\n{content.rstrip()}\n``````\n")
    (delivery / destination).write_text("\n".join(chunks))
    links.append(f"- [{name}]({destination})")

structure = "\n".join(path.relative_to(ROOT).as_posix() for path in files)
intro = f"""# Elvora — complete source review

Generated from the current checkout. Private environment values, Git metadata, dependencies and build artifacts are excluded. Binary assets remain in the repository/ZIP; text sections provide their hashes.

Next.js 15.5.28 is the owner-approved upgrade. Public content defaults to files; durable inquiries can be enabled separately. Run reviewed migrations and `npm run admin:bootstrap` with private settings to create the first administrator. `SEED_CONTENT=demo npm run db:seed` is development-only and refuses production. Genuine reviews require publication permission; no invented feedback is shown.

See [verification](../VERIFICATION.md), [deployment](../DEPLOYMENT.md), [security status](../SECURITY_STATUS.md) and [audit](../AGENCY_AUDIT.md). Production dependency audit is clean; an upstream development-tool finding remains. Local tests do not prove live provider/deployment success.

## Folder structure

```text
{structure}
```

## Database schema

``````prisma
{(ROOT / 'prisma/schema.prisma').read_text().rstrip()}
``````

## Source by folder

{chr(10).join(links)}
"""
(delivery / "README.md").write_text(intro)
combined = intro + "\n\n" + "\n\n".join((delivery / link.split("(")[1].split(")")[0]).read_text() for link in links)
(ROOT.parent / "elvora-complete-source.md").write_text(combined)
with zipfile.ZipFile(ROOT.parent / "elvora-complete.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, "elvora/" + path.relative_to(ROOT).as_posix())
print(f"Source snapshot refreshed: {len(files)} files, {len(groups)} folder sections. No private runtime files included.")
``````

## scripts/prepare-production.ts

``````ts
/** Explicit private deployment operation; never a public setup endpoint. */
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { passwordRequirements } from "../lib/admin/password";
import { site } from "../data/site";
import {
  databaseSetupFailure,
  validPostgresConnection,
} from "../lib/admin/setup-errors";

class SetupError extends Error {}

async function main() {
  if (process.env.ADMIN_BOOTSTRAP_ON_BUILD !== "true") return;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    console.log(
      "Private owner setup skipped for a non-production Vercel deployment.",
    );
    return;
  }
  const required = [
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
  ] as const;
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length)
    throw new SetupError(
      `Private owner setup needs: ${missing.join(", ")}. Add them in hosting environment settings.`,
    );
  for (const key of ["DATABASE_URL", "DIRECT_URL"] as const)
    if (!validPostgresConnection(process.env[key]!))
      throw new SetupError(
        `${key} must contain only the complete PostgreSQL URL, not the variable name, quotes, a password alone or masked asterisks. No credentials were printed.`,
      );
  if ((process.env.NEXTAUTH_SECRET?.length || 0) < 32)
    throw new SetupError(
      "NEXTAUTH_SECRET must contain at least 32 random characters.",
    );
  let origin: URL;
  try {
    origin = new URL(process.env.NEXTAUTH_URL!);
  } catch {
    throw new SetupError(
      "NEXTAUTH_URL must be the canonical HTTPS website origin.",
    );
  }
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new SetupError(
      "NEXTAUTH_URL must be the canonical HTTPS website origin.",
    );
  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    new URL(process.env.NEXT_PUBLIC_SITE_URL).origin !== origin.origin
  )
    throw new SetupError(
      "NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL must use the same canonical HTTPS origin.",
    );
  const redisUrl =
    process.env.AUTH_REDIS_REST_URL || process.env.CHAT_REDIS_REST_URL;
  const redisToken =
    process.env.AUTH_REDIS_REST_TOKEN || process.env.CHAT_REDIS_REST_TOKEN;
  if (
    redisUrl || redisToken
      ? !(redisUrl && redisToken)
      : process.env.VERCEL === "1" ||
        process.env.AUTH_ALLOW_IN_MEMORY_LIMITER !== "true"
  )
    throw new SetupError(
      "Configure shared AUTH_REDIS_REST_URL and AUTH_REDIS_REST_TOKEN for owner login protection.",
    );
  const migration = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env: process.env, encoding: "utf8", timeout: 120000 },
  );
  if (migration.status !== 0)
    throw new SetupError(
      "Database migration failed. Check private connection settings and migration access; no connection strings were printed.",
    );
  console.log("Reviewed database migrations applied.");
  const db = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      connectionTimeoutMillis: 5000,
    }),
    log: [],
  });
  try {
    // Existing owners/passwords are always preserved, even if the flag remains enabled.
    let existingOwners: number;
    try {
      existingOwners = await db.adminUser.count();
    } catch (error) {
      throw new SetupError(databaseSetupFailure(error));
    }
    if (existingOwners) {
      console.log(
        "Existing administrator preserved. Private owner setup complete.",
      );
      return;
    }
    const email = (process.env.ADMIN_EMAIL || site.email).trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
      throw new SetupError(
        "ADMIN_EMAIL must contain a valid owner email address. Set it privately in Vercel Production environment variables.",
      );
    const requirements = passwordRequirements(password);
    if (requirements.length)
      throw new SetupError(
        `ADMIN_PASSWORD needs ${requirements.join(", ")}. Update the Secret in Vercel Production and redeploy. No credentials were printed.`,
      );
    const passwordHash = await hash(password!, 12);
    await db.$transaction(
      async (tx) => {
        if (await tx.adminUser.count())
          throw new SetupError(
            "An administrator was created concurrently; retry the deployment. No existing password was changed.",
          );
        await tx.adminUser.create({ data: { email, passwordHash } });
        await tx.siteSettings.upsert({
          where: { id: "main" },
          update: {},
          create: {
            id: "main",
            brand: site.brand,
            email: site.email,
            title: site.title,
            description: site.description,
          },
        });
      },
      { isolationLevel: "Serializable" },
    );
    console.log(
      "First owner account created. Remove ADMIN_PASSWORD and disable ADMIN_BOOTSTRAP_ON_BUILD after this deployment. No credentials were printed.",
    );
  } finally {
    await db.$disconnect();
  }
}
main().catch((error) => {
  // Only deliberately authored setup messages may enter deployment logs.
  const message =
    error instanceof SetupError
      ? error.message
      : "Private owner setup failed. Check the database and deployment settings. No credentials were printed.";
  console.error(message);
  process.exitCode = 1;
});
``````

## scripts/reset-admin.ts

``````ts
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
