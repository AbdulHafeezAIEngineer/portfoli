/** Explicit private deployment operation; never a public setup endpoint. */
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { passwordRequirements } from "../lib/admin/password";
import { loginRedisConfiguration } from "../lib/admin/redis-configuration";
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
  const { url: redisUrl, token: redisToken } = loginRedisConfiguration();
  if (
    redisUrl || redisToken
      ? !(redisUrl && redisToken)
      : process.env.VERCEL === "1" ||
        process.env.AUTH_ALLOW_IN_MEMORY_LIMITER !== "true"
  )
    throw new SetupError(
      "Configure a complete shared Redis REST URL/token pair for owner login protection (AUTH_REDIS_REST_*, KV_REST_API_* or UPSTASH_REDIS_REST_*).",
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
