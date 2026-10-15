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
