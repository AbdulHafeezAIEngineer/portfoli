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
