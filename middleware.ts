import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const nonce = btoa(crypto.randomUUID());
  const production = process.env.NODE_ENV === "production";
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(
    request.nextUrl.hostname,
  );
  const providers = (process.env.BOT_PROVIDER_ALLOWLIST || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^[a-z0-9.-]+$/i.test(value))
    .map((value) => `https://${value}`)
    .join(" ");
  const blob =
    process.env.BLOB_PUBLIC_HOST &&
    /^[a-z0-9.-]+$/i.test(process.env.BLOB_PUBLIC_HOST)
      ? `https://${process.env.BLOB_PUBLIC_HOST}`
      : "";
  const policy = `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com${production ? "" : " 'unsafe-eval'"}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: ${blob}; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com ${providers}; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self';${production && !local ? " upgrade-insecure-requests;" : ""}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  let response: NextResponse;
  if (
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    pathname.startsWith("/api/admin/")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: production
        ? "__Secure-elvora.session-token"
        : "elvora.session-token",
    });
    const authenticated =
      token?.adminId &&
      typeof token.authenticatedAt === "number" &&
      Date.now() - token.authenticatedAt < 15 * 60000;
    response = authenticated
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : pathname.startsWith("/api/admin/")
        ? NextResponse.json({ error: "Please sign in again." }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url));
  } else response = NextResponse.next({ request: { headers: requestHeaders } });
  if (pathname !== "/api/bot-embed")
    response.headers.set("Content-Security-Policy", policy);
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=(), usb=()",
  );
  if (production && !local)
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/"))
    response.headers.set("Cache-Control", "no-store");
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icon.svg|projects/|certificates/|portrait-placeholder.svg).*)",
  ],
};
