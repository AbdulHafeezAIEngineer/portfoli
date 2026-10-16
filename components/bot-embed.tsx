"use client";
import { useState, type ReactNode } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { botContent, type Bot } from "@/data/bots";
import { useConsent } from "./consent-provider";
import { consentContent } from "@/data/privacy";
export function BotEmbed({
  bot,
  children,
}: {
  bot: Bot;
  children?: ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const consent = useConsent();
  const copy = botContent.chat;
  if (bot.method === "api") return <>{children}</>;
  if (!consent.external)
    return (
      <div className="embed-consent-gate">
        <ShieldCheck size={35} strokeWidth={1.3} aria-hidden="true" />
        <h3>{consentContent.gateTitle}</h3>
        <p>{consentContent.gateNote}</p>
        <button
          type="button"
          className="button button-gold"
          onClick={consent.allowExternal}
        >
          {consentContent.allow}
        </button>
        <a href="/cookies" target="_blank" rel="noopener noreferrer">
          {consentContent.policy}
        </a>
      </div>
    );
  return (
    <div className="external-chat">
      {!loaded && (
        <p className="embed-loading" role="status">
          <LoaderCircle size={20} className="spin" />
          {copy.embedLoading}
        </p>
      )}
      <iframe
        src={`/api/bot-embed?botId=${encodeURIComponent(bot.id)}`}
        loading="lazy"
        title={`${bot.name}: ${copy.embedTitle}`}
        sandbox={
          bot.method === "script" && bot.provider !== "botpress"
            ? "allow-scripts allow-forms allow-popups"
            : "allow-scripts allow-forms allow-same-origin allow-popups"
        }
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
      />
      <p>{copy.embedNote}</p>
    </div>
  );
}
