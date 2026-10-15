import "server-only";
export class ChatError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}
export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new ChatError(415, "Send a JSON message.");
  const limit = 32 * 1024;
  if (Number(request.headers.get("content-length")) > limit) throw new ChatError(413, "This conversation is too large. Please clear it and try again.");
  if (!request.body) throw new ChatError(400, "A message is required.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new ChatError(413, "This conversation is too large. Please clear it and try again."); }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    try { return JSON.parse(body); } catch { throw new ChatError(400, "The message format is invalid."); }
  } finally { reader.releaseLock(); }
}
export function checkOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  // Next.js can normalize the internal request URL to localhost. Host retains the
  // browser's address; production can pin the public origin behind a reverse proxy.
  const configured = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : undefined;
  let expected: string;
  try { expected = new URL(configured || `${url.protocol}//${request.headers.get("host") || url.host}`).origin; }
  catch { throw new ChatError(503, "The portfolio origin is not configured correctly."); }
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== expected)) throw new ChatError(403, "Please open this chat from the portfolio website.");
}
export function publicHttpsUrl(value: string): URL {
  let url: URL;
  try { url = new URL(value); } catch { throw new ChatError(503, "This bot connection is not configured yet."); }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443") || !host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":") || /(^|\.)(localhost|local|internal|test|invalid)$/.test(host)) throw new ChatError(503, "This bot requires a public HTTPS provider address.");
  return url;
}
export async function readUpstreamJson(response: Response): Promise<unknown> {
  const reader = response.body?.getReader();
  if (!reader) throw new ChatError(502, "The bot provider returned an empty reply.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 64 * 1024) { await reader.cancel(); throw new ChatError(502, "The bot provider returned an oversized reply."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new ChatError(502, "The bot provider returned an unreadable reply."); }
}
