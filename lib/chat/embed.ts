import "server-only";
import type { RealBotConfig } from "@/data/bots";
import { ChatError, publicHttpsUrl } from "./http";

const html = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function scriptDocument(
  config: Extract<RealBotConfig, { method: "script" }>,
): { document: string; policy: string } {
  const url = publicHttpsUrl(config.src);
  if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(config.mountId))
    throw new ChatError(503, "The widget mount is not configured correctly.");
  const attributes = Object.entries(config.attributes)
    .map(([key, value]) => {
      if (!/^data-[a-z0-9_-]+$/.test(key))
        throw new ChatError(
          503,
          "Widget attributes must be public data attributes.",
        );
      return `${key}="${html(value)}"`;
    })
    .join(" ");
  if (
    config.integrity &&
    !/^sha(256|384|512)-[A-Za-z0-9+/=]+$/.test(config.integrity)
  )
    throw new ChatError(503, "The widget integrity setting is invalid.");
  return {
    document: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live chatbot widget</title><style>html,body{height:100%;margin:0;background:#0a0a12;color:#f3f1eb;font-family:system-ui}#${config.mountId}{height:100%}</style></head><body><div id="${config.mountId}"></div><script src="${html(url.href)}" ${attributes} ${config.integrity ? `integrity="${html(config.integrity)}" crossorigin="anonymous"` : ""} defer></script></body></html>`,
    policy: `default-src 'none'; script-src ${url.origin}; style-src 'unsafe-inline' https:; img-src https: data:; font-src https: data:; connect-src https:; frame-src https:; base-uri 'none'; form-action https:; frame-ancestors 'self'`,
  };
}
