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
