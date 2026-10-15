import "server-only";
import { db } from "./db";
import type { ProjectView } from "@/data/projects";
import type { Skill } from "@/data/skills";
import type { Certificate } from "@/data/certificates";
import type { Bot, RealBotConfig } from "@/data/bots";
import { connectionSchema } from "./admin/schemas";
export async function databaseProjects(): Promise<ProjectView[]> {
  const rows = await db.project.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: { images: { orderBy: [{ order: "asc" }, { id: "asc" }] } },
  });
  return rows
    .filter((row) => row.images.length)
    .map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      industry: row.industry,
      description: row.description,
      stack: row.stack,
      accent: row.accent,
      demoUrl: row.demoUrl,
      highlights: row.highlights,
      screenshots: row.images.map(({ src, title, alt }) => ({
        src,
        title,
        alt,
      })),
    }));
}
export async function databaseSkills(): Promise<Skill[]> {
  return db.skill.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true, name: true, category: true },
  });
}
export async function databaseCertificates(): Promise<Certificate[]> {
  const rows = await db.certificate.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return rows.map(
    ({
      id,
      title,
      issuer,
      dateLabel,
      issuedAt,
      description,
      image,
      alt,
      isPlaceholder,
    }) => ({
      id,
      title,
      issuer,
      dateLabel,
      issuedAt,
      description,
      image,
      alt,
      isPlaceholder,
    }),
  );
}
export async function databaseBots(): Promise<Bot[]> {
  const rows = await db.bot.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return rows.map((row) => {
    const parsed = connectionSchema.safeParse(row.config);
    const config = parsed.success ? parsed.data : null;
    const configured = config
      ? config.method === "iframe"
        ? !!config.url
        : config.method === "script"
          ? !!config.src
          : !!config.endpoint
      : row.kind === "demo" || !!row.systemPrompt;
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      tags: row.tags,
      method: row.method as Bot["method"],
      kind: row.kind as Bot["kind"],
      configured,
      welcome: row.welcome,
      starters: row.starters,
      note: row.note,
    };
  });
}
export async function databaseBot(
  id: string,
): Promise<{ config: RealBotConfig | null; prompt: string | null } | null> {
  const row = await db.bot.findUnique({ where: { id } });
  if (!row?.published) return null;
  const parsed = connectionSchema.safeParse(row.config);
  return {
    config: parsed.success ? parsed.data : null,
    prompt: row.systemPrompt,
  };
}
export async function publicSettings() {
  return db.siteSettings.findUnique({
    where: { id: "main" },
    select: {
      brand: true,
      email: true,
      title: true,
      description: true,
      chatLogging: true,
    },
  });
}
