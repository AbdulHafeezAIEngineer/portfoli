"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, AudioLines, BookOpen, Check, FileText, MessageCircle, Send } from "lucide-react";
import { botContent as copy, embedMethods, type Bot, type BotId, type ChatMessage } from "@/data/bots";
import { botShowcase } from "@/data/bot-showcase";
import { isBusinessAssistant } from "@/data/business-assistants";
import { Reveal } from "./reveal";
import { BotAvatar } from "./bot-avatar";
import { BotPrismShader } from "./bot-prism-shader";
import { AiBotVideo } from "./AiBotVideo";
import ChatPanel from "./bot-chat-panel";

export function BotServices({ bots }: { bots: Bot[] }) {
  const [active, setActive] = useState<Bot | null>(null);
  const [history, setHistory] = useState<Partial<Record<BotId, ChatMessage[]>>>({});
  const featured = bots.filter(bot => isBusinessAssistant(bot.id));
  const other = bots.filter(bot => !isBusinessAssistant(bot.id));
  useEffect(() => {
    const close = () => setActive(null);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  function open(bot: Bot) { setActive(bot); }
  const launchLabel = (bot: Bot) => bot.aiReady === false ? "Explore assistant" : "Chat with assistant";
  return (
    <section id="ai-bots" className="bot-experience" aria-labelledby="bots-title">
      <div className="bot-launch-hero">
        <BotPrismShader />
        <div className="bot-hero-shade" aria-hidden="true" />
        <div className="bot-hero-content">
          <span className="bot-kicker"><MessageCircle size={15} aria-hidden="true" /> CUSTOM AI AGENTS BY ELVORA</span>
          <h1 id="bots-title">Your business.<br /><span>Better conversations.</span></h1>
          <p>Answers from your knowledge.<br className="bot-desktop-break" /> A helpful voice for your business.</p>
          <a href="#meet-assistants" className="bot-pill bot-pill-white">Meet the assistants <ArrowDown size={17} aria-hidden="true" /></a>
          <div className="bot-hero-domains"><span>Online stores</span><span>Service businesses</span><span>Hospitality</span></div>
        </div>
      </div>

      <div className="bot-knowledge-story">
        <div className="bot-story-heading">
          <span className="bot-kicker">YOUR INFORMATION. USEFUL ANSWERS.</span>
          <h2>It starts with what<br />your business knows.</h2>
          <p>Your products, services and FAQs become a helpful conversation. Explore three sample assistants, each with its own purpose and business information.</p>
        </div>
        <div className="bot-knowledge-visual" aria-label="Illustration showing business knowledge connected to a sample assistant">
          <div className="bot-knowledge-board">
            <div className="bot-board-heading"><BookOpen size={20} /><strong>Business knowledge</strong><span>YOUR SOURCES</span></div>
            <div className="bot-source-tabs"><span>FAQs</span><span>Products</span><span>Services</span></div>
            {[['Product information','Features, pricing and care'],['Delivery & returns','The policies customers ask about'],['Services & packages','What you offer and how it works'],['Guest information','Stays, amenities and policies']].map(([title, detail]) => <div className="bot-source-row" key={title}><FileText size={19} aria-hidden="true" /><div><strong>{title}</strong><span>{detail}</span></div><Check size={16} aria-hidden="true" /></div>)}
            <p>Different assistants. Separate business knowledge.</p>
          </div>
          <div className="bot-knowledge-chat">
            <div className="bot-mock-header"><span className="bot-elvora-spark"><MessageCircle size={19} /></span><strong>Your assistant</strong><span>EXAMPLE</span></div>
            <p className="bot-sample-user">Can you help me find the right option?</p>
            <p className="bot-sample-answer">Of course. Tell me what you need, and I’ll guide you using our business information.</p>
            <div className="bot-answer-source"><BookOpen size={13} /> Your approved knowledge</div>
            <div className="bot-mock-input">Ask a question…<Send size={16} /></div>
          </div>
        </div>
      </div>

      <div id="meet-assistants" className="bot-editorial-collection">
        <div className="bot-collection-heading"><span className="bot-kicker">MEET THE ASSISTANTS</span><h2>Different jobs.<br />One thoughtful experience.</h2><p>Choose an assistant and open the chat. These are fictional businesses with sample knowledge.</p></div>
        {featured.map((bot, index) => {
          if (!isBusinessAssistant(bot.id)) return null;
          const art = botShowcase[bot.id];
          return <article className={`bot-feature bot-feature-${bot.id}${index % 2 ? " bot-feature-reverse" : ""}`} key={bot.id} aria-labelledby={`bot-name-${bot.id}`}>
            <button className="bot-showcase-visual" type="button" aria-haspopup="dialog" aria-label={`Open chat preview: ${bot.name}`} onClick={() => open(bot)}>
              <Image src={art.image} alt={art.alt} fill sizes="(max-width: 760px) 100vw, 55vw" className="bot-showcase-image" />
              <span className="bot-visual-wash" aria-hidden="true" />
              <span className="bot-chat-mock" aria-hidden="true">
                <span className="bot-mock-header"><BotAvatar id={bot.id} /><span><strong>{bot.name}</strong><small>Sample conversation</small></span><span className="bot-mock-dots">•••</span></span>
                <span className="bot-sample-user">{art.question}</span>
                <span className="bot-sample-answer">{art.answer}</span>
                <span className="bot-answer-source"><BookOpen size={12} /> {art.source}</span>
                <span className="bot-preview-product"><strong>{art.cardLabel}</strong><small>{art.cardDetail}</small></span>
                <span className="bot-mock-input">Ask {bot.name.split(" ")[0]} a question… <Send size={15} /></span>
              </span>
              <span className="bot-image-invitation">Open {bot.name.split(" ")[0]} <ArrowUpRight size={17} /></span>
            </button>
            <div className="bot-feature-copy">
              <span className="bot-kicker">{art.category}</span>
              <h3 id={`bot-name-${bot.id}`}>{art.title}</h3>
              <p>{art.description}</p>
              <ul>{art.abilities.map(ability => <li key={ability}><Check size={16} aria-hidden="true" />{ability}</li>)}</ul>
              <button type="button" className="bot-pill bot-pill-dark" aria-haspopup="dialog" aria-label={`${launchLabel(bot)}: ${bot.name}`} onClick={() => open(bot)}>{launchLabel(bot)} <ArrowUpRight size={17} aria-hidden="true" /></button>
              <span className="bot-feature-caption">{bot.name} · {bot.aiReady === false ? "AI connection pending" : "AI demo with sample business data"}</span>
              <a className="bot-source-link" href={`/api/bot-knowledge?botId=${bot.id}`} target="_blank" rel="noopener noreferrer">See what this assistant knows <ArrowUpRight size={13} /></a>
            </div>
          </article>;
        })}
      </div>

      {other.length > 0 && <div className="bot-more-section"><div className="bot-more-heading"><span className="bot-kicker">MORE WAYS TO TALK</span><h2>Study support.<br />A voice-first conversation.</h2></div><div className="bot-more-grid">{other.map(bot => <article className={`bot-extra bot-extra-${bot.id}`} key={bot.id}>
        <button className="bot-extra-open" type="button" aria-label={`Open chat: ${bot.name}`} aria-haspopup="dialog" onClick={() => open(bot)}><span className="bot-extra-icon">{bot.id === 'voice' ? <AudioLines size={32} /> : <BookOpen size={32} />}</span><span className="bot-extra-dialog"><span>How can I help?</span><span>{bot.id === 'voice' ? 'Type or use your microphone.' : 'Let’s work through your study questions.'}</span></span><ArrowUpRight size={25} /></button>
        <h3>{bot.name}</h3><p>{bot.description}</p><button type="button" className="bot-text-button" onClick={() => open(bot)} aria-label={`Open chat: ${bot.name}`} aria-haspopup="dialog">Open assistant <ArrowUpRight size={16} /></button>
      </article>)}</div></div>}

      <div className="bot-motion-story"><div><span className="bot-kicker">A CONVERSATION IN CONTEXT</span><h2>Built to feel<br />part of your website.</h2><p>Your brand, your information and a clear role for the assistant. Watch the idea in motion.</p></div><AiBotVideo /></div>
      <div className="bot-bottom-note"><MessageCircle size={19} aria-hidden="true" /><p>Sample conversations illustrate the approved demo knowledge. Live AI replies need a connected service and are subject to usage limits. These demos do not place orders, submit enquiries or reserve rooms.</p></div>
      {active && <ChatPanel key={active.id} bot={active} messages={history[active.id] || []} onMessagesChange={messages => setHistory(current => ({...current,[active.id]:messages}))} onClose={() => setActive(null)} />}
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
            <summary><span><strong>{method.title}</strong><small>{method.description}</small></span><ArrowUpRight size={20} aria-hidden="true" /></summary>
            <div className="bot-integration-body">
              <pre aria-label={`${method.title}: ${copy.example}`} tabIndex={0}><code>{method.code}</code></pre>
              <div><h4>{copy.pros}</h4><ul>{method.pros.map(pro => <li key={pro}>{pro}</li>)}</ul><h4>{copy.cons}</h4><ul>{method.cons.map(con => <li key={con}>{con}</li>)}</ul></div>
              <p className="bot-integration-used">{copy.usedBy}: {bots.filter(bot => bot.method === method.id).map(bot => bot.name).join(" · ") || copy.unusedMethod}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
