import "server-only";
import { getFileProjects } from "@/data/projects";
import { getFileBots } from "@/data/bots";
import { skills } from "@/data/skills";
import { certificates } from "@/data/certificates";
import { site } from "@/data/site";
const database = () => process.env.CONTENT_SOURCE === "database";
export async function getProjects() {
  return database()
    ? (await import("./content")).databaseProjects()
    : getFileProjects();
}
export async function getBots() {
  return database()
    ? (await import("./content")).databaseBots()
    : getFileBots();
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
  return {
    brand: settings?.brand || site.brand,
    email: settings?.email || site.email,
    title: settings?.title || site.title,
    description: settings?.description || site.description,
  };
}
