## prisma/migrations/202610150001_initial/migration.sql

``````sql
-- Initial PostgreSQL schema derived from the pinned Prisma data model.

CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordVersion" INTEGER NOT NULL DEFAULT 1,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "totpSecret" TEXT,
    "totpLastStep" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stack" TEXT[] NOT NULL,
    "accent" TEXT NOT NULL DEFAULT '#d4af37',
    "demoUrl" TEXT NOT NULL,
    "highlights" TEXT[] NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL,
    "method" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "welcome" TEXT NOT NULL,
    "starters" TEXT[] NOT NULL,
    "note" TEXT NOT NULL,
    "config" JSONB,
    "systemPrompt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "issuedAt" TEXT,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatLog" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "brand" TEXT NOT NULL DEFAULT 'Elvora',
    "email" TEXT NOT NULL DEFAULT 'buildwithelvora@gmail.com',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chatLogging" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "recordId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "ProjectImage_projectId_order_idx" ON "ProjectImage"("projectId","order");
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");
CREATE INDEX "ChatLog_createdAt_idx" ON "ChatLog"("createdAt");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
``````

## prisma/migrations/migration_lock.toml

``````toml
provider = "postgresql"
``````

## prisma/seed.ts

``````typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { projects } from "../data/projects";
import { getFileBots, realBotConfig, additionalBots } from "../data/bots";
import { skills } from "../data/skills";
import { certificates } from "../data/certificates";
import { site } from "../data/site";
import { strongPassword } from "../lib/admin/password";
async function main() {
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: [],
  });
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !password ||
      !strongPassword(password)
    )
      throw new Error(
        "Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (14+ characters, upper/lowercase, number, symbol; at most 72 UTF-8 bytes). No credentials are printed.",
      );
    const exists = await db.adminUser.findUnique({ where: { email } });
    if (!exists)
      await db.adminUser.create({
        data: { email, passwordHash: await hash(password, 12) },
      });
    for (const [order, project] of projects.entries()) {
      const { screenshots, promoPrompt: _prompt, ...data } = project;
      await db.project.upsert({
        where: { id: project.id },
        update: {},
        create: {
          ...data,
          order,
          images: {
            create: screenshots.map((image, order) => ({ ...image, order })),
          },
        },
      });
    }
    const savedSource = process.env.CONTENT_SOURCE;
    process.env.CONTENT_SOURCE = "files";
    for (const [order, bot] of getFileBots().entries()) {
      const { configured: _configured, ...data } = bot;
      await db.bot.upsert({
        where: { id: bot.id },
        update: {},
        create: {
          ...data,
          order,
          ...(bot.id === "real" ||
          additionalBots.some((botConfig) => botConfig.card.id === bot.id)
            ? {
                config: (bot.id === "real"
                  ? realBotConfig
                  : additionalBots.find(
                      (botConfig) => botConfig.card.id === bot.id,
                    )!.connection) as unknown as Prisma.InputJsonValue,
              }
            : {}),
        },
      });
    }
    process.env.CONTENT_SOURCE = savedSource;
    for (const [order, skill] of skills.entries())
      await db.skill.upsert({
        where: { id: skill.id },
        update: {},
        create: { ...skill, order },
      });
    for (const [order, certificate] of certificates.entries())
      await db.certificate.upsert({
        where: { id: certificate.id },
        update: {},
        create: { ...certificate, order },
      });
    await db.siteSettings.upsert({
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
    console.log(
      "Seed complete. Existing records and admin passwords were preserved.",
    );
  } catch {
    console.error(
      "Seed failed. Check environment settings, password requirements and database connectivity. No secrets are printed.",
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

