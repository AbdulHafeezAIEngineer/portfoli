## app/admin/[[...path]]/page.tsx

``````tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminApp } from "@/components/admin-app";
import { adminContent } from "@/data/admin";
import "../admin.css";
export const metadata: Metadata = {
  title: "Elvora Studio — Private administration",
  robots: { index: false, follow: false },
};
export default function AdminPage({ params }: { params: { path?: string[] } }) {
  const section = params.path?.[0] || "dashboard";
  if (
    (params.path?.length || 0) > 1 ||
    ![
      "dashboard",
      "login",
      "security",
      ...adminContent.resources.map((resource) => resource.id),
    ].includes(section)
  )
    notFound();
  return <AdminApp section={section} />;
}
``````

## app/admin/admin.css

``````css
.admin-shell {
  display: grid;
  grid-template-columns: 235px minmax(0, 1fr);
  min-height: 100vh;
}
.admin-sidebar {
  border-right: 1px solid var(--line);
  padding: 35px 24px;
  position: sticky;
  top: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
}
.admin-sidebar > p {
  font-size: 10px;
  color: var(--muted);
  margin-top: 8px;
}
.admin-sidebar nav {
  display: grid;
  gap: 5px;
  margin-top: 35px;
}
.admin-sidebar nav a {
  padding: 12px 13px;
  font-size: 12px;
  border-radius: 6px;
  color: var(--muted);
}
.admin-sidebar nav a[aria-current="page"] {
  background: #d4af3711;
  color: var(--gold);
}
.admin-back {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  font-size: 11px;
  padding: 20px 0;
  color: var(--muted);
}
.admin-sidebar > button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  font-size: 11px;
  color: var(--muted);
  padding: 10px 0;
}
.admin-main {
  padding: 45px;
  min-width: 0;
  max-width: 1500px;
}
.admin-main > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 30px;
}
.admin-main h1 {
  font-size: 36px;
  margin-top: 10px;
  letter-spacing: -1.5px;
}
.admin-main h2 {
  font-size: 21px;
  letter-spacing: -0.6px;
}
.admin-note {
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
  margin: 15px 0;
}
.admin-loading {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--muted);
  font-size: 12px;
  padding: 15px 0;
}
.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}
.admin-stats article {
  border-radius: 10px;
  padding: 25px;
}
.admin-stats span {
  text-transform: capitalize;
  font-size: 11px;
  color: var(--muted);
}
.admin-stats strong {
  display: block;
  font-family: var(--font-space);
  font-size: 40px;
  font-weight: 500;
  margin-top: 14px;
}
.admin-records {
  display: grid;
  gap: 14px;
}
.admin-record {
  padding: 24px;
  border-radius: 11px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 25px;
  min-width: 0;
}
.admin-record > div:first-child {
  min-width: 0;
  overflow-wrap: anywhere;
}
.admin-record h2 {
  font-size: 19px;
}
.admin-record p,
.admin-record time,
.admin-record a {
  display: block;
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
  margin-top: 8px;
}
.admin-record .admin-message {
  font-size: 13px;
  color: var(--text);
  white-space: pre-wrap;
  max-width: 750px;
}
.admin-record .admin-reply {
  color: var(--muted);
  border-left: 2px solid var(--gold);
  padding-left: 15px;
}
.admin-record-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: end;
  gap: 5px;
  flex-shrink: 0;
}
.admin-record-actions .button {
  min-height: 38px;
  padding: 8px 12px;
  font-size: 10px;
}
.admin-record-actions .icon-button {
  width: 35px;
  height: 35px;
}
.admin-record button:disabled {
  opacity: 0.3;
}
.admin-editor {
  padding: 30px;
  border-radius: 12px;
  max-width: 850px;
}
.admin-editor-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 20px;
}
.admin-editor .form-field textarea {
  font-size: 13px;
}
.admin-editor input[type="checkbox"] {
  width: 20px;
  height: 20px;
  min-height: 0;
  accent-color: #d4af37;
}
.admin-editor input[readonly] {
  color: var(--muted);
}
.admin-editor > button {
  margin-top: 15px;
}
.admin-editor hr {
  border: 0;
  border-top: 1px solid var(--line);
  margin: 35px 0;
}
.admin-upload {
  border: 1px dashed var(--line);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.admin-upload label {
  font-size: 12px;
}
.admin-upload p {
  font-size: 10px;
  color: var(--muted);
  line-height: 1.8;
  margin: 10px 0;
}
.admin-upload input {
  max-width: 100%;
  font-size: 11px;
}
.admin-login {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 30px;
  background: radial-gradient(ellipse at 50% 20%, #7c5cff0b, transparent 60%);
}
.admin-login form {
  width: min(420px, 100%);
  padding: 36px;
  border-radius: 15px;
}
.admin-login h1 {
  font-size: 32px;
  margin-top: 35px;
  letter-spacing: -1px;
}
.admin-login form > p {
  color: var(--muted);
  line-height: 1.8;
  font-size: 12px;
  margin: 14px 0 25px;
}
.admin-login label {
  display: block;
  font-size: 11px;
  margin: 20px 0 9px;
}
.admin-login input {
  display: block;
  width: 100%;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 13px;
  color: var(--text);
  font: inherit;
}
.admin-login .button {
  width: 100%;
  margin-top: 28px;
}
.totp-setup {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  max-width: 100%;
}
.totp-setup p {
  font-size: 12px;
  line-height: 1.9;
  color: var(--muted);
}
.totp-setup label {
  display: block;
  font-size: 10px;
  color: var(--gold);
  margin-top: 15px;
}
.totp-setup code {
  display: block;
  overflow-wrap: anywhere;
  margin-top: 8px;
  letter-spacing: 1px;
  font-size: 13px;
}
@media (max-width: 1000px) {
  .admin-shell {
    grid-template-columns: 190px minmax(0, 1fr);
  }
  .admin-sidebar {
    padding: 25px 16px;
  }
  .admin-main {
    padding: 30px 22px;
  }
  .admin-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .admin-record {
    flex-direction: column;
  }
  .admin-record-actions {
    justify-content: start;
  }
}
@media (max-width: 700px) {
  .admin-shell {
    grid-template-columns: minmax(0, 1fr);
  }
  .admin-sidebar {
    height: auto;
    position: relative;
    padding: 20px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .admin-sidebar nav {
    display: flex;
    overflow-x: auto;
    gap: 3px;
    margin-top: 18px;
    padding-bottom: 5px;
  }
  .admin-sidebar nav a {
    white-space: nowrap;
    padding: 10px 12px;
    font-size: 10px;
  }
  .admin-sidebar .wordmark {
    font-size: 26px;
  }
  .admin-sidebar > p {
    display: none;
  }
  .admin-back {
    position: absolute;
    top: 15px;
    right: 105px;
    gap: 10px;
    font-size: 9px;
  }
  .admin-sidebar > button {
    position: absolute;
    top: 28px;
    right: 20px;
    font-size: 9px;
  }
  .admin-main {
    padding: 30px 20px;
  }
  .admin-main h1 {
    font-size: 29px;
  }
  .admin-main > header .button {
    font-size: 10px;
    padding: 10px 13px;
    gap: 8px;
  }
  .admin-editor {
    padding: 22px;
  }
  .admin-editor input,
  .admin-editor textarea,
  .admin-login input {
    font-size: 16px;
  }
  .admin-login form {
    padding: 28px;
  }
  .admin-record {
    padding: 20px;
  }
  .admin-stats article {
    padding: 20px;
  }
  .admin-stats strong {
    font-size: 32px;
  }
}
``````

## app/api/admin/[resource]/route.ts

``````typescript
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
``````

## app/api/admin/upload/route.ts

``````typescript
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { encodePortfolioImage } from "@/lib/admin/images";
import { put, del } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin/session";
import { db } from "@/lib/db";
import { ChatError, checkOrigin } from "@/lib/chat/http";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  const uploaded: string[] = [];
  try {
    const admin = await requireAdmin();
    checkOrigin(request);
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.BLOB_PUBLIC_HOST)
      throw new ChatError(503, "Image storage is not configured.");
    if (
      !request.headers.get("content-type")?.startsWith("multipart/form-data;")
    )
      throw new ChatError(415, "Send image files.");
    const limit = 13 * 1024 * 1024;
    if (Number(request.headers.get("content-length")) > limit)
      throw new ChatError(413, "Upload is too large.");
    const reader = request.body?.getReader();
    if (!reader) throw new ChatError(400, "Choose images.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > limit) {
          await reader.cancel();
          throw new ChatError(413, "Upload is too large.");
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const form = await new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type")! },
      body: bytes,
    }).formData();
    const files = form.getAll("images");
    if (
      !files.length ||
      files.length > 4 ||
      [...form.keys()].some((key) => key !== "images")
    )
      throw new ChatError(422, "Choose 1–4 JPEG, PNG or WebP files.");
    const converted: Buffer[] = [];
    for (const file of files) {
      if (
        !(file instanceof File) ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 3 * 1024 * 1024 ||
        file.size < 20
      )
        throw new ChatError(
          422,
          "Each image must be JPEG, PNG or WebP, up to 3 MB.",
        );
      converted.push(await encodePortfolioImage(file));
    }
    for (const buffer of converted) {
      const result = await put(`portfolio/${randomUUID()}.webp`, buffer, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      });
      uploaded.push(result.url);
      if (new URL(result.url).hostname !== process.env.BLOB_PUBLIC_HOST)
        throw new ChatError(
          503,
          "Image storage hostname does not match its configuration.",
        );
    }
    await db.auditLog.create({
      data: { adminId: admin.id, action: "upload", resource: "images" },
    });
    return NextResponse.json(
      {
        images: uploaded.map((src, index) => ({
          src,
          title: `Screenshot ${index + 1}`,
          alt: `Project screenshot ${index + 1}`,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (uploaded.length) {
      try {
        await del(uploaded);
      } catch {}
    }
    return NextResponse.json(
      {
        error:
          error instanceof ChatError
            ? error.message
            : "The upload could not be completed.",
      },
      {
        status: error instanceof ChatError ? error.status : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
``````

## app/api/auth/[...nextauth]/route.ts

``````typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/admin/auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
``````

## app/api/bot-embed/route.ts

``````typescript
import { NextResponse } from "next/server";
import { botRuntime } from "@/lib/bot-runtime";
import { ChatError, publicHttpsUrl } from "@/lib/chat/http";
import { scriptDocument } from "@/lib/chat/embed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("botId") || "real";
    if (!/^[a-z0-9-]{1,60}$/.test(id)) throw new Error();
    const realBotConfig = (await botRuntime(id))?.config;
    if (!realBotConfig) throw new Error();
    if (realBotConfig.method === "iframe")
      return NextResponse.redirect(publicHttpsUrl(realBotConfig.url), {
        status: 307,
        headers: { "Cache-Control": "no-store" },
      });
    if (realBotConfig.method !== "script")
      return new Response("This bot uses API chat.", { status: 404 });
    const { document, policy } = scriptDocument(realBotConfig);
    return new Response(document, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": policy,
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    return new Response(
      error instanceof ChatError
        ? error.message
        : "This bot connection is unavailable.",
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  }
}
``````

## app/api/chat/route.ts

``````typescript
import { NextResponse } from "next/server";
import { validateMessages } from "@/lib/chat/protocol";
import { hasPromptInjection } from "@/lib/chat/guard";
import { ChatError, checkOrigin, readJson } from "@/lib/chat/http";
import { ensureConfigured, callBot } from "@/lib/chat/provider";
import { reserveRequest, acquireSlot } from "@/lib/chat/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  let release: (() => void) | undefined;
  try {
    checkOrigin(request);
    const body = await readJson(request);
    if (
      !body ||
      typeof body !== "object" ||
      !("botId" in body) ||
      !("messages" in body)
    )
      throw new ChatError(400, "Choose a bot and enter a message.");
    const { botId } = body;
    if (typeof botId !== "string" || !/^[a-z0-9-]{1,60}$/.test(botId))
      throw new ChatError(400, "This bot is unavailable.");
    const messages = validateMessages(body.messages);
    if (!messages)
      throw new ChatError(
        400,
        "Keep messages under 1,000 characters and use a shorter conversation.",
      );
    if (messages.some((message) => hasPromptInjection(message.content)))
      throw new ChatError(
        400,
        "Please ask a question about this bot's service without instruction overrides or hidden-prompt requests.",
      );
    await ensureConfigured(botId);
    release = acquireSlot();
    await reserveRequest(request);
    const result = await callBot(botId, messages, request.signal);
    if (process.env.CONTENT_SOURCE === "database") {
      const { recordChat } = await import("@/lib/records");
      await recordChat(
        botId,
        messages[messages.length - 1].content,
        result.reply,
      );
    }
    return NextResponse.json(result, { headers });
  } catch (error) {
    if (error instanceof ChatError) {
      if (error.retryAfter) headers["Retry-After"] = String(error.retryAfter);
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers },
      );
    }
    return NextResponse.json(
      { error: "The bot could not reply in time. Please try again later." },
      { status: 502, headers },
    );
  } finally {
    release?.();
  }
}
``````

## app/api/contact/route.ts

``````typescript
import { NextResponse } from "next/server";
import { contactContent as copy } from "@/data/contact";
import { ChatError, checkOrigin, readJson } from "@/lib/chat/http";
import { contactSchema, fieldErrors } from "@/lib/contact/schema";
import { acquireContactSlot, reserveContact } from "@/lib/contact/rate-limit";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import { deliverContact, gmailPassword } from "@/lib/contact/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(request: Request) {
  let release: (() => void) | undefined;
  try {
    try {
      checkOrigin(request);
    } catch (error) {
      throw new ChatError(
        error instanceof ChatError ? error.status : 403,
        copy.errors.origin,
      );
    }
    let body: unknown;
    try {
      body = await readJson(request);
    } catch (error) {
      throw new ChatError(
        error instanceof ChatError ? error.status : 400,
        copy.errors.format,
      );
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, error: copy.invalid, fields: fieldErrors(parsed.error) },
        { status: 422, headers },
      );
    // Quietly discard honeypot submissions without sending mail or revealing the trap.
    if (parsed.data.website)
      return NextResponse.json({ ok: true }, { status: 202, headers });
    const password = gmailPassword();
    await reserveContact(request);
    release = acquireContactSlot();
    await verifyTurnstile(parsed.data.turnstileToken);
    const records =
      process.env.CONTENT_SOURCE === "database"
        ? await import("@/lib/records")
        : null;
    const id = records ? await records.recordContact(parsed.data) : null;
    try {
      await deliverContact(parsed.data, password);
    } catch (error) {
      if (records) await records.markDelivery(id, "failed");
      throw error;
    }
    if (records) await records.markDelivery(id, "accepted");
    return NextResponse.json({ ok: true }, { status: 202, headers });
  } catch (error) {
    const known = error instanceof ChatError;
    const retryAfter: Record<string, string> =
      known && error.retryAfter
        ? { "Retry-After": String(error.retryAfter) }
        : {};
    return NextResponse.json(
      { ok: false, error: known ? error.message : copy.failure },
      {
        status: known ? error.status : 502,
        headers: { ...headers, ...retryAfter },
      },
    );
  } finally {
    release?.();
  }
}
``````

## app/bots.css

``````css
.bots-heading {
  margin: 18px 0 30px;
}
.bots-heading h2 {
  max-width: 500px;
}
.bots-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
}
.bots-grid > div {
  min-width: 0;
  height: 100%;
}
.bot-card {
  --bot-accent: #d4af37;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 13px;
  overflow: hidden;
  background: var(--surface);
  transition:
    border-color 0.25s,
    transform 0.25s;
}
.bot-card:hover {
  border-color: #d4af3766;
  transform: translateY(-3px);
}
.bot-card-support {
  --bot-accent: #99c7ae;
}
.bot-card-booking {
  --bot-accent: #b8a6ff;
}
.bot-card-voice {
  --bot-accent: #a0c8ef;
}
.bot-card-top {
  position: relative;
  min-height: 172px;
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 100%, #7c5cff0c, transparent 70%);
}
.bot-art {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--bot-accent);
}
.bot-art > span {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 24px;
  background: var(--raised);
  border: 1px solid var(--line);
  transform: rotate(-9deg);
}
.bot-art > svg {
  position: relative;
}
.bot-art::before,
.bot-art::after {
  content: "";
  position: absolute;
  width: 190px;
  height: 190px;
  border: 1px solid var(--line);
  border-radius: 50%;
}
.bot-art::after {
  width: 280px;
  height: 280px;
  border-style: dashed;
  opacity: 0.55;
}
.bot-art i {
  position: absolute;
  left: 24%;
  top: 40%;
  width: 5px;
  height: 5px;
  background: var(--bot-accent);
  border-radius: 50%;
  opacity: 0.7;
}
.bot-art i:nth-last-child(2) {
  left: 75%;
  top: 70%;
  width: 4px;
  height: 4px;
}
.bot-art i:last-child {
  left: 65%;
  top: 20%;
  width: 3px;
  height: 3px;
}
.method-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 6px 10px;
  color: var(--muted);
  font-size: 9px;
}
.bot-card-body {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.bot-card-body .eyebrow {
  font-size: 8px;
}
.bot-card-body h3 {
  font-size: 26px;
  letter-spacing: -0.8px;
  margin-top: 9px;
}
.bot-card-body > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  margin-top: 12px;
}
.bot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 20px 0 25px;
  padding: 0;
  list-style: none;
}
.bot-tags li {
  padding: 5px 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  font-size: 9px;
}
.bot-card-action {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  align-items: center;
}
.bot-card-action .button {
  min-height: 45px;
  font-size: 11px;
  gap: 20px;
}
.connection-pending {
  font-size: 9px;
  color: var(--muted);
}
.connection-pending::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  margin-right: 6px;
}
.bot-usage-note {
  display: flex;
  gap: 13px;
  margin: 25px 0 60px;
  padding: 18px;
  border: 1px solid var(--line);
  background: var(--soft);
  border-radius: 7px;
}
.bot-usage-note svg {
  flex-shrink: 0;
  color: var(--gold);
  margin-top: 3px;
}
.bot-usage-note p {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.bot-usage-note p span {
  font-size: 9px;
}
.embed-section {
  border-top: 1px solid var(--line);
  padding-top: 50px;
}
.embed-section h3 {
  font-size: 32px;
  letter-spacing: -1px;
  margin-top: 12px;
}
.embed-intro {
  max-width: 600px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  margin-top: 15px;
}
.embed-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}
.embed-card {
  min-width: 0;
  padding: 22px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.embed-number {
  color: var(--gold);
  font-size: 10px;
}
.embed-card h4 {
  font-family: var(--font-space), sans-serif;
  font-weight: 500;
  font-size: 19px;
  letter-spacing: -0.5px;
  margin: 18px 0 10px;
}
.embed-card > p {
  min-height: 63px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
}
.embed-card pre {
  padding: 15px;
  margin: 20px 0;
  background: #0a0a12;
  border: 1px solid #ffffff12;
  border-radius: 6px;
  color: #d4d0e8;
  overflow-x: auto;
  font-size: 9px;
  line-height: 1.9;
  min-height: 240px;
}
.embed-card h5 {
  margin: 10px 0 8px;
  font-size: 10px;
  font-weight: 500;
  color: var(--text);
}
.embed-card > ul {
  padding-left: 15px;
  margin: 0 0 10px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.embed-used {
  padding-top: 17px;
  margin-top: auto;
  border-top: 1px solid var(--line);
}
.embed-used .eyebrow {
  font-size: 7px;
  letter-spacing: 1.5px;
}
.embed-used p {
  font-size: 10px;
  color: var(--muted);
  line-height: 1.9;
  margin-top: 7px;
}
.chat-dialog {
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 22px;
  border: 0;
  background: transparent;
  color: var(--text);
  overflow: hidden;
}
.chat-dialog[open] {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.chat-dialog::backdrop {
  background: #030309aa;
  backdrop-filter: blur(12px);
}
.chat-panel {
  display: flex;
  flex-direction: column;
  width: min(570px, 100%);
  height: 100%;
  max-height: 950px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 17px;
  box-shadow: 0 30px 100px #00000060;
  overflow: hidden;
}
.chat-header {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 19px 20px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.chat-avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #d4af3710;
  color: var(--gold);
  border: 1px solid #d4af3728;
  flex-shrink: 0;
}
.chat-header .eyebrow {
  font-size: 8px;
  letter-spacing: 1px;
}
.chat-header h2 {
  font-size: 20px;
  letter-spacing: -0.6px;
  margin-top: 3px;
}
.chat-header-actions {
  display: flex;
  margin-left: auto;
}
.chat-header-actions .icon-button:disabled {
  opacity: 0.35;
}
.chat-note {
  padding: 12px 20px;
  font-size: 10px;
  line-height: 1.8;
  background: var(--soft);
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.chat-messages {
  flex: 1;
  min-height: 80px;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overscroll-behavior: contain;
}
.message {
  max-width: 88%;
  padding: 13px 16px;
  border-radius: 13px;
  border: 1px solid var(--line);
  flex-shrink: 0;
  overflow-wrap: anywhere;
}
.message-assistant {
  background: var(--raised);
  align-self: flex-start;
  border-top-left-radius: 3px;
}
.message-user {
  background: #d4af3711;
  border-color: #d4af3726;
  align-self: flex-end;
  border-top-right-radius: 3px;
}
.message-author {
  display: block;
  font-size: 9px;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: 7px;
}
.message p {
  font-size: 12px;
  line-height: 1.9;
  white-space: pre-wrap;
}
.message-user .message-author {
  color: var(--muted);
}
.typing-indicator {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 4px 6px;
  color: var(--muted);
  font-size: 10px;
}
.typing-indicator span {
  margin-right: 5px;
}
.typing-indicator i {
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  animation: chat-pulse 1s ease-in-out infinite;
}
.typing-indicator i:nth-last-child(2) {
  animation-delay: 0.15s;
}
.typing-indicator i:last-child {
  animation-delay: 0.3s;
}
@keyframes chat-pulse {
  50% {
    transform: translateY(-3px);
    opacity: 0.3;
  }
}
.chat-compose {
  flex-shrink: 0;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--line);
}
.chat-starters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 13px;
}
.chat-starters button {
  text-align: left;
  font-size: 10px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  background: var(--soft);
  border-radius: 6px;
  color: var(--muted);
}
.chat-starters button:hover {
  color: var(--text);
  border-color: var(--gold);
}
.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  padding: 9px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
}
.chat-input-row:focus-within {
  border-color: var(--gold);
}
.chat-input-row textarea {
  flex: 1;
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  resize: none;
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  padding: 5px;
  max-height: 120px;
}
.chat-input-row textarea:focus-visible {
  outline: none;
}
.chat-input-row textarea::placeholder {
  color: var(--muted);
}
.chat-send {
  width: 39px;
  height: 39px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: #d4af37;
  color: #161207;
}
.chat-send:disabled {
  opacity: 0.4;
}
.chat-input-meta {
  font-size: 8px;
  color: var(--muted);
  text-align: right;
  padding-top: 7px;
}
.chat-privacy {
  font-size: 8px;
  line-height: 1.8;
  color: var(--muted);
  margin-top: 10px;
}
.chat-error {
  padding: 9px 11px;
  border-radius: 6px;
  border: 1px solid #bd5f5f50;
  background: #bd5f5f0c;
  color: var(--text);
  font-size: 11px;
  line-height: 1.8;
  margin-bottom: 12px;
}
.chat-small-note {
  font-size: 10px;
  line-height: 1.8;
  color: var(--muted);
}
.voice-controls {
  margin-bottom: 10px;
}
.voice-playback {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.voice-playback label {
  display: flex;
  gap: 9px;
  align-items: center;
  font-size: 10px;
  color: var(--muted);
}
.voice-playback input {
  accent-color: #d4af37;
  width: 15px;
  height: 15px;
}
.voice-playback .icon-button {
  width: 32px;
  height: 32px;
}
.voice-playback button:disabled {
  opacity: 0.35;
}
.voice-fallback {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
  margin-bottom: 10px;
}
.voice-status {
  color: var(--gold);
  font-size: 10px;
  line-height: 1.8;
  margin-block: 8px;
}
.mic-button {
  width: 39px;
  height: 39px;
  border-radius: 7px;
}
.mic-button:disabled {
  opacity: 0.35;
}
.mic-button.listening {
  background: #bd5f5f20;
  color: var(--text);
}
.chat-unconfigured {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 35px;
  flex: 1;
  gap: 20px;
}
.chat-unconfigured > svg {
  color: var(--gold);
}
.chat-unconfigured h3 {
  font-size: 28px;
  letter-spacing: -1px;
}
.chat-unconfigured p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  max-width: 360px;
}
.external-chat {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
.external-chat iframe {
  width: 100%;
  flex: 1;
  min-height: 0;
  border: 0;
  background: var(--bg);
}
.external-chat > p:last-child {
  font-size: 10px;
  line-height: 1.8;
  color: var(--muted);
  padding: 12px 20px;
}
.embed-loading {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  font-size: 11px;
  color: var(--muted);
}
@media (max-width: 1023px) {
  .embed-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .embed-card pre {
    min-height: 0;
    font-size: 11px;
  }
  .embed-card > p {
    min-height: 0;
  }
}
@media (max-width: 700px) {
  .bots-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .bot-card-body {
    padding: 22px;
  }
  .bots-heading {
    margin-top: 28px;
  }
  .bot-usage-note {
    margin-bottom: 40px;
  }
  .bot-usage-note p {
    font-size: 9px;
  }
  .embed-section {
    padding-top: 35px;
  }
  .embed-section h3 {
    font-size: 28px;
  }
  .chat-dialog {
    padding: 0;
  }
  .chat-panel {
    width: 100%;
    max-height: none;
    border: none;
    border-radius: 0;
  }
  .chat-header {
    padding: 14px;
    gap: 10px;
  }
  .chat-header h2 {
    font-size: 18px;
  }
  .chat-header-actions .icon-button {
    width: 37px;
    height: 40px;
  }
  .chat-header .eyebrow {
    font-size: 7px;
  }
  .chat-note {
    padding: 10px 14px;
    font-size: 9px;
  }
  .chat-messages {
    padding: 18px 14px;
    gap: 13px;
  }
  .message {
    max-width: 92%;
    padding: 11px 13px;
  }
  .message p {
    font-size: 12px;
  }
  .chat-compose {
    padding: 12px 14px max(12px, env(safe-area-inset-bottom));
  }
  .chat-input-row textarea {
    font-size: 16px;
  }
  .chat-starters button {
    font-size: 9px;
  }
  .chat-privacy {
    font-size: 8px;
    margin-top: 8px;
  }
  .voice-controls {
    margin-bottom: 5px;
  }
}
@media (max-height: 600px) {
  .chat-note,
  .chat-starters,
  .chat-privacy {
    display: none;
  }
  .chat-header {
    padding-block: 8px;
  }
  .chat-compose {
    padding-block: 8px;
  }
  .chat-panel {
    min-height: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bot-card,
  .typing-indicator i {
    animation: none;
    transition: none;
  }
}

.bot-loading {
  padding: 60px 20px;
  min-height: 220px;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
}
``````

## app/demo/[slug]/page.tsx

``````tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demos, type DemoSlug } from "@/data/demos";
import { DemoSite } from "@/components/demo-site";
import "../demo.css";
export const dynamic = "force-dynamic";
export function generateStaticParams() {
  return Object.keys(demos).map((slug) => ({ slug }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const demo = demos[params.slug as DemoSlug];
  return {
    title: demo ? `${demo.name} — Elvora concept` : "Concept not found",
    description: demo?.intro,
    alternates: { canonical: `/demo/${params.slug}` },
  };
}
export default function DemoPage({ params }: { params: { slug: string } }) {
  if (!Object.hasOwn(demos, params.slug)) notFound();
  return <DemoSite slug={params.slug as DemoSlug} />;
}
``````

## app/demo/demo.css

``````css
.demo-site {
  --demo-bg: #f3efe5;
  --demo-ink: #26362c;
  --demo-muted: #596052;
  --demo-accent: #344d37;
  background: var(--demo-bg);
  color: var(--demo-ink);
  min-height: 100vh;
  font-size: 14px;
  overflow: clip;
}
.demo-site a,
.demo-site button {
  transition:
    opacity 0.2s,
    background 0.2s;
}
.demo-site a:hover {
  opacity: 0.75;
}
.demo-site :focus-visible {
  outline-color: var(--demo-ink);
}
.demo-site h1,
.demo-site h2,
.demo-site h3 {
  letter-spacing: -0.05em;
}
.demo-site h1,
.demo-site h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}
.demo-site h1 {
  font-size: clamp(55px, 6.3vw, 92px);
  line-height: 1.03;
  margin: 25px 0;
}
.demo-site h2 {
  font-size: clamp(36px, 4vw, 56px);
  line-height: 1.08;
}
.demo-concept-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 11px 4.5%;
  background: var(--demo-ink);
  color: var(--demo-bg);
  font-size: 9px;
  letter-spacing: 1px;
}
.demo-concept-bar a {
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-fictional {
  max-width: 410px;
  font-size: 8px;
  letter-spacing: 0;
  line-height: 1.4;
  opacity: 0.75;
}
.demo-header {
  padding: 30px 5%;
  display: flex;
  align-items: center;
  gap: 35px;
  border-bottom: 1px solid color-mix(in srgb, var(--demo-ink) 12%, transparent);
}
.demo-wordmark {
  font-family: Georgia, serif;
  font-size: 27px;
  letter-spacing: -1px;
  white-space: nowrap;
}
.demo-nav {
  display: flex;
  gap: 30px;
  margin-left: auto;
  font-size: 11px;
}
.demo-header-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 13px 17px;
  border: 1px solid color-mix(in srgb, var(--demo-ink) 25%, transparent);
  font-size: 10px;
  margin-left: 22px;
}
.demo-menu {
  display: none;
  background: none;
}
.demo-hero {
  min-height: 720px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 50px;
  padding: 55px 5% 65px;
}
.demo-kicker {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.7;
}
.demo-hero-copy > p:not(.demo-kicker) {
  font-size: 13px;
  line-height: 1.9;
  max-width: 360px;
  color: var(--demo-muted);
}
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 25px;
  margin-top: 32px;
}
.demo-primary,
.demo-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  font-size: 11px;
  min-height: 48px;
}
.demo-primary {
  background: var(--demo-ink);
  color: var(--demo-bg);
  padding: 14px 20px;
}
.demo-secondary {
  border-bottom: 1px solid color-mix(in srgb, var(--demo-ink) 25%, transparent);
}
.demo-edition {
  display: block;
  font-size: 7px;
  letter-spacing: 1.7px;
  margin-top: 60px;
  color: var(--demo-muted);
}
.demo-hero-art {
  position: relative;
  min-width: 0;
}
.demo-art-caption {
  display: flex;
  justify-content: center;
  font-size: 8px;
  letter-spacing: 1px;
  margin-top: 15px;
  color: var(--demo-muted);
}
.demo-collection {
  padding: 85px 5%;
  min-height: 900px;
  border-top: 1px solid color-mix(in srgb, var(--demo-ink) 12%, transparent);
}
.demo-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 60px;
  margin-bottom: 48px;
}
.demo-section-heading h2 {
  margin-top: 18px;
  max-width: 570px;
}
.demo-section-heading > p {
  max-width: 290px;
  font-size: 12px;
  line-height: 1.9;
  color: var(--demo-muted);
}
.demo-item-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;
}
.demo-item {
  min-width: 0;
}
.demo-item-art {
  aspect-ratio: 1/0.9;
  overflow: hidden;
  background: #e8e2d5;
  position: relative;
}
.demo-item-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  margin-top: 23px;
}
.demo-item-label h3 {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.7px;
}
.demo-item-label > span {
  font-size: 12px;
  white-space: nowrap;
}
.demo-item > p {
  font-size: 11px;
  color: var(--demo-muted);
  margin-top: 10px;
  line-height: 1.8;
}
.demo-item > a {
  display: flex;
  width: fit-content;
  gap: 30px;
  font-size: 10px;
  margin-top: 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--demo-ink) 20%, transparent);
  padding-bottom: 9px;
}
.demo-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  min-height: 900px;
  gap: 80px;
  padding: 80px 5%;
  align-items: center;
  background: color-mix(in srgb, var(--demo-ink) 4%, var(--demo-bg));
}
.demo-detail-copy h2 {
  margin-top: 20px;
}
.demo-detail-copy > p:not(.demo-kicker) {
  font-size: 12px;
  line-height: 1.9;
  color: var(--demo-muted);
  margin-top: 24px;
  max-width: 380px;
}
.demo-detail-copy > .demo-primary {
  margin-top: 30px;
}
.demo-detail-art {
  min-width: 0;
}
.demo-footer {
  padding: 45px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 35px;
}
.demo-footer p {
  font-size: 8px;
  line-height: 1.8;
  max-width: 350px;
  letter-spacing: 1px;
  color: var(--demo-muted);
}
.demo-footer > a:last-child {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 10px;
  white-space: nowrap;
}
/* Seasonal food illustrated entirely with CSS. */
.dish-illustration {
  aspect-ratio: 1/1.04;
  background: radial-gradient(ellipse at 60% 30%, #ddd6c0, #bdb59c);
  position: relative;
  overflow: hidden;
  border-radius: 48% 48% 2px 2px;
}
.dish-linen {
  position: absolute;
  inset: -20% 58% -20% -20%;
  background: repeating-linear-gradient(90deg, #c9bda4 0 2px, #d2c7b0 3px 7px);
  transform: rotate(18deg);
  box-shadow: 10px 10px 35px #544e3430;
}
.dish-plate {
  position: absolute;
  width: 78%;
  aspect-ratio: 1;
  left: 13%;
  top: 13%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #d9d2bd 0 51%,
    #eae5d6 52% 54%,
    #cec7b5 55%,
    #eae4d4 65%,
    #f8f2e2 69%,
    #bcb5a0 70%,
    #eee6d3 72%
  );
  box-shadow:
    17px 25px 28px #3c3b2c40,
    inset -5px -8px 14px #b6ae99;
}
.dish-sauce {
  position: absolute;
  inset: 23%;
  background: radial-gradient(circle at 25% 60%, #8c9a50, #556f36 60%, #3e5b2b);
  border-radius: 48% 41% 49% 44%;
  box-shadow: inset 3px 3px 10px #fff4;
}
.dish-leaf {
  position: absolute;
  left: 47%;
  top: 47%;
  width: 25%;
  height: 10%;
  background: linear-gradient(170deg, #a6ad53, #688739 55%, #3f612e);
  border-radius: 2% 90% 2% 90%;
  transform-origin: 10% 50%;
  box-shadow: 0 5px 5px #243c2440;
}
.leaf-0 {
  transform: rotate(10deg);
}
.leaf-1 {
  transform: rotate(50deg);
}
.leaf-2 {
  transform: rotate(90deg);
}
.leaf-3 {
  transform: rotate(130deg);
}
.leaf-4 {
  transform: rotate(170deg);
}
.leaf-5 {
  transform: rotate(210deg);
}
.leaf-6 {
  transform: rotate(250deg);
}
.leaf-7 {
  transform: rotate(290deg);
}
.leaf-8 {
  transform: rotate(330deg);
}
.dish-cheese {
  position: absolute;
  left: 39%;
  top: 36%;
  width: 25%;
  height: 24%;
  border-radius: 50% 40% 55% 50%;
  background: radial-gradient(circle at 30% 30%, #fffbee, #d2cbae);
  box-shadow: 7px 10px 15px #26351c40;
  transform: rotate(-18deg);
}
.dish-seasoning {
  position: absolute;
  left: 40%;
  top: 38%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #374a26;
  box-shadow:
    10px 3px #374a26,
    20px 0 #7b7f3a,
    5px 20px #42512e,
    35px 15px #6b7134,
    10px 35px #354926,
    40px 30px #6b7134,
    25px 44px #42512e;
}
.dish-cutlery {
  position: absolute;
  right: 4%;
  top: 12%;
  height: 71%;
  width: 8px;
  background: linear-gradient(90deg, #a98c56, #ddca91, #a68b54);
  border-radius: 8px;
  transform: rotate(-9deg);
  box-shadow: 4px 5px 8px #463a2826;
}
.dish-herb {
  position: absolute;
  width: 65px;
  height: 15px;
  border-radius: 90% 0 90% 0;
  background: #64734c;
  bottom: 4%;
  left: 8%;
  transform: rotate(-28deg);
  box-shadow:
    20px -15px #667b50,
    40px -30px #52683e;
}
.dish-art .dish-illustration {
  border-radius: 0;
  height: 100%;
  aspect-ratio: auto;
}
.dish-1 {
  filter: hue-rotate(-24deg);
}
.dish-2 {
  filter: hue-rotate(320deg) saturate(0.7);
}
/* Architectural vector studies. */
.demo-real-estate {
  --demo-bg: #efeee8;
  --demo-ink: #202e30;
  --demo-muted: #4f5e60;
  --demo-accent: #455c5b;
}
.demo-real-estate .demo-wordmark {
  font-family: var(--font-space), sans-serif;
  letter-spacing: -1.5px;
}
.demo-real-estate .demo-hero {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  gap: 40px;
  padding-right: 0;
}
.demo-real-estate .demo-hero h1 {
  font-size: clamp(56px, 5.8vw, 84px);
}
.demo-real-estate .demo-hero-art {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.architecture-art {
  display: block;
  width: 100%;
  height: auto;
}
.demo-real-estate .demo-hero-art .architecture-art {
  height: 560px;
  object-fit: cover;
}
.demo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 26px;
}
.demo-filters button {
  background: transparent;
  border: 1px solid #b9c2be;
  padding: 9px 17px;
  border-radius: 30px;
  font-size: 10px;
}
.demo-filters button[aria-pressed="true"] {
  background: var(--demo-ink);
  color: var(--demo-bg);
}
.building-1 .architecture-art {
  filter: hue-rotate(10deg) saturate(0.7);
  transform: scale(1.2) translateX(-4%);
}
.building-2 .architecture-art {
  filter: hue-rotate(335deg) saturate(0.65);
  transform: scale(1.12);
}
.demo-dimensions {
  border-block: 1px solid #bcc7c4;
  padding: 20px 0;
  letter-spacing: 0.7px;
  font-size: 10px !important;
}
/* A complete fictional product interface and SaaS visual language. */
.demo-saas {
  --demo-bg: #0d141b;
  --demo-ink: #eef7f2;
  --demo-muted: #9daeb0;
  --demo-accent: #a4e5c3;
}
.demo-saas .demo-concept-bar {
  background: #a4e5c3;
  color: #0d141b;
}
.demo-saas .demo-wordmark {
  font-family: var(--font-space), sans-serif;
  font-weight: 600;
}
.demo-saas .demo-wordmark::before {
  content: "◉";
  color: #a4e5c3;
  margin-right: 9px;
}
.demo-saas h1,
.demo-saas h2 {
  font-family: var(--font-space), sans-serif;
  letter-spacing: -3px;
}
.demo-saas h1 {
  font-size: clamp(49px, 5vw, 73px);
  line-height: 1.09;
}
.demo-saas .demo-hero {
  gap: 35px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  background: radial-gradient(ellipse at 80% 55%, #a4e5c30b, transparent 60%);
}
.demo-saas .demo-primary {
  background: #a4e5c3;
  color: #0d141b;
  border-radius: 7px;
}
.demo-saas .demo-header-cta {
  border-radius: 6px;
}
.orbit-dashboard {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  background: #15202a;
  border: 1px solid #a4e5c330;
  border-radius: 12px;
  box-shadow: 0 35px 75px #0006;
  color: #dfebe4;
  overflow: hidden;
  transform: perspective(1400px) rotateY(-5deg) rotateX(3deg);
  min-height: 390px;
}
.orbit-dashboard aside {
  padding: 23px 12px;
  background: #101922;
  border-right: 1px solid #ffffff0b;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 8px;
  color: #8b9ea3;
}
.orbit-dashboard aside strong {
  font-size: 16px;
  color: #b9ecd2;
  white-space: nowrap;
}
.orbit-avatar {
  background: #a4e5c326;
  color: #a4e5c3;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-top: auto;
}
.orbit-main {
  padding: 22px 20px;
  min-width: 0;
}
.orbit-toolbar {
  display: flex;
  justify-content: space-between;
  font-size: 6px;
  letter-spacing: 1px;
  color: #849b9d;
}
.orbit-main .orbit-project-title {
  font-size: 22px;
  margin-top: 30px;
  letter-spacing: -0.7px;
}
.orbit-main > p {
  font-size: 8px;
  color: #8da3a8;
  margin-top: 8px;
}
.orbit-stats {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
  margin-top: 23px;
}
.orbit-stats > div {
  background: #1c2a35;
  border: 1px solid #ffffff08;
  border-radius: 7px;
  padding: 17px;
  min-width: 0;
}
.orbit-stats small {
  font-size: 7px;
  color: #9ab0b5;
}
.orbit-stats strong {
  display: block;
  font-size: 32px;
  margin-top: 10px;
  font-weight: 500;
}
.orbit-stats strong span {
  font-size: 14px;
  color: #a4e5c3;
}
.orbit-stats > div > i {
  display: block;
  height: 4px;
  border-radius: 5px;
  background: linear-gradient(90deg, #a4e5c3 72%, #35434b 72%);
  margin-top: 12px;
}
.orbit-chart {
  height: 95px;
  display: flex;
  align-items: end;
  gap: 7px;
  padding-top: 8px;
  background: repeating-linear-gradient(
    0deg,
    transparent 0 25px,
    #ffffff08 25px 26px
  );
}
.orbit-chart i {
  flex: 1;
  background: linear-gradient(#a4e5c3, #4b766a);
  border-radius: 3px 3px 0 0;
}
.orbit-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-top: 24px;
}
.orbit-board small {
  font-size: 5px;
  letter-spacing: 1px;
  color: #97aeb1;
}
.orbit-board article {
  border: 1px solid #ffffff0c;
  background: #1c2a35;
  border-radius: 6px;
  padding: 13px 9px;
  margin-top: 10px;
}
.orbit-board article > i {
  display: block;
  width: 20px;
  height: 3px;
  border-radius: 3px;
  background: #ad9fd5;
  margin-bottom: 12px;
}
.orbit-board strong {
  display: block;
  font-size: 7px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0;
}
.orbit-board span {
  display: block;
  font-size: 5px;
  line-height: 1.5;
  color: #8da3a8;
  margin-top: 7px;
}
.orbit-board b {
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #a4e5c32a;
  color: #a4e5c3;
  font-size: 5px;
  margin-top: 13px;
}
.saas-feature-icon {
  height: 185px;
  border: 1px solid #a4e5c320;
  border-radius: 10px;
  background: radial-gradient(ellipse at center, #a4e5c312, transparent);
  display: grid;
  place-items: center;
}
.mini-board {
  display: flex;
  gap: 8px;
}
.mini-board i {
  height: 70px;
  width: 45px;
  border: 1px solid #a4e5c340;
  border-radius: 5px;
  background: linear-gradient(
    #a4e5c345 20%,
    transparent 20% 27%,
    #a4e5c320 27% 60%,
    transparent 60%
  );
}
.mini-notes {
  display: grid;
  gap: 10px;
  padding: 20px;
  border: 1px solid #a4e5c340;
  border-radius: 6px;
  transform: rotate(-7deg);
}
.mini-notes i {
  width: 90px;
  height: 7px;
  background: #a4e5c340;
  border-radius: 2px;
}
.mini-notes i:last-child {
  width: 55px;
}
.mini-bars {
  display: flex;
  align-items: end;
  gap: 9px;
  height: 80px;
}
.mini-bars i {
  width: 25px;
  background: #a4e5c36b;
  border-radius: 3px;
  height: 40%;
}
.mini-bars i:nth-child(2) {
  height: 63%;
}
.mini-bars i:nth-child(3) {
  height: 75%;
}
.mini-bars i:nth-child(4) {
  height: 100%;
  background: #a4e5c3;
}
.demo-saas .demo-detail {
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.2fr);
  gap: 45px;
}
.demo-billing {
  display: flex;
  width: fit-content;
  background: #ffffff09;
  padding: 4px;
  border: 1px solid #ffffff15;
  border-radius: 7px;
  margin-top: 25px;
}
.demo-billing button {
  font-size: 10px;
  padding: 9px 15px;
  border-radius: 4px;
  background: none;
  color: var(--demo-muted);
}
.demo-billing button[aria-pressed="true"] {
  background: #a4e5c3;
  color: #0d141b;
}
.demo-plans {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.demo-plans article {
  padding: 22px;
  border: 1px solid #a4e5c32c;
  background: #15202a;
  border-radius: 9px;
}
.demo-plans h3 {
  font-size: 17px;
}
.demo-plans p {
  font-size: 9px;
  color: var(--demo-muted);
  line-height: 1.7;
  margin-top: 10px;
  min-height: 33px;
}
.demo-plans strong {
  display: block;
  font-size: 38px;
  font-weight: 500;
  margin-top: 20px;
  letter-spacing: -2px;
}
.demo-plans article > span {
  font-size: 8px;
  color: var(--demo-muted);
}
.demo-plans button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 10px;
  margin-top: 18px;
  background: #a4e5c31a;
  border: 1px solid #a4e5c330;
  border-radius: 5px;
  color: #c4ecd9;
  font-size: 8px;
}
.demo-notice {
  min-height: 30px;
}
/* Original editorial fashion illustrations. */
.demo-store {
  --demo-bg: #eeeae3;
  --demo-ink: #282522;
  --demo-muted: #64594f;
  --demo-accent: #a77754;
}
.demo-store .demo-wordmark {
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
  letter-spacing: 3px;
  font-size: 19px;
}
.demo-store .demo-hero {
  padding-top: 40px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 65px;
}
.demo-store .demo-hero h1 {
  font-size: clamp(56px, 6.8vw, 94px);
}
.demo-store .demo-hero-art {
  background: #d5c5b2;
}
.garment-art {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 620px;
  background: radial-gradient(ellipse at 55% 35%, #e1d6c6, #c3b39d);
}
.garment-1 {
  background: radial-gradient(ellipse at 50% 40%, #ddd8ce, #bdb7ab);
}
.garment-2 {
  background: radial-gradient(ellipse at 50% 40%, #d3d2c8, #b5b4aa);
}
.demo-store .demo-art-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #4d3c2e;
  letter-spacing: 2px;
  font-size: 8px;
}
.demo-store .demo-item-art {
  aspect-ratio: 1/1.12;
}
.demo-store .demo-item-art .garment-art {
  object-fit: contain;
}
.demo-store .demo-detail {
  gap: 100px;
}
.demo-store .demo-product-price {
  font-size: 25px !important;
  color: var(--demo-ink) !important;
}
.demo-store details {
  font-size: 11px;
  margin-top: 35px;
  padding: 20px 0;
  border-block: 1px solid #c1b7a8;
}
.demo-store details p {
  font-size: 11px;
  color: var(--demo-muted);
  line-height: 1.8;
  margin-top: 15px;
}
@media (max-width: 1000px) {
  .demo-hero {
    gap: 25px;
    min-height: 660px;
  }
  .demo-nav {
    gap: 18px;
  }
  .demo-header-cta {
    display: none;
  }
  .demo-detail {
    gap: 35px;
  }
  .demo-item-grid {
    gap: 18px;
  }
  .demo-section-heading {
    gap: 30px;
  }
  .demo-item-label h3 {
    font-size: 16px;
  }
  .orbit-dashboard {
    grid-template-columns: 70px minmax(0, 1fr);
  }
  .orbit-dashboard aside {
    padding: 18px 8px;
    font-size: 6px;
  }
  .orbit-dashboard aside strong {
    font-size: 12px;
  }
  .orbit-main {
    padding: 18px 12px;
  }
  .orbit-board {
    gap: 5px;
  }
  .orbit-board article {
    padding: 10px 6px;
  }
  .demo-saas .demo-detail {
    grid-template-columns: minmax(0, 1fr);
  }
  .demo-saas .demo-detail-art {
    max-width: 650px;
  }
  .demo-saas .demo-detail-copy > p {
    max-width: 600px;
  }
  .demo-plans {
    max-width: 600px;
  }
  .demo-store .demo-hero,
  .demo-store .demo-detail {
    gap: 35px;
  }
  .demo-fictional {
    display: none;
  }
}
@media (max-width: 700px) {
  .demo-concept-bar {
    padding: 10px 6%;
    font-size: 7px;
    gap: 10px;
  }
  .demo-header {
    padding: 23px 6%;
    gap: 15px;
    position: relative;
    z-index: 2;
  }
  .demo-wordmark {
    font-size: 25px;
  }
  .demo-menu {
    display: block;
    margin-left: auto;
  }
  .demo-nav {
    display: none;
    position: absolute;
    inset: 100% 0 auto;
    padding: 25px 6%;
    background: var(--demo-bg);
    box-shadow: 0 20px 25px #0002;
    border-bottom: 1px solid
      color-mix(in srgb, var(--demo-ink) 15%, transparent);
  }
  .demo-nav.is-open {
    display: grid;
    gap: 25px;
  }
  .demo-hero,
  .demo-real-estate .demo-hero,
  .demo-saas .demo-hero,
  .demo-store .demo-hero {
    grid-template-columns: minmax(0, 1fr);
    padding: 45px 6%;
    gap: 36px;
    min-height: auto;
  }
  .demo-site h1,
  .demo-real-estate .demo-hero h1,
  .demo-saas h1,
  .demo-store .demo-hero h1 {
    font-size: clamp(47px, 12vw, 68px);
    letter-spacing: -2.5px;
    margin: 20px 0;
    max-width: 500px;
  }
  .demo-hero-copy > p:not(.demo-kicker) {
    font-size: 12px;
    max-width: 450px;
  }
  .demo-kicker {
    font-size: 8px;
    letter-spacing: 1.5px;
  }
  .demo-actions {
    gap: 20px;
    margin-top: 25px;
  }
  .demo-primary,
  .demo-secondary {
    font-size: 10px;
    gap: 18px;
  }
  .demo-edition {
    display: none;
  }
  .demo-hero-art {
    max-width: 500px;
    width: 100%;
    margin: auto;
  }
  .dish-illustration {
    aspect-ratio: 1/1;
  }
  .demo-art-caption {
    font-size: 7px;
  }
  .demo-real-estate .demo-hero-art .architecture-art {
    height: auto;
  }
  .demo-collection {
    padding: 60px 6%;
    min-height: 0;
  }
  .demo-section-heading {
    display: block;
    margin-bottom: 30px;
  }
  .demo-section-heading h2 {
    font-size: 37px;
    letter-spacing: -1.7px;
  }
  .demo-section-heading > p {
    margin-top: 20px;
    font-size: 11px;
    max-width: 350px;
  }
  .demo-item-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 35px;
  }
  .demo-item-label {
    margin-top: 17px;
  }
  .demo-item-label h3 {
    font-size: 21px;
  }
  .demo-item-art {
    aspect-ratio: 1/1;
  }
  .demo-detail,
  .demo-saas .demo-detail,
  .demo-store .demo-detail {
    padding: 55px 6%;
    grid-template-columns: minmax(0, 1fr);
    gap: 35px;
    min-height: 0;
  }
  .demo-detail h2 {
    font-size: 38px;
    letter-spacing: -1.8px;
  }
  .demo-detail-copy > p:not(.demo-kicker) {
    font-size: 11px;
  }
  .demo-footer {
    padding: 35px 6%;
    flex-wrap: wrap;
    gap: 25px;
  }
  .demo-footer p {
    order: 3;
    width: 100%;
    max-width: none;
    font-size: 7px;
  }
  .demo-footer > a:last-child {
    margin-left: auto;
    font-size: 9px;
  }
  .orbit-dashboard {
    min-height: 300px;
    grid-template-columns: 66px minmax(0, 1fr);
    transform: none;
  }
  .orbit-main .orbit-project-title {
    font-size: 19px;
    margin-top: 22px;
  }
  .orbit-stats {
    gap: 8px;
  }
  .orbit-stats > div {
    padding: 12px;
  }
  .orbit-chart {
    height: 70px;
    gap: 4px;
  }
  .orbit-stats strong {
    font-size: 27px;
  }
  .orbit-board {
    margin-top: 20px;
  }
  .orbit-board small {
    font-size: 4px;
  }
  .orbit-board strong {
    font-size: 6px;
  }
  .orbit-board span {
    font-size: 4px;
  }
  .orbit-dashboard aside {
    gap: 20px;
  }
  .orbit-main > p {
    font-size: 7px;
  }
  .orbit-board b {
    margin-top: 10px;
  }
  .demo-saas .demo-item-grid {
    gap: 25px;
  }
  .saas-feature-icon {
    height: 160px;
  }
  .demo-plans article {
    padding: 17px;
  }
  .demo-plans button {
    font-size: 7px;
  }
  .demo-store .demo-hero-art {
    max-height: 450px;
    overflow: hidden;
  }
  .demo-store .demo-hero-art .garment-art {
    height: 450px;
  }
  .demo-store .demo-wordmark {
    font-size: 16px;
    letter-spacing: 2px;
  }
  .demo-store .demo-item-art {
    aspect-ratio: 1/1.1;
  }
}

.orbit-main .orbit-project-title {
  color: #dfebe4;
  font-weight: 500;
}
``````

## app/devices.css

``````css
.device-project {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
}
.device-stage {
  position: relative;
  aspect-ratio: 1.25;
  perspective: 1100px;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 15px;
  background:
    radial-gradient(
      ellipse at 50% 60%,
      color-mix(in srgb, var(--project-accent) 9%, transparent),
      transparent 65%
    ),
    linear-gradient(135deg, var(--surface), var(--bg));
}
.device-project-number {
  position: absolute;
  top: 25px;
  left: 28px;
  font-family: var(--font-space), sans-serif;
  font-size: 75px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -5px;
  color: var(--text);
  opacity: 0.05;
}
.device-floor {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 25%;
  bottom: 2%;
  background: radial-gradient(ellipse, #0009, transparent 70%);
  filter: blur(12px);
  transform: rotate(-4deg);
}
.device-float {
  position: absolute;
  inset: 15% 4% 12% 4%;
  animation: device-float 7s ease-in-out infinite;
  transform-style: preserve-3d;
}
.device-composition {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}
.device-laptop {
  position: absolute;
  left: 5%;
  top: 7%;
  width: 83%;
  transform: perspective(1000px) rotateY(-8deg) rotateX(8deg) rotateZ(-3deg);
  transform-style: preserve-3d;
  filter: drop-shadow(0 12px 8px #0005);
}
.device-laptop-lid {
  position: relative;
  padding: 9px 8px 8px;
  background: linear-gradient(140deg, #424248, #1a1a20 55%, #777269);
  border: 1px solid color-mix(in srgb, var(--project-accent) 45%, #565656);
  border-radius: 10px 10px 3px 3px;
  box-shadow:
    0 0 30px color-mix(in srgb, var(--project-accent) 8%, transparent),
    inset 0 0 0 1px #000;
  aspect-ratio: 1.5;
}
.device-screen {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: #13141b;
}
.device-screen img {
  object-fit: cover;
  object-position: top;
}
.device-camera {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #a1a1a1;
  left: 50%;
  top: 3px;
  border-radius: 50%;
}
.device-reflection {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    128deg,
    transparent 5%,
    #ffffff06 42%,
    #ffffff1c 43%,
    #ffffff04 70%,
    transparent 71%
  );
}
.device-laptop-base {
  position: absolute;
  top: 100%;
  left: -7%;
  width: 114%;
  height: 12px;
  background: linear-gradient(#93928e, #4b4b4b 35%, #898881 50%, #23232a);
  clip-path: polygon(6% 0, 94% 0, 100% 65%, 96% 100%, 4% 100%, 0 65%);
  border-radius: 0 0 50% 50%;
  box-shadow: 0 6px 8px #0005;
}
.device-laptop-base i {
  display: block;
  width: 16%;
  height: 3px;
  background: #25252a;
  margin: 0 auto;
  border-radius: 0 0 4px 4px;
}
.device-phone {
  position: absolute;
  right: 2%;
  bottom: 0;
  width: 22%;
  height: 84%;
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--project-accent) 60%, #777);
  border-radius: 18px;
  background: linear-gradient(140deg, #5b5650, #17171b);
  transform: perspective(1000px) rotateY(-12deg) rotateZ(6deg) translateZ(65px);
  box-shadow:
    -12px 14px 20px #0006,
    inset 0 0 0 2px #262627;
}
.device-phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 13px;
  overflow: hidden;
  background: #17171b;
}
.device-phone-screen img {
  object-fit: cover;
  object-position: top;
}
.device-phone-notch {
  position: absolute;
  width: 31%;
  height: 5px;
  top: 9px;
  left: 34.5%;
  background: #151519;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #ffffff08;
}
.device-view {
  position: absolute;
  bottom: 22px;
  left: 26px;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 10px;
  letter-spacing: 0.2px;
  color: var(--text);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
}
.device-view svg {
  color: var(--gold);
}
.device-project:hover .device-stage {
  border-color: color-mix(in srgb, var(--project-accent) 38%, transparent);
}
.device-project:hover .device-view {
  color: var(--gold);
}
.projects-grid {
  row-gap: 50px;
}
.gallery-media {
  border: 1px solid #d4af3733;
  box-shadow:
    0 20px 65px #0005,
    inset 0 0 0 5px #ffffff04;
  transform: perspective(1700px) rotateX(1deg);
  border-radius: 12px;
}
.gallery-media img.loaded {
  animation: gallery-enter 0.4s ease-out;
}
.gallery-demo-link {
  display: inline-block;
  margin-top: 15px;
  color: var(--gold);
  font-size: 11px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 6px;
}
.gallery-highlights {
  margin-top: 20px;
}
.gallery-highlights ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}
.gallery-highlights li {
  font-size: 10px;
  line-height: 1.8;
  color: var(--muted);
}
.gallery-highlights li::before {
  content: "+";
  color: var(--gold);
  margin-right: 7px;
}
@keyframes device-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -8px;
  }
}
@keyframes gallery-enter {
  from {
    opacity: 0;
    scale: 0.98;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
@media (hover: none), (pointer: coarse) {
  .device-float {
    animation: none;
  }
  .device-composition {
    transform: none !important;
  }
}
@media (max-width: 700px) {
  .device-stage {
    aspect-ratio: 1.18;
  }
  .device-float {
    inset: 16% 3% 15%;
  }
  .device-laptop-lid {
    padding: 7px 6px 6px;
    border-radius: 8px 8px 3px 3px;
  }
  .device-phone {
    border-radius: 14px;
    padding: 4px;
  }
  .device-phone-screen {
    border-radius: 10px;
  }
  .device-phone-notch {
    top: 8px;
    height: 4px;
  }
  .device-view {
    left: 20px;
    bottom: 18px;
    font-size: 9px;
  }
  .device-project-number {
    font-size: 60px;
    top: 20px;
    left: 20px;
  }
  .projects-grid {
    row-gap: 30px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .device-float,
  .device-composition,
  .device-laptop,
  .device-phone,
  .gallery-media {
    transform: none !important;
    animation: none !important;
    translate: none !important;
  }
  .device-phone {
    box-shadow: -5px 5px 12px #0004;
  }
  .gallery-media img.loaded {
    animation: none;
  }
}
``````

## app/error.tsx

``````tsx
"use client";
import { site } from "@/data/site";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="error-page">
      <p className="eyebrow">{site.brand}</p>
      <h1>{site.errors.title}</h1>
      <p>{site.errors.description}</p>
      <button className="button button-gold" onClick={reset}>
        {site.errors.retry}
      </button>
    </main>
  );
}
``````

## app/global-error.tsx

``````tsx
"use client";
import { site } from "@/data/site";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0a12",
          color: "#f3f1eb",
          fontFamily: "system-ui",
          padding: 40,
        }}
      >
        <main>
          <h1>{site.errors.title}</h1>
          <p>{site.errors.description}</p>
          <button onClick={reset}>{site.errors.retry}</button>
        </main>
      </body>
    </html>
  );
}
``````

## app/globals.css

``````css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  --bg: #0a0a12;
  --surface: #12121d;
  --raised: #191924;
  --text: #f3f1eb;
  --muted: #a6a5b5;
  --line: #ffffff15;
  --gold: #d4af37;
  --glass: #161620b8;
  --soft: #ffffff04;
}
[data-theme="light"] {
  color-scheme: light;
  --bg: #f7f6f2;
  --surface: #fffefa;
  --raised: #eeeae1;
  --text: #1b1b28;
  --muted: #62616d;
  --line: #16162520;
  --gold: #806514;
  --glass: #fffefacb;
  --soft: #00000003;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-inter), sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
body:has(dialog[open]) {
  overscroll-behavior: none;
}
button,
a {
  -webkit-tap-highlight-color: transparent;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
a {
  color: inherit;
  text-decoration: none;
}
button,
h1,
h2,
h3,
p,
figure {
  margin: 0;
}
button {
  border: 0;
}
button:disabled {
  cursor: default;
}
img {
  max-width: 100%;
}
[hidden] {
  display: none !important;
}
::selection {
  background: #d4af3740;
  color: var(--text);
}
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 5px;
  border-radius: 5px;
}
h1,
h2,
h3,
.wordmark {
  font-family: var(--font-space), sans-serif;
  font-weight: 500;
}
.container {
  width: min(1180px, calc(100% - 80px));
  margin-inline: auto;
}
.eyebrow {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.8;
  color: var(--gold);
}
.glass {
  background: var(--glass);
  border: 1px solid var(--line);
  backdrop-filter: blur(20px);
}
.gold-text {
  color: var(--gold);
}
.icon-button {
  width: 44px;
  height: 44px;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  transition:
    background 0.2s,
    color 0.2s;
}
.icon-button:hover {
  background: var(--raised);
  color: var(--text);
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 50px;
  padding: 14px 24px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    background 0.25s;
}
.button:hover {
  transform: translateY(-3px);
}
.button-gold {
  background: #d4af37;
  color: #17140a;
  border: 1px solid #e1c35f;
  box-shadow: 0 4px 24px #d4af3710;
}
.button-gold:hover {
  background: #e5c452;
  box-shadow: 0 8px 28px #d4af3723;
}
.button-outline {
  border: 1px solid var(--line);
  background: var(--soft);
  color: var(--text);
}
.button-outline:hover {
  background: var(--raised);
}
.skip-link {
  position: fixed;
  top: -100px;
  left: 20px;
  padding: 14px 20px;
  border-radius: 5px;
  background: #d4af37;
  color: #0a0a12;
  z-index: 100;
}
.skip-link:focus {
  top: 12px;
}
.ambient-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.ambient-background span {
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, #7c5cff0b, transparent 68%);
  top: -100px;
  right: -250px;
  animation: drift 20s ease-in-out infinite alternate;
}
.ambient-background span:last-child {
  top: 650px;
  left: -450px;
  background: radial-gradient(circle, #d4af3708, transparent 68%);
  animation-delay: -10s;
}
@keyframes drift {
  to {
    transform: translate(-60px, 90px);
  }
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid var(--line);
  background: var(--glass);
  backdrop-filter: blur(22px);
}
.nav-row {
  position: relative;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -2px;
}
.brand-symbol {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
}
.wordmark span {
  color: var(--gold);
}
.desktop-nav {
  display: flex;
  gap: 30px;
  margin-left: auto;
  align-items: center;
}
.desktop-nav a {
  padding-block: 14px;
  color: var(--muted);
  font-size: 11px;
  transition: color 0.2s;
}
.desktop-nav a:hover {
  color: var(--gold);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.theme-toggle {
  border: 1px solid var(--line);
  width: 37px;
  height: 37px;
}
.moon-icon,
[data-theme="light"] .sun-icon {
  display: none;
}
[data-theme="light"] .moon-icon {
  display: block;
}
.menu-toggle {
  display: none;
}
.mobile-nav {
  position: absolute;
  top: calc(100% + 1px);
  left: -20px;
  right: -20px;
  padding: 14px 20px 22px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 22px 30px #00000030;
}
.mobile-nav a {
  display: block;
  padding: 15px 10px;
  font-size: 15px;
  color: var(--muted);
}
.mobile-nav a:hover {
  color: var(--gold);
}
.hero {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  align-items: center;
  gap: 44px;
  padding-top: 91px;
}
.hero-copy .eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 9px;
  letter-spacing: 1.7px;
}
.tiny-line {
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--gold);
  flex-shrink: 0;
}
h1 {
  margin-top: 26px;
  font-size: clamp(44px, 4.7vw, 65px);
  line-height: 1.12;
  letter-spacing: -3px;
}
.hero-intro {
  max-width: 470px;
  margin-top: 26px;
  font-size: 14px;
  color: var(--text);
  line-height: 1.9;
}
.hero-tagline {
  max-width: 470px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.9;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 29px;
}
.hero-note {
  margin-top: 22px;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.3px;
}
.hero-visual {
  position: relative;
  padding: 20px 25px 22px;
}
.portrait-card {
  position: relative;
  z-index: 1;
  padding: 14px;
  background: linear-gradient(145deg, var(--raised), var(--surface));
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 30px 70px #00000025;
  transform: rotate(3deg);
}
.portrait-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 5px 14px;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 2px;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  box-shadow: 0 0 12px #d4af3766;
}
.portrait-image {
  position: relative;
  aspect-ratio: 1 / 1.02;
  overflow: hidden;
  border-radius: 8px;
}
.portrait-image img {
  object-fit: cover;
}
.portrait-image::after {
  content: "";
  position: absolute;
  inset: 50% 0 0;
  background: linear-gradient(transparent, #0a0a1260);
  pointer-events: none;
}
.portrait-placeholder {
  position: absolute;
  bottom: 15px;
  left: 16px;
  color: #ece9e0;
  font-size: 9px;
  letter-spacing: 1px;
  z-index: 1;
}
.portrait-card figcaption {
  padding: 19px 8px 9px;
}
.portrait-card figcaption .eyebrow {
  display: block;
  font-size: 8px;
  letter-spacing: 1.5px;
}
.portrait-card figcaption strong {
  display: block;
  font-family: var(--font-space), sans-serif;
  font-size: 23px;
  font-weight: 500;
  margin-top: 5px;
}
.portrait-card figcaption p {
  color: var(--muted);
  margin-top: 5px;
  font-size: 10px;
}
.portrait-orbit {
  position: absolute;
  width: 105%;
  aspect-ratio: 1;
  left: -1%;
  top: 0;
  border: 1px solid #d4af371a;
  border-radius: 50%;
}
.portrait-orbit::after {
  content: "";
  position: absolute;
  inset: 25px -8px;
  border: 1px solid #7c5cff1f;
  border-radius: 50%;
}
.floating-note {
  position: absolute;
  bottom: 105px;
  left: -28px;
  z-index: 2;
  padding: 15px 17px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 35px #00000025;
}
.floating-note svg {
  color: var(--gold);
}
.floating-note span {
  font-size: 8px;
  letter-spacing: 1px;
  max-width: 125px;
  line-height: 1.7;
}
.visual-coordinates {
  position: absolute;
  right: -20px;
  top: 42%;
  writing-mode: vertical-rl;
  font-size: 8px;
  letter-spacing: 3px;
  color: var(--muted);
}
.hero-bottom {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 38px 0 32px;
  border-bottom: 1px solid var(--line);
}
.expertise-list {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
}
.expertise-list span {
  font-size: 10px;
  color: var(--muted);
}
.expertise-list span::before {
  content: "+";
  margin-right: 10px;
  color: var(--gold);
}
.scroll-link {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 8px;
  letter-spacing: 1.5px;
  color: var(--muted);
}
.scroll-link svg {
  color: var(--gold);
}
.work-section {
  padding-top: 100px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 50px;
}
h2 {
  font-size: clamp(28px, 3vw, 38px);
  letter-spacing: -1.4px;
  line-height: 1.2;
}
.section-heading h2 {
  max-width: 430px;
  margin-top: 15px;
}
.section-heading > p {
  color: var(--muted);
  max-width: 335px;
  font-size: 11px;
  line-height: 1.9;
}
.service-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 40px;
  margin-bottom: 35px;
}
.service-tabs button {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 88px;
  text-align: left;
  padding: 20px 24px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--soft);
  transition:
    background 0.2s,
    border-color 0.2s;
}
.service-tabs button[aria-selected="true"] {
  border-color: #d4af3770;
  background: #d4af3707;
}
.service-tabs button:hover {
  background: var(--raised);
}
.tab-icon {
  width: 36px;
  height: 36px;
  background: var(--raised);
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: var(--muted);
}
[aria-selected="true"] .tab-icon {
  color: var(--gold);
  background: #d4af3712;
}
.service-tabs strong {
  display: block;
  font-family: var(--font-space), sans-serif;
  font-weight: 500;
  font-size: 16px;
}
.service-tabs small {
  display: block;
  font-size: 9px;
  color: var(--muted);
  margin-top: 5px;
}
.tab-count,
.tab-lock {
  margin-left: auto;
  color: var(--muted);
}
.tab-count {
  font-size: 10px;
}
.projects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 26px;
}
.projects-grid > div {
  min-width: 0;
}
.project-card {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 10px 0;
  overflow: hidden;
  transition:
    border-color 0.25s,
    transform 0.3s,
    box-shadow 0.3s;
}
.project-card:hover {
  border-color: #d4af3760;
  transform: translateY(-4px);
  box-shadow: 0 15px 45px #00000018;
}
.browser-frame {
  border: 1px solid var(--line);
  border-radius: 7px;
  overflow: hidden;
}
.browser-bar {
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 10px;
  background: var(--raised);
  color: var(--muted);
}
.browser-bar > span {
  font-size: 7px;
  letter-spacing: 0.5px;
}
.browser-dots {
  display: flex;
  gap: 4px;
}
.browser-dots i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--muted);
  opacity: 0.5;
}
.project-image {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--raised);
  overflow: hidden;
}
.project-image img {
  object-fit: cover;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-card:hover .project-image img,
.project-card:focus-visible .project-image img {
  transform: scale(1.045);
}
.image-placeholder-label {
  position: absolute;
  left: 10px;
  bottom: 9px;
  padding: 4px 6px;
  background: #0a0a12d9;
  color: #e7e4df;
  border-radius: 3px;
  font-size: 6px;
  letter-spacing: 1px;
}
.project-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: #0a0a1250;
  opacity: 0;
  transition: opacity 0.3s;
}
.project-card:hover .project-overlay,
.project-card:focus-visible .project-overlay {
  opacity: 1;
}
.project-overlay > span {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 13px 18px;
  background: #f7f5efd9;
  color: #14141c;
  backdrop-filter: blur(12px);
  border-radius: 6px;
  font-size: 11px;
}
.project-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 23px 13px 22px;
}
.project-industry {
  font-size: 8px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.project-info h3 {
  font-size: 24px;
  letter-spacing: -0.7px;
  margin-top: 7px;
}
.project-info p {
  font-size: 10px;
  color: var(--muted);
  margin-top: 7px;
  line-height: 1.6;
}
.project-arrow {
  color: var(--muted);
  margin-right: 4px;
}
.project-footer {
  border-top: 1px solid var(--line);
  padding: 13px;
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 8px;
  letter-spacing: 0.5px;
}
.project-footer > span:first-child {
  display: flex;
  align-items: center;
  gap: 7px;
}
.project-footer i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.work-disclaimer {
  font-size: 10px;
  color: var(--muted);
  text-align: center;
  line-height: 1.9;
  margin-top: 28px;
}
.work-disclaimer span {
  font-size: 9px;
}
.bot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  min-height: 440px;
  padding: 50px 24px;
  border-radius: 12px;
  gap: 20px;
}
.bot-placeholder > svg {
  color: var(--gold);
}
.bot-placeholder h3 {
  font-size: 30px;
  letter-spacing: -1px;
}
.bot-placeholder > p:last-child {
  max-width: 480px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}
