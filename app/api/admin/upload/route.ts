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
