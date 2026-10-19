"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  botContent as copy,
  embedMethods,
  type Bot,
  type BotId,
  type ChatMessage,
} from "@/data/bots";
import { botShowcase } from "@/data/bot-showcase";
import { isBusinessAssistant } from "@/data/business-assistants";
import { Reveal } from "./reveal";
import { BotAvatar } from "./bot-avatar";
import ChatPanel from "./bot-chat-panel";

export function BotServices({ bots }: { bots: Bot[] }) {
  const [active, setActive] = useState<Bot | null>(null);
  const [history, setHistory] = useState<Partial<Record<BotId, ChatMessage[]>>>(
    {},
  );
  const featured = bots.filter((bot) => isBusinessAssistant(bot.id));
  const other = bots.filter((bot) => !isBusinessAssistant(bot.id));
  useEffect(() => {
    const close = () => setActive(null);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  function open(bot: Bot) {
    setActive(bot);
  }
  const launchLabel = (bot: Bot) =>
    bot.aiReady === false ? "Explore assistant" : "Chat with assistant";
  return (
    <section
      id="ai-bots"
      className="bot-experience"
      aria-labelledby="bots-title"
    >
      <div className="bot-launch-hero">
        <div className="bot-hero-content">
          <span className="bot-kicker">
            WEBSITE CHATBOTS / BUSINESS-DATA DEMOS
          </span>
          <h1 id="bots-title">
            A chatbot that answers
            <br />
            <span>from your documents.</span>
          </h1>
          <p>
            Give it your product details and policies. Then test it with the
            questions your customers ask.
          </p>
          <a href="#meet-assistants" className="bot-pill bot-pill-white">
            Try the working demos <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div id="bot-sources" className="bot-knowledge-story">
        <div className="bot-story-heading">
          <span className="bot-kicker">SOURCE DOCUMENTS / ANSWER CHECK</span>
          <h2>
            The answer should match
            <br />
            the source document.
          </h2>
          <p>
            Veldt’s sample shipping policy sets free shipping at $75. Ask about
            a $70 order and check the answer against that policy. Each demo
            below has a separate knowledge set.
          </p>
        </div>
        <div className="field-policy-check">
          <p className="eyebrow">EXCERPT / VELDT SAMPLE DELIVERY POLICY</p>
          <p>
            Standard shipping: <strong>$5</strong>
            <br />
            Free shipping: <strong>orders of $75 or more before tax</strong>
          </p>
          <a
            href="/api/bot-knowledge?botId=veldt"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the complete sample source{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <p className="field-policy-caption">
            This is fictional store data. The demo should answer from this
            policy, rather than invent a discount.
          </p>
        </div>
      </div>

      <div id="meet-assistants" className="bot-editorial-collection">
        <div className="bot-collection-heading">
          <span className="bot-kicker">MEET THE ASSISTANTS</span>
          <h2>
            Pick a business.
            <br />
            Ask a real question.
          </h2>
          <p>
            Choose an assistant and open the chat. These are fictional
            businesses with sample knowledge.
          </p>
        </div>
        {featured.map((bot, index) => {
          if (!isBusinessAssistant(bot.id)) return null;
          const art = botShowcase[bot.id];
          return (
            <article
              className={`bot-feature bot-feature-${bot.id}${index % 2 ? " bot-feature-reverse" : ""}`}
              key={bot.id}
              aria-labelledby={`bot-name-${bot.id}`}
            >
              <button
                className="bot-showcase-visual"
                type="button"
                aria-haspopup="dialog"
                aria-label={`Open chat preview: ${bot.name}`}
                onClick={() => open(bot)}
              >
                <span className="bot-chat-mock" aria-hidden="true">
                  <span className="bot-mock-header">
                    <BotAvatar id={bot.id} />
                    <span>
                      <strong>{bot.name}</strong>
                      <small>Sample conversation</small>
                    </span>
                    <span className="bot-mock-dots">•••</span>
                  </span>
                  <span className="bot-sample-user">{art.question}</span>
                  <span className="bot-sample-answer">{art.answer}</span>
                  <span className="bot-answer-source">
                    <BookOpen size={12} /> {art.source}
                  </span>
                  <span className="bot-preview-product">
                    <strong>{art.cardLabel}</strong>
                    <small>{art.cardDetail}</small>
                  </span>
                  <span className="bot-mock-input">
                    Ask {bot.name.split(" ")[0]} a question… <Send size={15} />
                  </span>
                </span>
                <span className="bot-image-invitation">
                  Open {bot.name.split(" ")[0]} <ArrowUpRight size={17} />
                </span>
              </button>
              <div className="bot-feature-copy">
                <span className="bot-kicker">{art.category}</span>
                <h3 id={`bot-name-${bot.id}`}>{art.title}</h3>
                <p>{art.description}</p>
                <ul>
                  {art.abilities.map((ability) => (
                    <li key={ability}>
                      <Check size={16} aria-hidden="true" />
                      {ability}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="bot-pill bot-pill-dark"
                  aria-haspopup="dialog"
                  aria-label={`${launchLabel(bot)}: ${bot.name}`}
                  onClick={() => open(bot)}
                >
                  {launchLabel(bot)}{" "}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </button>
                <span className="bot-feature-caption">
                  {bot.name} ·{" "}
                  {bot.aiReady === false
                    ? "AI connection pending"
                    : "AI demo with sample business data"}
                </span>
                <a
                  className="bot-source-link"
                  href={`/api/bot-knowledge?botId=${bot.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See what this assistant knows <ArrowUpRight size={13} />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {other.length > 0 && (
        <details className="field-extra-demos">
          <summary>Also try: Forte study support and Aura voice chat</summary>
          <div className="bot-more-section">
            <div className="bot-more-heading">
              <span className="bot-kicker">MORE WAYS TO TALK</span>
              <h2>
                Study support.
                <br />A voice-first conversation.
              </h2>
            </div>
            <div className="bot-more-grid">
              {other.map((bot) => (
                <article
                  className={`bot-extra bot-extra-${bot.id}`}
                  key={bot.id}
                >
                  <button
                    className="bot-extra-open"
                    type="button"
                    aria-label={`Open chat: ${bot.name}`}
                    aria-haspopup="dialog"
                    onClick={() => open(bot)}
                  >
                    <span className="bot-extra-icon">
                      {bot.id === "voice" ? (
                        <AudioLines size={32} />
                      ) : (
                        <BookOpen size={32} />
                      )}
                    </span>
                    <span className="bot-extra-dialog">
                      <span>How can I help?</span>
                      <span>
                        {bot.id === "voice"
                          ? "Type or use your microphone."
                          : "Let’s work through your study questions."}
                      </span>
                    </span>
                    <ArrowUpRight size={25} />
                  </button>
                  <h3>{bot.name}</h3>
                  <p>{bot.description}</p>
                  <button
                    type="button"
                    className="bot-text-button"
                    onClick={() => open(bot)}
                    aria-label={`Open chat: ${bot.name}`}
                    aria-haspopup="dialog"
                  >
                    Open assistant <ArrowUpRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </details>
      )}

      <div className="bot-bottom-note">
        <MessageCircle size={19} aria-hidden="true" />
        <p>
          Sample conversations illustrate the approved demo knowledge. Live AI
          replies need a connected service and are subject to usage limits.
          These demos do not place orders, submit enquiries or reserve rooms.
        </p>
      </div>
      {active && (
        <ChatPanel
          key={active.id}
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
      <div className="bot-integration-list">
        {embedMethods.map((method) => (
          <details className="bot-integration-item" key={method.id}>
            <summary>
              <span>
                <strong>{method.title}</strong>
                <small>{method.description}</small>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </summary>
            <div className="bot-integration-body">
              <pre aria-label={`${method.title}: ${copy.example}`} tabIndex={0}>
                <code>{method.code}</code>
              </pre>
              <div>
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
              </div>
              <p className="bot-integration-used">
                {copy.usedBy}:{" "}
                {bots
                  .filter((bot) => bot.method === method.id)
                  .map((bot) => bot.name)
                  .join(" · ") || copy.unusedMethod}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