.anchor-note {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 15px;
  margin-top: 55px;
  padding: 22px;
  border: 1px dashed var(--line);
  border-radius: 8px;
  color: var(--muted);
  font-size: 11px;
}
.anchor-note svg {
  color: var(--gold);
}
.anchor-note > span:last-child {
  font-size: 9px;
  color: var(--muted);
  border-left: 1px solid var(--line);
  padding-left: 15px;
}
.future-sections {
  padding-top: 65px;
}
.future-row {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 25px 0;
  border-bottom: 1px solid var(--line);
}
.future-row > span {
  color: var(--gold);
  font-size: 10px;
}
.future-row h2 {
  font-size: 21px;
  letter-spacing: -0.5px;
}
.future-row p {
  margin-left: auto;
  color: var(--muted);
  font-size: 10px;
}
.contact-section {
  padding-block: 95px;
  text-align: center;
}
.contact-section h2 {
  max-width: 600px;
  margin: 18px auto;
  font-size: clamp(32px, 4vw, 48px);
}
.contact-section > div > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 25px;
}
.contact-pending {
  display: inline-block;
  color: var(--muted);
  border: 1px solid var(--line);
  padding: 14px 20px;
  border-radius: 6px;
  font-size: 11px;
}
.footer {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 25px 0;
  border-top: 1px solid var(--line);
}
.footer .wordmark {
  font-size: 24px;
}
.footer p {
  color: var(--muted);
  font-size: 9px;
}
.footer p:last-child {
  margin-left: auto;
}
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 25;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 6px 24px #00000020;
  color: var(--gold);
}
.gallery {
  padding: 22px;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  border: none;
  background: var(--bg);
  color: var(--text);
  overflow: auto;
  overscroll-behavior: contain;
}
.gallery::backdrop {
  background: #05050ae8;
  backdrop-filter: blur(15px);
}
.gallery-shell {
  width: min(1200px, 100%);
  margin: auto;
}
.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  gap: 16px;
}
.gallery-header .eyebrow {
  font-size: 9px;
  letter-spacing: 1px;
}
.gallery-header h2 {
  font-size: 28px;
  margin-top: 5px;
}
.gallery-media {
  position: relative;
  height: min(58dvh, 650px);
  min-height: 230px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  overflow: hidden;
  touch-action: pan-y;
}
.gallery-media > img {
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.2s;
}
.gallery-media > img.loaded {
  opacity: 1;
}
.image-loader {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--gold);
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.gallery-error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 50px;
  text-align: center;
  color: var(--muted);
}
.gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid #ffffff30;
  border-radius: 50%;
  background: #0a0a12ce;
  color: #f7f6f2;
  backdrop-filter: blur(10px);
}
.gallery-arrow:hover {
  background: #38312c;
}
.gallery-prev {
  left: 16px;
}
.gallery-next {
  right: 16px;
}
.gallery-counter {
  position: absolute;
  right: 16px;
  bottom: 12px;
  background: #0a0a12cc;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 10px;
}
.gallery-announcement {
  text-align: center;
  font-size: 11px;
  color: var(--muted);
  margin: 13px 0;
}
.gallery-thumbnails {
  display: flex;
  gap: 10px;
  width: fit-content;
  max-width: 100%;
  margin: auto;
  padding: 5px;
  overflow-x: auto;
}
.gallery-thumbnails button {
  position: relative;
  flex-shrink: 0;
  width: 92px;
  aspect-ratio: 16 / 10;
  background: var(--surface);
  border: 2px solid transparent;
  border-radius: 5px;
  overflow: hidden;
  opacity: 0.5;
}
.gallery-thumbnails button.active {
  opacity: 1;
  border-color: var(--gold);
}
.gallery-thumbnails button:hover {
  opacity: 1;
}
.gallery-thumbnails img {
  object-fit: cover;
}
.gallery-thumbnails span {
  position: absolute;
  right: 3px;
  bottom: 2px;
  padding: 1px 4px;
  background: #0a0a12cc;
  color: #fff;
  font-size: 8px;
  border-radius: 2px;
}
.gallery-details {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 35px;
  margin-top: 23px;
  border-top: 1px solid var(--line);
  padding-top: 20px;
}
.gallery-details > p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
  max-width: 620px;
}
.gallery-details .eyebrow {
  font-size: 8px;
}
.gallery-details ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 9px 0 0;
}
.gallery-details li {
  border: 1px solid var(--line);
  padding: 5px 9px;
  border-radius: 4px;
  font-size: 9px;
  color: var(--muted);
}
.gallery-help {
  color: var(--muted);
  font-size: 9px;
  text-align: center;
  margin-top: 22px;
  padding-bottom: 8px;
}
.loading-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}
.loading-page p {
  font-size: 12px;
  color: var(--muted);
}
.loading-line {
  width: 90px;
  height: 2px;
  background: var(--gold);
  animation: loading 1.4s ease-in-out infinite;
}
@keyframes loading {
  50% {
    opacity: 0.2;
    transform: scaleX(0.4);
  }
}
@media (min-width: 1440px) {
  .hero {
    padding-top: 110px;
  }
}
@media (max-width: 1023px) {
  .container {
    width: calc(100% - 48px);
  }
  .desktop-nav {
    display: none;
  }
  .menu-toggle {
    display: inline-flex;
  }
  .nav-row {
    height: 72px;
  }
  .hero {
    gap: 26px;
    grid-template-columns: 1.2fr 1fr;
    padding-top: 65px;
  }
  h1 {
    font-size: 47px;
    letter-spacing: -2.5px;
  }
  .hero-copy .eyebrow {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .hero-visual {
    padding: 12px;
  }
  .hero-intro {
    font-size: 12px;
  }
  .hero-tagline {
    font-size: 11px;
  }
  .floating-note {
    left: -12px;
    bottom: 90px;
    padding: 12px;
  }
  .floating-note span {
    font-size: 7px;
    max-width: 95px;
  }
  .visual-coordinates {
    right: -10px;
  }
  .section-heading {
    gap: 30px;
  }
  .section-heading > p {
    max-width: 290px;
  }
  .service-tabs button {
    padding: 17px;
  }
  .service-tabs strong {
    font-size: 14px;
  }
}
@media (max-width: 700px) {
  .container {
    width: calc(100% - 40px);
  }
  .hero {
    grid-template-columns: 1fr;
    padding-top: 48px;
    gap: 38px;
  }
  h1 {
    font-size: clamp(40px, 9vw, 60px);
    letter-spacing: -2px;
    margin-top: 23px;
  }
  .hero-copy .eyebrow {
    font-size: 7px;
    letter-spacing: 1px;
  }
  .hero-intro {
    font-size: 13px;
    max-width: 520px;
  }
  .hero-tagline {
    font-size: 12px;
    max-width: 520px;
  }
  .hero-visual {
    width: min(360px, 90%);
    margin: 5px auto 0;
    padding: 15px;
  }
  .floating-note {
    left: -10px;
  }
  .hero-bottom {
    padding: 20px 0 24px;
  }
  .expertise-list {
    gap: 18px;
  }
  .expertise-list span {
    font-size: 8px;
  }
  .expertise-list span::before {
    margin-right: 6px;
  }
  .scroll-link {
    display: none;
  }
  .work-section {
    padding-top: 65px;
  }
  .section-heading {
    display: block;
  }
  .section-heading h2 {
    max-width: 350px;
  }
  .section-heading > p {
    max-width: 450px;
    margin-top: 20px;
  }
  .service-tabs {
    gap: 10px;
    margin-top: 28px;
    margin-bottom: 24px;
  }
  .service-tabs button {
    padding: 15px 12px;
    min-height: 106px;
    gap: 10px;
    align-items: flex-start;
    flex-direction: column;
  }
  .service-tabs strong {
    font-size: 12px;
  }
  .service-tabs small {
    font-size: 8px;
  }
  .tab-icon {
    width: 29px;
    height: 29px;
  }
  .tab-count,
  .tab-lock {
    display: none;
  }
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .project-info {
    padding-block: 21px;
  }
  .project-info h3 {
    font-size: 25px;
  }
  .project-overlay {
    opacity: 1;
    background: none;
    place-items: end;
    padding: 12px;
  }
  .project-overlay > span {
    padding: 8px 10px;
    font-size: 9px;
    gap: 8px;
  }
  .project-overlay svg {
    width: 14px;
  }
  .image-placeholder-label {
    font-size: 5px;
  }
  .work-disclaimer {
    font-size: 8px;
  }
  .work-disclaimer span {
    font-size: 8px;
  }
  .anchor-note {
    margin-top: 35px;
    padding: 18px 10px;
    gap: 10px;
  }
  .anchor-note > span:last-child {
    font-size: 8px;
    padding-left: 10px;
  }
  .future-sections {
    padding-top: 35px;
  }
  .future-row {
    gap: 16px;
    flex-wrap: wrap;
  }
  .future-row h2 {
    font-size: 18px;
  }
  .future-row p {
    font-size: 8px;
  }
  .contact-section {
    padding-block: 65px;
  }
  .contact-section h2 {
    font-size: 34px;
  }
  .footer {
    flex-wrap: wrap;
    gap: 15px;
  }
  .footer p:last-child {
    width: 100%;
    margin-left: 0;
  }
  .back-to-top {
    right: 16px;
    bottom: 16px;
  }
  .gallery {
    padding: 14px;
  }
  .gallery-header h2 {
    font-size: 23px;
  }
  .gallery-header .eyebrow {
    font-size: 7px;
  }
  .gallery-media {
    height: 43dvh;
    min-height: 220px;
  }
  .gallery-prev {
    left: 8px;
  }
  .gallery-next {
    right: 8px;
  }
  .gallery-thumbnails {
    gap: 8px;
  }
  .gallery-thumbnails button {
    width: 72px;
  }
  .gallery-details {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .gallery-help {
    font-size: 8px;
    line-height: 1.8;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}
``````

## app/icon.svg

``````xml
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop stop-color="#48494a"/><stop offset="1" stop-color="#28292b"/></linearGradient>
    <linearGradient id="amber" x1="58" y1="43" x2="72" y2="57" gradientUnits="userSpaceOnUse"><stop stop-color="#ffd074"/><stop offset="1" stop-color="#efa944"/></linearGradient>
  </defs>
  <rect x="1.5" y="1.5" width="97" height="97" rx="25" fill="#0b0c0e" stroke="url(#edge)" stroke-width="3"/>
  <rect x="19" y="19" width="62" height="62" rx="10" fill="#101113"/>
  <path d="M69 30H31V70H69M31 50H49" fill="none" stroke="#f4f4f5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="65.5" cy="50" r="6.5" fill="url(#amber)"/>
</svg>
``````

## app/layout.tsx

``````tsx
import { headers } from "next/headers";
import { getIdentity } from "@/lib/content-loader";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";
import "./bots.css";
import "./profile.css";
import "./devices.css";
import "./premium.css";

const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});
const space = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-space",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  return {
    metadataBase: new URL(site.url),
    title: identity.title,
    description: identity.description,
    authors: [{ name: site.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: identity.brand,
      title: identity.title,
      description: identity.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: identity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
      images: ["/opengraph-image"],
    },
  };
}
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A12" },
    { media: "(prefers-color-scheme: light)", color: "#F7F6F2" },
  ],
};

