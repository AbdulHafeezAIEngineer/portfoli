"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Bot as BotIcon,
  CalendarDays,
  Code2,
  Headphones,
  Sparkles,
} from "lucide-react";
import {
  botContent as copy,
  embedMethods,
  type Bot,
  type BotId,
  type ChatMessage,
} from "@/data/bots";
import { Reveal } from "./reveal";
import { FortePreview } from "./forte-preview";
import { AiBotVideo } from "./AiBotVideo";

import ChatPanel from "./bot-chat-panel";
import { BotAvatar } from "./bot-avatar";
import { isBusinessAssistant } from "@/data/business-assistants";
const icons = {
  real: Sparkles,
  support: Headphones,
  booking: CalendarDays,
  voice: AudioLines,
};

export function BotServices({ bots }: { bots: Bot[] }) {
  const [active, setActive] = useState<Bot | null>(null);
  const [history, setHistory] = useState<Partial<Record<BotId, ChatMessage[]>>>(
    {},
  );
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (["#ai-bots", "#embed-methods"].includes(location.hash))
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
    });
    const close = () => setActive(null);
    window.addEventListener("hashchange", close);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", close);
    };
  }, []);
  return (
    <section
      id="ai-bots"
      className="container bot-services"
      aria-labelledby="bots-title"
    >
      <Reveal>
        <div className="section-heading bots-heading">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 id="bots-title">{copy.title}</h1>
          </div>
          <p>{copy.description}</p>
        </div>
      </Reveal>
      <AiBotVideo />
      <div className="bots-grid">
        {bots.map((bot, index) => {
          const Icon = icons[bot.id as keyof typeof icons] || Sparkles;
          const forte = bot.id === "real" && bot.provider === "botpress";
          return (
            <Reveal key={bot.id} delay={(index % 2) * 0.06}>
              <article
                className={`bot-card bot-card-${bot.id}`}
                aria-labelledby={`bot-name-${bot.id}`}
              >
                {forte && (
                  <button
                    type="button"
                    className="forte-card-hitarea"
                    aria-haspopup="dialog"
                    aria-label={`${copy.open}: ${bot.name}`}
                    onClick={() => setActive(bot)}
                  />
                )}
                <div
                  className={
                    forte ? "bot-card-top forte-card-top" : "bot-card-top"
                  }
                >
                  {forte ? (
                    <FortePreview name={bot.name} />
                  ) : (
                    <div className="bot-art" aria-hidden="true">
                      <span />
                      {isBusinessAssistant(bot.id) ? <BotAvatar id={bot.id} /> : <Icon size={42} strokeWidth={1.2} />}
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                  <span className="method-badge">
                    <Code2 size={12} aria-hidden="true" />
                    {copy.methods[bot.method]}
                  </span>
                </div>
                <div className="bot-card-body">
                  <p className="eyebrow">
                    {bot.kind === "real" ? copy.real : copy.demo}
                  </p>
                  <h3 id={`bot-name-${bot.id}`}>{bot.name}</h3>
                  <p>{bot.description}</p>
                  <ul className="bot-tags">
                    {bot.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="bot-card-action">
                    {forte ? (
                      <span className="button button-outline">
                        {copy.open}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </span>
                    ) : (
                      <button
                        className="button button-outline"
                        aria-haspopup="dialog"
                        aria-label={`${bot.aiReady === false ? copy.previewDemo : copy.try}: ${bot.name}`}
                        onClick={() => setActive(bot)}
                      >
                        {bot.aiReady === false ? copy.previewDemo : copy.try}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                    )}
                    {(!bot.configured || bot.aiReady === false) && (
                      <span className="connection-pending">{copy.pending}</span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <div className="bot-usage-note">
        <BotIcon size={18} aria-hidden="true" />
        <p>
          {copy.privacy}
          <br />
          <span>{copy.budget}</span>
        </p>
      </div>
      {active && (
        <ChatPanel
          bot={active}
          messages={history[active.id] || []}
          onMessagesChange={(messages) =>
            setHistory((current) => ({ ...current, [active.id]: messages }))
          }
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}

export function BotEmbedding({ bots }: { bots: Bot[] }) {
  return (
    <section
      id="embed-methods"
      className="container embed-section"
      aria-labelledby="embed-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.integrationEyebrow}</p>
        <h2 id="embed-title">{copy.embedTitle}</h2>
        <p className="embed-intro">{copy.embedDescription}</p>
      </Reveal>
      <div className="embed-grid">
        {embedMethods.map((method, index) => (
          <article className="embed-card glass" key={method.id}>
            <span className="embed-number">0{index + 1}</span>
            <h3>{method.title}</h3>
            <p>{method.description}</p>
            <pre aria-label={`${method.title}: ${copy.example}`} tabIndex={0}>
              <code>{method.code}</code>
            </pre>
            <h4>{copy.pros}</h4>
            <ul>
              {method.pros.map((pro) => (
                <li key={pro}>{pro}</li>
              ))}
            </ul>
            <h4>{copy.cons}</h4>
            <ul>
              {method.cons.map((con) => (
                <li key={con}>{con}</li>
              ))}
            </ul>
            <div className="embed-used">
              <span className="eyebrow">{copy.usedBy}</span>
              <p>
                {bots
                  .filter((bot) => bot.method === method.id)
                  .map(
                    (bot) =>
                      `${bot.name}${!bot.configured ? ` (${copy.pending.toLowerCase()})` : ""}`,
                  )
                  .join(" · ") || copy.unusedMethod}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
