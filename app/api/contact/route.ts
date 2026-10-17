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
    const store =
      process.env.CONTENT_SOURCE === "database" ||
      process.env.CONTACT_STORAGE === "database";
    if (!store) gmailPassword();
    await reserveContact(request);
    release = acquireContactSlot();
    await verifyTurnstile(parsed.data.turnstileToken);
    const records = store ? await import("@/lib/records") : null;
    let id: string | null = null;
    try {
      id = records ? await records.recordContact(parsed.data) : null;
    } catch {
      throw new ChatError(503, copy.errors.unavailable);
    }
    let notification: "accepted" | "failed" | "not-configured" =
      "not-configured";
    if (!process.env.GMAIL_APP_PASSWORD?.trim() && records) {
      try {
        await records.markDelivery(id, notification);
      } catch {
        console.error("contact.delivery-status-write-failed");
      }
      return NextResponse.json(
        { ok: true, acceptance: "stored", notification },
        { status: 202, headers },
      );
    }
    const password = gmailPassword();
    try {
      await deliverContact(parsed.data, password);
      notification = "accepted";
    } catch (error) {
      if (!records) throw error;
      notification = "failed";
    }
    if (records) {
      try {
        await records.markDelivery(id, notification);
      } catch {
        console.error("contact.delivery-status-write-failed");
      }
    }
    return NextResponse.json(
      { ok: true, acceptance: records ? "stored" : "email", notification },
      { status: 202, headers },
    );
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