const themeScript = `(function(){var t='dark';try{var s=localStorage.getItem('portfolio-theme');if(s==='light'||s==='dark')t=s;}catch(e){}document.documentElement.dataset.theme=t;})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${space.variable}`}
    >
      <head>
        <script
          nonce={headers().get("x-nonce") || undefined}
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {site.ui.skip}
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
``````

## app/loading.tsx

``````tsx
import { site } from "@/data/site";

export default function Loading() {
  return (
    <main className="loading-page" role="status">
      <span className="wordmark">
        {site.brand}
        <span>.</span>
      </span>
      <span className="loading-line" />
      <p>{site.ui.loading}</p>
    </main>
  );
}
``````

## app/not-found.tsx

``````tsx
import Link from "next/link";
import { site } from "@/data/site";
export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <p className="eyebrow">404 / {site.brand}</p>
      <h1>{site.errors.notFound}</h1>
      <p>{site.errors.missing}</p>
      <Link className="button button-gold" href="/">
        {site.errors.home}
      </Link>
    </main>
  );
}
``````

## app/opengraph-image.tsx

``````tsx
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A12",
          padding: "70px 80px",
          color: "#f7f6f2",
          borderBottom: "8px solid #D4AF37",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#D4AF37",
            letterSpacing: 4,
          }}
        >
          {site.brand.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            letterSpacing: -3,
            lineHeight: 1.1,
          }}
        >
          <span>{site.hero.heading[0]}</span>
          <span style={{ color: "#D4AF37" }}>
            {site.hero.heading.slice(1).join(" ")}
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a8a8b8" }}>
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
``````

