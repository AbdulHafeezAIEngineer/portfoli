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

## prisma/migrations/202610170001_agency_content_and_leads/migration.sql

``````sql
ALTER TABLE "ContactMessage" ADD COLUMN "company" TEXT NOT NULL DEFAULT '', ADD COLUMN "service" TEXT NOT NULL DEFAULT '', ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new', ADD COLUMN "notes" TEXT NOT NULL DEFAULT '', ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ContactMessage" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_status_check" CHECK ("status" IN ('new','contacted','in-progress','closed'));
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status","createdAt");
ALTER TABLE "SiteSettings" ALTER COLUMN "email" SET DEFAULT 'abdulhafeez@elvoraai.online';
CREATE TABLE "Service" ("id" TEXT NOT NULL PRIMARY KEY,"title" TEXT NOT NULL,"description" TEXT NOT NULL,"detail" TEXT NOT NULL,"tags" TEXT[] NOT NULL,"scope" TEXT[] NOT NULL,"requirements" TEXT[] NOT NULL,"order" INTEGER NOT NULL DEFAULT 0,"published" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "Faq" ("id" TEXT NOT NULL PRIMARY KEY,"question" TEXT NOT NULL,"answer" TEXT NOT NULL,"order" INTEGER NOT NULL DEFAULT 0,"published" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "Testimonial" ("id" TEXT NOT NULL PRIMARY KEY,"name" TEXT NOT NULL,"role" TEXT NOT NULL,"quote" TEXT NOT NULL,"portrait" TEXT NOT NULL DEFAULT '',"permissionConfirmed" BOOLEAN NOT NULL DEFAULT false,"order" INTEGER NOT NULL DEFAULT 0,"published" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Testimonial_permission_check" CHECK (NOT "published" OR "permissionConfirmed"));
``````

## prisma/migrations/migration_lock.toml

``````toml
provider = "postgresql"
``````

## prisma/schema.prisma

``````prisma
generator client {
  provider = "prisma-client-js"
  engineType = "client"
  output = "../node_modules/.prisma/client"
}
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
model AdminUser {
  id String @id @default(cuid())
  email String @unique
  passwordHash String
  passwordVersion Int @default(1)
  failedAttempts Int @default(0)
  lockedUntil DateTime?
  totpSecret String?
  totpLastStep Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Project {
  id String @id
  title String
  subtitle String
  industry String
  description String
  stack String[]
  accent String @default("#d4af37")
  demoUrl String
  highlights String[]
  order Int @default(0)
  published Boolean @default(true)
  images ProjectImage[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model ProjectImage {
  id String @id @default(cuid())
  projectId String
  project Project @relation(fields:[projectId],references:[id],onDelete:Cascade)
  src String
  title String
  alt String
  order Int @default(0)
  @@index([projectId,order])
}
model Bot {
  id String @id
  name String
  description String
  tags String[]
  method String
  kind String
  welcome String
  starters String[]
  note String
  config Json?
  systemPrompt String?
  order Int @default(0)
  published Boolean @default(true)
  updatedAt DateTime @updatedAt
}
model Skill {
  id String @id
  name String
  category String
  order Int @default(0)
  published Boolean @default(true)
}
model Certificate {
  id String @id
  title String
  issuer String
  dateLabel String
  issuedAt String?
  description String
  image String
  alt String
  isPlaceholder Boolean @default(true)
  order Int @default(0)
  published Boolean @default(true)
}
model ContactMessage {
  id String @id @default(cuid())
  name String
  email String
  message String
  company String @default("")
  service String @default("")
  status String @default("new")
  notes String @default("")
  updatedAt DateTime @updatedAt
  read Boolean @default(false)
  deliveryStatus String @default("pending")
  createdAt DateTime @default(now())
  @@index([createdAt])
  @@index([status,createdAt])
}
model ChatLog {
  id String @id @default(cuid())
  botId String
  userMessage String
  reply String
  createdAt DateTime @default(now())
  @@index([createdAt])
}
model SiteSettings {
  id String @id @default("main")
  brand String @default("Elvora")
  email String @default("abdulhafeez@elvoraai.online")
  title String
  description String
  chatLogging Boolean @default(false)
  updatedAt DateTime @updatedAt
}
model AuditLog {
  id String @id @default(cuid())
  adminId String
  action String
  resource String
  recordId String?
  createdAt DateTime @default(now())
  @@index([createdAt])
}
model Service {
  id String @id
  title String
  description String
  detail String
  tags String[]
  scope String[]
  requirements String[]
  order Int @default(0)
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Faq {
  id String @id
  question String
  answer String
  order Int @default(0)
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Testimonial {
  id String @id
  name String
  role String
  quote String
  portrait String @default("")
  permissionConfirmed Boolean @default(false)
  order Int @default(0)
  published Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
``````

## prisma/seed.ts

``````ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";
import { services, faqs } from "../data/agency";
import { projects } from "../data/projects";
import { getFileBots, realBotConfig, additionalBots } from "../data/bots";
import { skills } from "../data/skills";
import { certificates } from "../data/certificates";
import { site } from "../data/site";

async function main() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SEED_CONTENT !== "demo"
  )
    throw new Error("Demo seed requires SEED_CONTENT=demo outside production.");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: [],
  });
  try {
    for (const [order, service] of services.entries())
      await db.service.upsert({
        where: { id: service.id },
        update: {},
        create: { ...service, order, published: true },
      });
    for (const [order, faq] of faqs.entries())
      await db.faq.upsert({
        where: { id: faq.id },
        update: {},
        create: { ...faq, order, published: true },
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
      const { configured: _configured, provider: _provider, ...data } = bot;
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
      "Development content imported. Existing records were preserved; no administrator or reviews were created.",
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
