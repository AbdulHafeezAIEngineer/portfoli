import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { leadStatus, schemas } from "@/lib/admin/schemas";
import {
  ChatError,
  checkOrigin,
  readJson,
  publicHttpsUrl,
} from "@/lib/chat/http";
import { limitLogin } from "@/lib/admin/rate-limit";
import { updateSecurity } from "@/lib/admin/security";
import { scriptDocument } from "@/lib/chat/embed";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const ordered = [{ order: "asc" as const }, { id: "asc" as const }];
function reply(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers });
}
function failure(error: unknown) {
  if (error instanceof ChatError)
    return reply({ error: error.message }, error.status);
  if (error instanceof z.ZodError)
    return reply(
      {
        error: error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; "),
      },
      422,
    );
  return reply({ error: "The request could not be completed." }, 503);
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    const resource = (await params).resource;
    if (["inbox", "chatlogs", "audit"].includes(resource)) {
      const query = new URL(request.url).searchParams;
      const pagination = z
        .object({
          page: z.coerce.number().int().min(1).max(100000).default(1),
          size: z.coerce.number().int().min(1).max(50).default(20),
          q: z.string().trim().max(200).default(""),
          sort: z.enum(["newest", "oldest"]).default("newest"),
          status: z.union([z.literal(""), leadStatus]).default(""),
        })
        .parse(Object.fromEntries(query));
      const { page, size, q, sort, status } = pagination;
      const options = {
        skip: (page - 1) * size,
        take: size,
        orderBy: [
          {
            createdAt: sort === "newest" ? ("desc" as const) : ("asc" as const),
          },
          { id: "asc" as const },
        ],
      };
      const contains = { contains: q, mode: "insensitive" as const };
      let items: unknown[], total: number;
      if (resource === "inbox") {
        const where = {
          ...(status ? { status } : {}),
          ...(q
            ? {
                OR: [
                  { name: contains },
                  { email: contains },
                  { company: contains },
                  { message: contains },
                ],
              }
            : {}),
        };
        [items, total] = await db.$transaction([
          db.contactMessage.findMany({ ...options, where }),
          db.contactMessage.count({ where }),
        ]);
      } else if (resource === "chatlogs") {
        const where = q
          ? {
              OR: [
                { botId: contains },
                { userMessage: contains },
                { reply: contains },
              ],
            }
          : {};
        [items, total] = await db.$transaction([
          db.chatLog.findMany({ ...options, where }),
          db.chatLog.count({ where }),
        ]);
      } else {
        const where = q
          ? {
              OR: [
                { action: contains },
                { resource: contains },
                { recordId: contains },
              ],
            }
          : {};
        [items, total] = await db.$transaction([
          db.auditLog.findMany({ ...options, where }),
          db.auditLog.count({ where }),
        ]);
      }
      return reply({
        items,
        total,
        page,
        pages: Math.max(1, Math.ceil(total / size)),
      });
    }
    switch (resource) {
      case "dashboard":
        const [projects, bots, messages, unread, newInquiries, recent] =
          await Promise.all([
            db.project.count(),
            db.bot.count(),
            db.contactMessage.count(),
            db.contactMessage.count({ where: { read: false } }),
            db.contactMessage.count({ where: { status: "new" } }),
            db.contactMessage.findMany({
              orderBy: { createdAt: "desc" },
              take: 5,
              select: { id: true, name: true, status: true, createdAt: true },
            }),
          ]);
        return reply({
          projects,
          bots,
          messages,
          unread,
          newInquiries,
          recent,
          twoFactor: !!user.totpSecret,
          contentSource: process.env.CONTENT_SOURCE || "files",
        });
      case "services":
        return reply(await db.service.findMany({ orderBy: ordered }));
      case "faqs":
        return reply(await db.faq.findMany({ orderBy: ordered }));
      case "testimonials":
        return reply(await db.testimonial.findMany({ orderBy: ordered }));
      case "projects":
        return reply(
          (
            await db.project.findMany({
              orderBy: ordered,
              include: { images: { orderBy: ordered } },
            })
          ).map(({ images, ...project }) => ({
            ...project,
            screenshots: images.map(({ src, title, alt }) => ({
              src,
              title,
              alt,
            })),
          })),
        );
      case "bots":
        return reply(await db.bot.findMany({ orderBy: ordered }));
      case "skills":
        return reply(await db.skill.findMany({ orderBy: ordered }));
      case "certificates":
        return reply(await db.certificate.findMany({ orderBy: ordered }));
      case "settings": {
        const row = await db.siteSettings.findUnique({ where: { id: "main" } });
        return reply(
          row
            ? {
                brand: row.brand,
                email: row.email,
                title: row.title,
                description: row.description,
                chatLogging: row.chatLogging,
              }
            : null,
        );
      }
      default:
        return reply({ error: "Not found." }, 404);
    }
  } catch (error) {
    return failure(error);
  }
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const body = await readJson(request);
    const resource = (await params).resource;
    if (resource === "security") {
      await limitLogin(Object.fromEntries(request.headers.entries()));
      return reply(await updateSecurity(user, body));
    }
    if (!(resource in schemas)) return reply({ error: "Not found." }, 404);
    const schema = schemas[resource as keyof typeof schemas];
    const data = schema.parse(body);
    if (resource === "bots") {
      const bot = schemas.bots.parse(body);
      const config = bot.config;
      if (config) {
        const destination =
          config.method === "iframe"
            ? config.url
            : config.method === "script"
              ? config.src
              : config.endpoint;
        const destinations = [destination];
        if (config.method === "script" && config.botpress) {
          scriptDocument(config);
          destinations.push(config.botpress.configurationSrc);
        }
        for (const destination of destinations.filter(Boolean)) {
          const url = publicHttpsUrl(destination);
          const allowed = (process.env.BOT_PROVIDER_ALLOWLIST || "")
            .split(",")
            .map((host) => host.trim().toLowerCase());
          if (!allowed.includes(url.hostname))
            throw new ChatError(
              422,
              "Add the provider hostname to BOT_PROVIDER_ALLOWLIST in private hosting settings first.",
            );
        }
      }
    }
    await db.$transaction(async (tx) => {
      switch (resource) {
        case "services": {
          const data = schemas.services.parse(body);
          await tx.service.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
          break;
        }
        case "faqs": {
          const data = schemas.faqs.parse(body);
          await tx.faq.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
          break;
        }
        case "testimonials": {
          const data = schemas.testimonials.parse(body);
          await tx.testimonial.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
          break;
        }
        case "projects": {
          const { screenshots, ...project } = schemas.projects.parse(body);
          await tx.project.upsert({
            where: { id: project.id },
            create: {
              ...project,
              images: {
                create: screenshots.map((image, order) => ({
                  ...image,
                  order,
                })),
              },
            },
            update: {
              ...project,
              images: {
                deleteMany: {},
                create: screenshots.map((image, order) => ({
                  ...image,
                  order,
                })),
              },
            },
          });
          break;
        }
        case "bots": {
          const bot = schemas.bots.parse(body);
          const value = {
            ...bot,
            config: bot.config
              ? (bot.config as Prisma.InputJsonValue)
              : Prisma.DbNull,
          };
          await tx.bot.upsert({
            where: { id: bot.id },
            create: value,
            update: value,
          });
          break;
        }
        case "skills": {
          const skill = schemas.skills.parse(body);
          await tx.skill.upsert({
            where: { id: skill.id },
            create: skill,
            update: skill,
          });
          break;
        }
        case "certificates": {
          const certificate = schemas.certificates.parse(body);
          await tx.certificate.upsert({
            where: { id: certificate.id },
            create: certificate,
            update: certificate,
          });
          break;
        }
        case "settings": {
          const settings = schemas.settings.parse(body);
          await tx.siteSettings.upsert({
            where: { id: "main" },
            create: { id: "main", ...settings },
            update: settings,
          });
          break;
        }
      }
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "save",
          resource,
          recordId: "id" in data ? data.id : "main",
        },
      });
    });
    return reply({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const { id } = z
      .object({ id: z.string().min(1).max(100) })
      .strict()
      .parse(await readJson(request));
    await db.$transaction(async (tx) => {
      switch ((await params).resource) {
        case "services":
          await tx.service.delete({ where: { id } });
          break;
        case "faqs":
          await tx.faq.delete({ where: { id } });
          break;
        case "testimonials":
          await tx.testimonial.delete({ where: { id } });
          break;
        case "projects":
          await tx.project.delete({ where: { id } });
          break;
        case "bots":
          await tx.bot.delete({ where: { id } });
          break;
        case "skills":
          await tx.skill.delete({ where: { id } });
          break;
        case "certificates":
          await tx.certificate.delete({ where: { id } });
          break;
        case "inbox":
          await tx.contactMessage.delete({ where: { id } });
          break;
        case "chatlogs":
          await tx.chatLog.delete({ where: { id } });
          break;
        default:
          throw new ChatError(404, "Not found.");
      }
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "delete",
          resource: (await params).resource,
          recordId: id,
        },
      });
    });
    return reply({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const body = await readJson(request);
    const resource = (await params).resource;
    if (resource === "inbox") {
      const data = z
        .object({
          id: z.string().min(1).max(100),
          read: z.boolean().optional(),
          status: leadStatus.optional(),
          notes: z.string().trim().max(5000).optional(),
        })
        .strict()
        .refine(
          (value) =>
            value.read !== undefined ||
            value.status !== undefined ||
            value.notes !== undefined,
          "Provide an update.",
        )
        .parse(body);
      await db.$transaction([
        db.contactMessage.update({
          where: { id: data.id },
          data: { read: data.read, status: data.status, notes: data.notes },
        }),
        db.auditLog.create({
          data: {
            adminId: user.id,
            action: "update-inquiry",
            resource,
            recordId: data.id,
          },
        }),
      ]);
      return reply({ ok: true });
    }
    const { ids } = z
      .object({
        ids: z
          .array(z.string().max(60))
          .min(1)
          .max(200)
          .refine((ids) => new Set(ids).size === ids.length),
      })
      .strict()
      .parse(body);
    await db.$transaction(async (tx) => {
      for (const [order, id] of ids.entries()) {
        switch (resource) {
          case "services":
            await tx.service.update({ where: { id }, data: { order } });
            break;
          case "faqs":
            await tx.faq.update({ where: { id }, data: { order } });
            break;
          case "testimonials":
            await tx.testimonial.update({ where: { id }, data: { order } });
            break;
          case "projects":
            await tx.project.update({ where: { id }, data: { order } });
            break;
          case "bots":
            await tx.bot.update({ where: { id }, data: { order } });
            break;
          case "skills":
            await tx.skill.update({ where: { id }, data: { order } });
            break;
          case "certificates":
            await tx.certificate.update({ where: { id }, data: { order } });
            break;
          default:
            throw new ChatError(404, "Not found.");
        }
      }
      await tx.auditLog.create({
        data: { adminId: user.id, action: "reorder", resource },
      });
    });
    return reply({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
