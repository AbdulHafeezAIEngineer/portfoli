"use client";
import { useState, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { botContent, type Bot } from "@/data/bots";
export function BotEmbed({
  bot,
  children,
}: {
  bot: Bot;
  children?: ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const copy = botContent.chat;
  if (bot.method === "api") return <>{children}</>;
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
          bot.method === "script"
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
