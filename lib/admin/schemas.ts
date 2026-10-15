import { z } from "zod";
const text = (max = 300) => z.string().trim().min(1).max(max);
const id = text(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const local = z
  .string()
  .max(300)
  .regex(/^\/(?!\/)[A-Za-z0-9/_\-.]+$/);
export const imageUrl = z.union([
  local,
  z
    .string()
    .url()
    .max(1000)
    .refine((value) => {
      let url: URL;
      try {
        url = new URL(value);
      } catch {
        return false;
      }
      const host = process.env.BLOB_PUBLIC_HOST;
      return (
        !!host &&
        url.protocol === "https:" &&
        url.hostname === host &&
        !url.username &&
        !url.password
      );
    }, "Use a local image path or your configured Blob storage host."),
]);
const array = z.array(text()).max(20);
export const connectionSchema = z.discriminatedUnion("method", [
  z.object({ method: z.literal("iframe"), url: z.string().max(1000) }).strict(),
  z
    .object({
      method: z.literal("script"),
      src: z.string().max(1000),
      mountId: text(64).regex(/^[A-Za-z][A-Za-z0-9_-]*$/),
      attributes: z.record(
        z.string().regex(/^data-[a-z0-9_-]+$/),
        z.string().max(300),
      ),
      integrity: z
        .string()
        .regex(/^sha(256|384|512)-[A-Za-z0-9+/=]+$/)
        .optional(),
      botpress: z
        .object({
          configurationSrc: z
            .string()
            .max(1000)
            .regex(/^https:\/\/files\.bpcontent\.cloud\/[A-Za-z0-9/_-]+\.js$/),
        })
        .strict()
        .optional(),
    })
    .strict(),
  z
    .object({
      method: z.literal("api"),
      endpoint: z.string().max(1000),
      requestField: z.enum(["message", "messages"]),
      responsePath: z
        .string()
        .max(120)
        .regex(/^[A-Za-z0-9_.]*$/)
        .refine(
          (value) =>
            !value
              .split(".")
              .some((part) =>
                ["__proto__", "constructor", "prototype"].includes(part),
              ),
        ),
      authHeader: z.enum(["Authorization", "x-api-key"]),
      authPrefix: z
        .string()
        .max(30)
        .regex(/^[^\r\n]*$/),
    })
    .strict(),
]);
const shared = {
  id,
  published: z.boolean(),
  order: z.number().int().min(0).max(10000).optional(),
};
export const schemas = {
  projects: z
    .object({
      ...shared,
      title: text(),
      subtitle: text(),
      industry: text(),
      description: text(3000),
      stack: array,
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      demoUrl: z.union([z.literal(""), local]),
      highlights: array,
      screenshots: z
        .array(
          z.object({ src: imageUrl, title: text(), alt: text(500) }).strict(),
        )
        .min(1)
        .max(20),
    })
    .strict(),
  bots: z
    .object({
      ...shared,
      name: text(),
      description: text(2000),
      tags: array,
      method: z.enum(["api", "iframe", "script"]),
      kind: z.enum(["real", "demo", "custom"]),
      welcome: text(2000),
      starters: array,
      note: z.string().max(2000),
      config: connectionSchema.nullable(),
      systemPrompt: z.string().max(8000).nullable().optional(),
    })
    .strict()
    .refine(
      (bot) => !bot.config || bot.method === bot.config.method,
      "Embed method must match its connection configuration.",
    ),
  skills: z
    .object({
      ...shared,
      name: text(),
      category: z.enum([
        "AI tools",
        "Prompt engineering",
        "Web interfaces",
        "APIs & data",
        "Voice AI",
      ]),
    })
    .strict(),
  certificates: z
    .object({
      ...shared,
      title: text(),
      issuer: text(),
      dateLabel: text(),
      issuedAt: z
        .union([z.literal(""), z.string().date()])
        .nullable()
        .transform((value) => value || null),
      description: text(2000),
      image: imageUrl,
      alt: text(500),
      isPlaceholder: z.boolean(),
    })
    .strict(),
  settings: z
    .object({
      brand: text(80),
      email: z.string().email().max(254),
      title: text(),
      description: text(1000),
      chatLogging: z.boolean(),
    })
    .strict(),
};
