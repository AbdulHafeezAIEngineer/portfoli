import "server-only";
import { ChatError } from "@/lib/chat/http";
export async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.CONTACT_TURNSTILE_REQUIRED !== "false"
    )
      throw new ChatError(
        503,
        "Contact protection is not configured. Please use the email link.",
      );
    return;
  }
  if (!token || token.length > 2048)
    throw new ChatError(422, "Please complete the security check.");
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
        redirect: "error",
      },
    );
    const result: unknown = await response.json();
    const expected = new URL(
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "",
    ).hostname;
    if (
      !response.ok ||
      !result ||
      typeof result !== "object" ||
      !("success" in result) ||
      result.success !== true ||
      !("hostname" in result) ||
      result.hostname !== expected ||
      !("action" in result) ||
      result.action !== "contact"
    )
      throw new Error();
  } catch {
    throw new ChatError(
      422,
      "The security check could not be verified. Please try again.",
    );
  }
}