## app/page.tsx

``````tsx
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Work } from "@/components/work";
import {
  getProjects,
  getBots,
  getSkills,
  getCertificates,
  getIdentity,
} from "@/lib/content-loader";

import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Certifications } from "@/components/certifications";
import { Contact } from "@/components/contact";
import { ScrollProgress } from "@/components/scroll-progress";

export const dynamic = "force-dynamic";
export default async function Home() {
  const [projects, skills, certificates, bots, identity] = await Promise.all([
    getProjects(),
    getSkills(),
    getCertificates(),
    getBots(),
    getIdentity(),
  ]);
  return (
    <div id="top">
      <ScrollProgress />
      <div className="ambient-background" aria-hidden="true">
        <span />
        <span />
      </div>
      <Navbar identity={identity} />
      <main id="main-content">
        <Hero />
        <Work projects={projects} bots={bots} />
        <Experience />
        <Skills skills={skills} />
        <Certifications certificates={certificates} />
        <Contact email={identity.email} />
      </main>
      <Footer brand={identity.brand} />
    </div>
  );
}
``````

## app/premium.css

``````css
:root {
  --glass: #14141ec9;
  --line-bright: #d4af3738;
  --shadow-luxe: 0 22px 65px #00000026, inset 0 1px 0 #ffffff08;
}
#top { position: relative; isolation: isolate; }
[data-theme="light"] {
  --glass: #fffefae6;
  --line-bright: #80651455;
  --shadow-luxe: 0 20px 55px #3027420c, inset 0 1px 0 #fff;
}
.scroll-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 2px;
  z-index: 60;
  transform-origin: left;
  transform: scaleX(0);
  background: linear-gradient(90deg, #987944, #edcf81 55%, #a58bff);
  box-shadow: 0 0 18px #d4af3738;
  pointer-events: none;
}
.ambient-background {
  background-image: radial-gradient(ellipse at 70% 2%, #7c5cff0e, transparent 45%);
}
.ambient-background span {
  width: min(90vw, 1000px);
  height: min(90vw, 1000px);
  background: radial-gradient(circle, #7c5cff15, transparent 65%);
}
.ambient-background span:last-child {
  background: radial-gradient(circle, #c9a35a13, transparent 67%);
}
.site-header {
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  box-shadow: 0 8px 40px #00000008;
}
.brand-symbol {
  box-shadow: 0 5px 18px #00000025;
  transition: transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s;
}
.wordmark:hover .brand-symbol {
  transform: rotate(-7deg) translateY(-2px);
  box-shadow: 0 6px 25px #d4af371c;
}
.desktop-nav a { position: relative; }
.desktop-nav a::after {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .3s;
}
.desktop-nav a:hover::after, .desktop-nav a:focus-visible::after { transform: scaleX(1); }
.hero { position: relative; padding-top: 110px; }
.hero-copy { animation: introduction-in .9s cubic-bezier(.22,1,.36,1) both; }
.hero-visual { animation: introduction-in 1.1s .15s cubic-bezier(.22,1,.36,1) both; }
h1 { font-size: clamp(46px, 5vw, 70px); letter-spacing: -3.5px; line-height: 1.08; }
.gold-text {
  color: var(--gold);
  background-image: linear-gradient(105deg, #b68f40, #f1df9b 40%, #c7a04c 62%, #e4c57c);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-copy:hover .gold-text { animation: gold-light 10s ease-in-out infinite; }
[data-theme="light"] .gold-text { background-image: linear-gradient(105deg, #70531b, #896716 45%, #5e4514); }
.hero-visual::before {
  content: "";
  position: absolute;
  inset: 12% 0 -5%;
  background: radial-gradient(ellipse, #9b7df518, #c5a15908 45%, transparent 70%);
  pointer-events: none;
}
.portrait-card {
  border-color: var(--line-bright);
  box-shadow: 0 35px 80px #00000030, 0 0 50px #7c5cff08, inset 0 1px 0 #ffffff12;
  animation: portrait-drift 9s ease-in-out infinite;
}
.portrait-orbit { width: 100%; left: 0; overflow: hidden; }
.portrait-orbit::after { inset: 25px 15px; animation: orbit-turn 70s linear infinite; }
.floating-note { border-color: var(--line-bright); }
.button { position: relative; isolation: isolate; overflow: hidden; border-radius: 10px; }
.button::before {
  content: "";
  position: absolute;
  inset: -80% auto -80% -90%;
  width: 45%;
  background: linear-gradient(90deg, transparent, #ffffff38, transparent);
  transform: rotate(25deg);
  transition: left .65s;
  pointer-events: none;
}
.button:hover::before, .button:focus-visible::before { left: 145%; }
.button-gold {
  background: linear-gradient(115deg, #d1a745, #edd18b 55%, #caa24b);
  border-color: #e8c87a;
  box-shadow: 0 6px 25px #d4af3714, inset 0 1px 0 #ffffff45;
}
.button-gold:hover { background: linear-gradient(115deg, #e1b653, #f4dda5 55%, #d2aa54); }
.section-heading h2, .experience-section h2, .certification-section h2, .elvora-contact h2 { letter-spacing: -1.4px; }
.section-heading .eyebrow, .experience-section > div > .eyebrow, .certification-section > div > .eyebrow { display: flex; align-items: center; gap: 12px; }
.section-heading .eyebrow::before, .experience-section > div > .eyebrow::before, .certification-section > div > .eyebrow::before { content: ""; width: 22px; height: 1px; background: currentColor; opacity: .7; }
.service-tabs button { border-radius: 14px; box-shadow: inset 0 1px 0 #ffffff05; transition: background .35s, border-color .35s, box-shadow .35s; }
.service-tabs [aria-selected="true"] { background: linear-gradient(115deg, #d4af370b, #7c5cff05), var(--surface); box-shadow: inset 0 1px 0 #d4af3720, 0 8px 30px #00000012; }
.project-card { border-radius: 20px; padding: 12px 12px 0; background: linear-gradient(150deg, var(--surface), var(--bg)); box-shadow: var(--shadow-luxe); }
.project-card:hover { transform: translateY(-7px); box-shadow: 0 30px 70px #00000030, 0 0 45px #d4af3706; }
.device-stage { border-radius: 14px; }
.device-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(450px circle at var(--pointer-x,50%) var(--pointer-y,40%), #e9c9820c, transparent 65%);
  opacity: 0;
  transition: opacity .4s;
  pointer-events: none;
}
.project-card:hover .device-stage::after { opacity: 1; }
.device-project-number { opacity: .08; }
.project-info { padding-top: 30px; }
.project-footer { border-top-color: var(--line); }
.artwork-composition { position: absolute; inset: 0; transform-style: preserve-3d; }
.artwork-composition > img { object-fit: cover; transition: scale .8s cubic-bezier(.22,1,.36,1); }
.artwork-project .artwork-composition > img { object-fit: contain; }
.artwork-project:hover .artwork-composition > img { scale: 1.045; }
.artwork-project .device-stage { background: #0b0910; }
.artwork-project .device-view { z-index: 2; padding: 12px 16px; border: 1px solid #ffffff20; border-radius: 9px; background: #0a0a12cc; color: #f3f1eb; backdrop-filter: blur(12px); }
.artwork-light { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(165deg, #f6db9a08, transparent 40%, #0a0a1230); }
.about-portrait {
  max-width: 365px;
  margin-top: 35px;
  padding: 10px;
  border: 1px solid var(--line-bright);
  border-radius: 20px;
  background: linear-gradient(135deg, var(--raised), var(--surface));
  box-shadow: var(--shadow-luxe);
  transform: perspective(1000px) rotateY(5deg) rotateZ(-2deg);
  transition: transform .65s cubic-bezier(.22,1,.36,1), box-shadow .65s;
}
.about-portrait:hover { transform: perspective(1000px) rotateY(0) rotateZ(0) translateY(-5px); box-shadow: 0 25px 60px #00000028, 0 0 35px #d4af3709; }
.about-portrait-image { position: relative; aspect-ratio: 4/4.5; overflow: hidden; border-radius: 12px; background: var(--bg); }
.about-portrait-image img { object-fit: cover; transition: scale .7s; }
.about-portrait:hover img { scale: 1.035; }
.about-portrait-image::after { content: ""; position: absolute; inset: 60% 0 0; background: linear-gradient(transparent, #08081099); pointer-events: none; }
.about-portrait-status { position: absolute; bottom: 16px; left: 16px; z-index: 1; color: #f3f1eb; font-size: 9px; letter-spacing: 1px; }
.about-portrait figcaption { padding: 16px 9px 8px; display: flex; align-items: center; justify-content: space-between; }
.about-portrait figcaption strong { display: block; font-family: var(--font-space), sans-serif; font-size: 20px; margin-top: 4px; font-weight: 500; }
.about-portrait figcaption .eyebrow { font-size: 8px; letter-spacing: 2px; }
.about-signature { font: italic 38px Georgia,serif; color: var(--gold); }
.about-story { padding-top: 5px; }
.about-story p:first-child { color: var(--text); }
.gallery-details:has(> div:only-child) { grid-template-columns: 1fr; }
.process-card, .skill-group, .bot-card, .certificate-card, .contact-form {
  box-shadow: var(--shadow-luxe);
  transition: transform .4s cubic-bezier(.22,1,.36,1), border-color .4s, box-shadow .4s;
}
.process-card:hover, .skill-group:hover, .bot-card:hover, .certificate-card:hover, .contact-form:focus-within { border-color: var(--line-bright); box-shadow: 0 20px 50px #0000001c, inset 0 1px 0 #d4af3715; }
.process-card:hover, .skill-group:hover { transform: translateY(-5px); }
.process-card { background: linear-gradient(145deg, var(--surface), var(--glass)); border-radius: 15px; }
.process-card > span { display: inline-grid; place-items: center; width: 30px; height: 30px; border: 1px solid var(--line); border-radius: 8px; background: var(--soft); }
.fundamental-card { position: relative; }
.fundamental-card::before { content: ""; position: absolute; top: -1px; left: 0; width: 40%; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); transition: width .5s; }
.fundamental-card:hover::before { width: 100%; }
.fundamental-card > svg { transition: transform .4s; }
.fundamental-card:hover > svg { transform: translateY(-4px); }
.experience-facts { border-style: solid; background: linear-gradient(120deg, #d4af3704, #7c5cff04); }
.skill-group li { transition: border-color .3s, background .3s, transform .3s; }
.skill-group li:hover { border-color: var(--line-bright); background: #d4af3708; transform: translateY(-2px); }
.certificate-preview { background: radial-gradient(ellipse, #d4af370b, transparent 70%); }
.certificate-preview img { box-shadow: 0 14px 40px #00000025; }
.footer { margin-top: 35px; padding-block: 35px; }
@keyframes introduction-in { from { transform: translateY(18px); } to { transform: translateY(0); } }
@keyframes reading-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@supports (animation-timeline: scroll()) {
  .scroll-progress { animation: reading-progress linear both; animation-timeline: scroll(root block); }
}
@keyframes gold-light { 0%,100% { background-position: 0 50%; } 50% { background-position: 100% 50%; } }
@keyframes portrait-drift { 0%,100% { transform: perspective(1200px) rotateY(-4deg) rotateZ(3deg) translateY(0); } 50% { transform: perspective(1200px) rotateY(1deg) rotateZ(1deg) translateY(-9px); } }
@keyframes orbit-turn { to { transform: rotate(360deg); } }
@media (max-width:1023px) { .hero { padding-top: 75px; } h1 { font-size: clamp(44px, 5vw, 64px); } .experience-intro { gap: 35px; } }
@media (max-width:700px) {
  .hero { padding-top: 58px; }
  h1 { font-size: clamp(42px, 9.8vw, 66px); letter-spacing: -2.5px; }
  .about-portrait { max-width: 350px; margin: 28px auto 14px; width: calc(100% - 12px); }
  .experience-intro { gap: 28px; }
  .project-card { border-radius: 16px; padding: 9px 9px 0; }
  .artwork-project .device-view { padding: 9px 12px; }
}
@media (hover:none), (pointer:coarse) {
  .project-card:hover, .process-card:hover, .skill-group:hover { transform: none; }
  .about-portrait, .about-portrait:hover { transform: none; }
  .portrait-card { animation: none; }
}
@media (prefers-reduced-motion:reduce) {
  .artwork-composition { transform: none !important; }
  .hero-copy, .hero-visual, .portrait-card, .portrait-orbit::after, .gold-text { animation: none; }
  .about-portrait, .about-portrait:hover { transform: none; }
  .brand-symbol, .button, .button::before, .desktop-nav a::after, .project-card, .artwork-composition > img, .device-stage::after, .about-portrait, .about-portrait-image img, .process-card, .skill-group, .skill-group li, .bot-card, .certificate-card, .contact-form, .fundamental-card::before, .fundamental-card > svg { transition: none; }
  .project-card:hover, .process-card:hover, .skill-group:hover, .skill-group li:hover, .wordmark:hover .brand-symbol, .fundamental-card:hover > svg, .button:hover { transform: none; }
  .artwork-project:hover .artwork-composition > img, .about-portrait:hover img { scale: 1; }
}
``````

## app/profile.css

``````css
.experience-section,
.skills-section,
.certification-section,
.elvora-contact {
  padding-top: 110px;
}
.section-intro {
  max-width: 620px;
  margin-top: 20px;
  color: var(--muted);
  line-height: 1.9;
  font-size: 13px;
}
.experience-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 70px;
  margin-top: 17px;
  align-items: start;
}
.about-story {
  display: grid;
  gap: 18px;
}
.about-story p {
  color: var(--muted);
  line-height: 1.95;
  font-size: 14px;
}
.experience-lead {
  margin-top: 18px;
  color: var(--gold);
  line-height: 1.7;
  font-size: 14px;
}
.process-grid,
.fundamentals-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}
.process-grid > div,
.skills-grid > div {
  min-width: 0;
}
.process-card {
  border-radius: 12px;
  padding: 24px;
  height: 100%;
  position: relative;
}
.process-card > span,
.skill-number {
  color: var(--gold);
  font-size: 11px;
  letter-spacing: 1px;
}
.process-card > svg {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--muted);
}
.process-card h3 {
  font-size: 17px;
  margin: 28px 0 12px;
}
.process-card p {
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
}
.experience-facts {
  margin-top: 24px;
  padding: 30px;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 55px;
  border: 1px dashed var(--line);
  border-radius: 12px;
}
.experience-facts > div > p:last-child {
  margin-top: 12px;
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
}
.experience-facts dl {
  margin: 0;
  display: grid;
  gap: 18px;
}
.experience-facts dt {
  font-size: 12px;
  color: var(--text);
}
.experience-facts dd {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}
.fundamentals-section {
  padding-top: 85px;
}
.fundamentals-section h2,
.certification-section h2,
.elvora-contact h2 {
  margin-top: 16px;
}
.fundamental-card {
  height: 100%;
  border-top: 1px solid var(--line);
  padding-top: 26px;
}
.fundamental-card svg {
  color: var(--gold);
  margin-bottom: 20px;
}
.fundamental-card h3 {
  font-size: 17px;
  margin-bottom: 17px;
}
.fundamental-card p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
  margin-top: 8px;
}
.fundamentals-closing {
  padding: 26px 32px;
  margin-top: 35px;
  border-left: 2px solid var(--gold);
  background: linear-gradient(90deg, #d4af3709, transparent);
  font-family: var(--font-space), sans-serif;
  font-size: 18px;
  line-height: 1.7;
  max-width: 850px;
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}
.skill-group {
  height: 100%;
  padding: 26px;
  border-radius: 12px;
}
.skill-group h3 {
  margin-top: 15px;
  font-size: 19px;
}
.skill-group ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-group li {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 9px 11px;
  font-size: 10px;
  line-height: 1.5;
  background: var(--soft);
}
.skill-group .skill-placeholder {
  color: var(--muted);
  border-style: dashed;
}
.skills-note {
  max-width: 840px;
  margin-top: 20px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.certificate-card {
  margin-top: 35px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  border-radius: 15px;
  overflow: hidden;
}
.certificate-preview {
  position: relative;
  min-width: 0;
  display: grid;
  place-items: center;
  background: var(--soft);
  overflow: hidden;
  padding: 26px;
}
.certificate-preview img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  transition: transform 0.4s;
}
.certificate-preview:hover img {
  transform: scale(1.025);
}
.certificate-preview > span {
  position: absolute;
  bottom: 39px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 15px;
  white-space: nowrap;
  background: #0a0a12e8;
  color: #f3f1eb;
  font-size: 11px;
  border: 1px solid #ffffff30;
  border-radius: 6px;
}
.certificate-info {
  padding: 38px;
  align-self: center;
  min-width: 0;
}
.placeholder-tag {
  font-size: 10px;
  color: var(--gold);
  line-height: 1.7;
}
.certificate-info h3 {
  font-size: 26px;
  margin-top: 16px;
  letter-spacing: -0.7px;
}
.certificate-info dl {
  display: grid;
  gap: 18px;
  margin: 24px 0;
}
.certificate-info dt {
  color: var(--gold);
  font-size: 9px;
  letter-spacing: 1.4px;
}
.certificate-info dd {
  margin: 7px 0 0;
  color: var(--text);
  font-size: 12px;
  line-height: 1.7;
}
.certificate-info > p:last-child {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}
.certificate-dialog {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  border: 0;
  padding: 20px;
  margin: 0;
  background: #0a0a12e8;
  color: var(--text);
}
.certificate-dialog::backdrop {
  background: #0a0a12ee;
  backdrop-filter: blur(15px);
}
.certificate-view-shell {
  height: 100%;
  max-width: 1500px;
  margin: auto;
  padding: 24px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.certificate-view-shell > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.certificate-view-shell h2 {
  font-size: 24px;
  margin-top: 6px;
}
.certificate-view-shell .eyebrow {
  letter-spacing: 1px;
  font-size: 9px;
}
.certificate-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 0;
}
.certificate-toolbar > span {
  width: 45px;
  font-size: 12px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.certificate-toolbar button:disabled {
  opacity: 0.35;
}
.certificate-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  overscroll-behavior: contain;
}
.certificate-zoom-canvas {
  position: relative;
  min-width: 100%;
  min-height: 100%;
}
.certificate-zoom-canvas img {
  object-fit: contain;
}
.certificate-loader,
.certificate-image-error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--muted);
  padding: 30px;
}
.certificate-help {
  color: var(--muted);
  font-size: 10px;
  text-align: center;
  line-height: 1.8;
  margin-top: 14px;
}
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 65px;
  margin-top: 40px;
}
.email-card {
  padding: 25px 0;
}
.email-card > svg {
  color: var(--gold);
  margin-bottom: 28px;
}
.email-card > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  max-width: 290px;
  margin-top: 14px;
}
.email-card a {
  display: flex;
  align-items: center;
  gap: 14px;
  width: fit-content;
  max-width: 100%;
  overflow-wrap: anywhere;
  margin-top: 24px;
  font-family: var(--font-space), sans-serif;
  font-size: clamp(17px, 1.75vw, 23px);
  line-height: 1.6;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}
.email-card a svg {
  flex-shrink: 0;
  color: var(--gold);
}
.email-card a:hover {
  color: var(--gold);
}
.email-card small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  margin-top: 12px;
  line-height: 1.7;
}
.contact-form {
  border-radius: 14px;
  padding: 32px;
  position: relative;
}
.contact-form h3 {
  font-size: 22px;
  margin-bottom: 27px;
}
.form-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.form-field {
  min-width: 0;
  margin-bottom: 23px;
}
.form-field label {
  display: block;
  font-size: 11px;
  margin-bottom: 9px;
}
.form-field input,
.form-field textarea {
  display: block;
  width: 100%;
  min-height: 48px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  padding: 13px 14px;
  font: inherit;
  font-size: 14px;
  line-height: 1.7;
}
.form-field textarea {
  resize: vertical;
  min-height: 160px;
}
.form-field input::placeholder,
.form-field textarea::placeholder {
  color: var(--muted);
  opacity: 1;
  font-size: 12px;
}
.form-field [aria-invalid="true"] {
  border-color: #da8484;
}
.form-field input:focus-visible,
.form-field textarea:focus-visible {
  outline-offset: 2px;
}
.form-field :disabled {
  opacity: 0.65;
}
.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.7;
  margin-top: 9px;
}
.message-meta > span {
  flex-shrink: 0;
}
.field-error {
  color: #f0a4a4;
  font-size: 11px;
  line-height: 1.7;
  margin-top: 8px;
}
.contact-privacy {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
  margin-bottom: 20px;
}
.contact-honeypot {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.contact-form button:disabled {
  opacity: 0.6;
  transform: none;
}
.form-success {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #9bd8bd;
  background: #71c9970b;
  border: 1px solid #71c99730;
  border-radius: 7px;
  padding: 15px;
  font-size: 12px;
  line-height: 1.8;
  margin-top: 20px;
}
.form-success svg {
  flex-shrink: 0;
  margin-top: 2px;
}
.form-failure {
  color: #f0a4a4;
  border: 1px solid #da848440;
  border-radius: 7px;
  padding: 15px;
  font-size: 12px;
  line-height: 1.8;
  margin-top: 20px;
}
.form-failure strong {
  font-weight: 500;
}
.form-failure p {
  margin-top: 5px;
}
[data-theme="light"] .field-error,
[data-theme="light"] .form-failure {
  color: #943e3e;
}
[data-theme="light"] .form-success {
  color: #256648;
}
.elvora-contact {
  padding-bottom: 90px;
}
@media (max-width: 1023px) {
  .experience-intro {
    gap: 35px;
  }
  .process-grid,
  .fundamentals-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .skills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .contact-grid {
    gap: 30px;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  }
  .contact-form {
    padding: 24px;
  }
  .form-pair {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .certificate-info {
    padding: 26px;
  }
}
@media (max-width: 700px) {
  .experience-section,
  .skills-section,
  .certification-section,
  .elvora-contact {
    padding-top: 75px;
  }
  .experience-intro,
  .experience-facts,
  .certificate-card,
  .contact-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 25px;
  }
  .experience-facts {
    padding: 24px;
  }
  .process-card {
    padding: 20px;
  }
  .fundamentals-section {
    padding-top: 65px;
  }
  .fundamentals-closing {
    padding: 20px;
    font-size: 16px;
  }
  .certificate-info {
    padding: 0 24px 28px;
  }
  .certificate-preview {
    padding: 20px;
  }
  .certificate-preview > span {
    bottom: 30px;
  }
  .certificate-dialog {
    padding: 8px;
  }
  .certificate-view-shell {
    padding: 14px;
  }
  .certificate-view-shell h2 {
    font-size: 21px;
  }
  .certificate-help {
    font-size: 9px;
  }
  .contact-grid {
    margin-top: 22px;
  }
  .email-card {
    padding: 20px 0;
  }
  .email-card a {
    font-size: 21px;
  }
  .form-field input,
  .form-field textarea {
    font-size: 16px;
  }
  .elvora-contact {
    padding-bottom: 65px;
  }
}
@media (max-width: 420px) {
  .process-grid,
  .fundamentals-grid,
  .skills-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .contact-form {
    padding: 21px;
  }
  .email-card a {
    font-size: 18px;
  }
  .message-meta {
    flex-wrap: wrap;
    gap: 4px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .certificate-preview img {
    transition: none;
  }
}

.contact-security {
  margin: 0 0 20px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}
.error-page {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  gap: 25px;
}
.error-page h1 {
  font-size: clamp(30px, 5vw, 60px);
  max-width: 750px;
  margin: 0;
}
.error-page > p:not(.eyebrow) {
  color: var(--muted);
}
``````

## app/robots.ts

``````typescript
import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
``````

## app/sitemap.ts

``````typescript
import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...["restaurant", "real-estate", "saas", "store"].map((slug) => ({
      url: `${site.url}/demo/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
``````

