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
