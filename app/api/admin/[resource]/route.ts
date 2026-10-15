import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { schemas } from "@/lib/admin/schemas";
import {
  ChatError,
  checkOrigin,
  readJson,
  publicHttpsUrl,
} from "@/lib/chat/http";
import { limitLogin } from "@/lib/admin/rate-limit";
import { updateSecurity } from "@/lib/admin/security";
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
  _request: Request,
  { params }: { params: { resource: string } },
) {
  try {
    const user = await requireAdmin();
    switch (params.resource) {
      case "dashboard":
        return reply({
          projects: await db.project.count(),
          bots: await db.bot.count(),
          messages: await db.contactMessage.count(),
          unread: await db.contactMessage.count({ where: { read: false } }),
          twoFactor: !!user.totpSecret,
        });
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
      case "inbox":
        return reply(
          await db.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        );
      case "chatlogs":
        return reply(
          await db.chatLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        );
      case "audit":
        return reply(
          await db.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        );
      default:
        return reply({ error: "Not found." }, 404);
    }
  } catch (error) {
    return failure(error);
  }
}
export async function POST(
  request: Request,
  { params }: { params: { resource: string } },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const body = await readJson(request);
    const resource = params.resource;
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
        if (destination) {
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
  { params }: { params: { resource: string } },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const { id } = z
      .object({ id: z.string().min(1).max(100) })
      .strict()
      .parse(await readJson(request));
    await db.$transaction(async (tx) => {
      switch (params.resource) {
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
          resource: params.resource,
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
  { params }: { params: { resource: string } },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const body = await readJson(request);
    const resource = params.resource;
    if (resource === "inbox") {
      const data = z
        .object({ id: z.string().max(100), read: z.boolean() })
        .strict()
        .parse(body);
      await db.$transaction([
        db.contactMessage.update({
          where: { id: data.id },
          data: { read: data.read },
        }),
        db.auditLog.create({
          data: {
            adminId: user.id,
            action: data.read ? "mark-read" : "mark-unread",
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
