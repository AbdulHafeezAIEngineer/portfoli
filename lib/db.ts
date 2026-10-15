import { PrismaPg } from "@prisma/adapter-pg";
import "server-only";
import { PrismaClient } from "@prisma/client";
const runtime = globalThis as typeof globalThis & {
  elvoraPrisma?: PrismaClient;
};
export const db =
  runtime.elvoraPrisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    }),
    log: [],
  });
if (process.env.NODE_ENV !== "production") runtime.elvoraPrisma = db;
export const databaseContent = () => process.env.CONTENT_SOURCE === "database";
