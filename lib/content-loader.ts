import "server-only";
import { getFileProjects } from "@/data/projects";
import { isBusinessAssistant } from "@/data/business-assistants";
import { chatIsConnected } from "./chat/config";
import { getFileBots } from "@/data/bots";
import { skills } from "@/data/skills";
import { certificates } from "@/data/certificates";
import { site } from "@/data/site";
import { services, faqs, type Testimonial } from "@/data/agency";
export function usesDatabaseContent() {
  const source = process.env.CONTENT_SOURCE || "files";
  if (source !== "files" && source !== "database")
    throw new Error("Invalid CONTENT_SOURCE.");
  return source === "database";
}
const database = usesDatabaseContent;
export async function getServices() {
  return database()
    ? (await import("./db")).db.service.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      })
    : services;
}
export async function getFaqs() {
  return database()
    ? (await import("./db")).db.faq.findMany({
        where: { published: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      })
    : faqs;
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return database()
    ? (await import("./db")).db.testimonial.findMany({
        where: { published: true, permissionConfirmed: true },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      })
    : [];
}

export async function getProjects() {
  return database()
    ? (await import("./content")).databaseProjects()
    : getFileProjects();
}
export async function getBots() {
  if (database()) return (await import("./content")).databaseBots();
  const bots = getFileBots();
  return bots.map((bot) =>
    isBusinessAssistant(bot.id)
      ? { ...bot, aiReady: chatIsConnected() }
      : bot,
  );
}
export async function getSkills() {
  return database() ? (await import("./content")).databaseSkills() : skills;
}
export async function getCertificates() {
  return database()
    ? (await import("./content")).databaseCertificates()
    : certificates;
}
export async function getIdentity() {
  const settings = database()
    ? await (await import("./content")).publicSettings()
    : null;
  if (database() && !settings)
    throw new Error(
      "Initialize site settings before enabling database content.",
    );
  return {
    brand: settings?.brand || site.brand,
    email: settings?.email || site.email,
    title: settings?.title || site.title,
    description: settings?.description || site.description,
  };
}
