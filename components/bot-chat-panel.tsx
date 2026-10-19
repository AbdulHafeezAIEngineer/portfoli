"use client";
import Image from "next/image";
import { BotEmbed } from "./bot-embed";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AudioLines,
  Bot as BotIcon,
  LoaderCircle,
  Mic,
  MicOff,
  Send,
  Square,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import {
  botContent,
  chatPolicy,
  type Bot,
  type ChatMessage,
} from "@/data/bots";
import { buildContext } from "@/lib/chat/protocol";
import { useModal } from "@/hooks/use-modal";
import { useVoice } from "@/hooks/use-voice";
import { BotAvatar } from "./bot-avatar";
import { isBusinessAssistant } from "@/data/business-assistants";
import { chatBranding } from "@/data/chat-branding";

function AssistantIdentity({ bot, branded }: { bot: Bot; branded: boolean }) {
  return <span className="message-author">
    {branded && <span className="message-mini-mark" aria-hidden="true">{isBusinessAssistant(bot.id) ? <BotAvatar id={bot.id} /> : <AudioLines size={14} />}</span>}
    {bot.name}
  </span>;
}

export default function BotChatPanel({
  bot,
  messages,
  onMessagesChange,
  onClose,
}: {
  bot: Bot;
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const wasPending = useRef(false);
  const trapFocus = useModal(dialog);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [shortened, setShortened] = useState(false);
  const [readAloud, setReadAloud] = useState(true);
  const copy = botContent.chat;
  const voice = useVoice(bot.id === "voice", (text) => {
    setDraft((value) =>
      `${value}${value ? " " : ""}${text}`.slice(0, chatPolicy.maxInput),
    );
    input.current?.focus();
  });
  const external = bot.method !== "api";
  const brandId = !external && Object.hasOwn(chatBranding, bot.id) ? bot.id as keyof typeof chatBranding : null;
  const brand = brandId ? chatBranding[brandId] : null;
  const setupNotice = bot.aiSetup && bot.aiSetup !== "ready"
    ? botContent.setupNotices[bot.aiSetup]
    : botContent.setupNotice;
  const lastReply = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.content;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, pending, error]);
  useEffect(() => {
    if (wasPending.current && !pending) input.current?.focus();
    wasPending.current = Boolean(pending);
  }, [pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || controller.current || content.length > chatPolicy.maxInput)
      return;
    voice.stop();
    voice.stopSpeaking();
    const abort = new AbortController();
    controller.current = abort;
    setError("");
    setShortened(false);
    setPending(content);
    setDraft("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId: bot.id,
          messages: buildContext(messages, content),
        }),
        signal: abort.signal,
      });
      const data: unknown = await response.json();
      if (!mounted.current) return;
      if (!response.ok)
        throw new Error(
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error.slice(0, 400)
            : copy.error,
        );
      if (
        !data ||
        typeof data !== "object" ||
        !("reply" in data) ||
        typeof data.reply !== "string" ||
        !data.reply.trim() ||
        data.reply.length > chatPolicy.maxReply
      )
        throw new Error(copy.invalidReply);
      const next: ChatMessage[] = [
        ...messages,
        { role: "user", content },
        { role: "assistant", content: data.reply },
      ];
      onMessagesChange(next.slice(-40));
      setShortened("truncated" in data && data.truncated === true);
      if (bot.id === "voice" && readAloud) voice.speak(data.reply);
    } catch (reason) {
      if (mounted.current && !abort.signal.aborted) {
        setError(reason instanceof Error ? reason.message : copy.error);
        setDraft(content);
      }
    } finally {
      if (mounted.current) {
        setPending("");
        input.current?.focus();
      }
      controller.current = null;
    }
  }

  return (
    <dialog
      ref={dialog}
      className={`chat-dialog${brandId ? ` branded-chat branded-chat-${brandId}` : ""}`}
      data-chat-brand={brandId || undefined}
      aria-labelledby="chat-title"
      aria-describedby="chat-note"
      onKeyDown={trapFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="chat-panel">
        <header className="chat-header">
          {brand ? <span className="chat-elvora-mark"><Image src="/elvora-logo.svg" width={48} height={48} alt="Elvora" priority /></span> : isBusinessAssistant(bot.id) ? <BotAvatar id={bot.id} /> : <span className="chat-avatar" aria-hidden="true">
            {bot.id === "voice" ? (
              <AudioLines size={24} />
            ) : (
              <BotIcon size={24} />
            )}
          </span>}
          <div>
            {brand ? <p className="chat-brand-wordmark">{brand.wordmark}</p> : <p className="eyebrow">{botContent.methods[bot.method]}</p>}
            <h2 id="chat-title">{bot.name}</h2>
            {brand && <span className="chat-brand-role">{brand.label}</span>}
          </div>
          <div className="chat-header-actions">
            {!external && bot.configured && (
              <button
                className="icon-button"
                disabled={Boolean(pending) || messages.length === 0}
                aria-label={copy.clear}
                onClick={() => {
                  onMessagesChange([]);
                  setError("");
                  setShortened(false);
                  voice.stopSpeaking();
                }}
              >
                <Trash2 size={17} />
              </button>
            )}
            <button
              className="icon-button"
              autoFocus
              onClick={onClose}
              aria-label={copy.close}
            >
              <X size={23} />
            </button>
          </div>
        </header>
        <p id="chat-note" className="chat-note">
          {brand ? brandId === "voice" ? "A voice-first demo. Text chat is always available." : "Demo business · Sample knowledge" : bot.note}
          {isBusinessAssistant(bot.id) && (
            <a href={`/api/bot-knowledge?botId=${bot.id}`} target="_blank" rel="noopener noreferrer" className="chat-knowledge-link">
              {botContent.knowledge}
            </a>
          )}
        </p>
        {!bot.configured ? (
          <div className="chat-unconfigured">
            <BotIcon size={46} aria-hidden="true" />
            <h3>{copy.emptyRealTitle}</h3>
            <p>{copy.emptyReal}</p>
          </div>
        ) : (
          <BotEmbed bot={bot}>
            <div
              className="chat-messages"
              role="log"
              aria-label={copy.transcript}
              aria-live="polite"
              aria-relevant="additions text"
              aria-atomic="false"
            >
              {bot.welcome && (
                <div className="message message-assistant">
                  <AssistantIdentity bot={bot} branded={Boolean(brand)} />
                  <p>{bot.welcome}</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  className={`message message-${message.role}`}
                  key={`${index}-${message.role}`}
                >
                  {message.role === "user" ? <span className="message-author">{copy.you}</span> : <AssistantIdentity bot={bot} branded={Boolean(brand)} />}
                  <p>{message.content}</p>
                </div>
              ))}
              {pending && (
                <>
                  <div className="message message-user">
                    <span className="message-author">{copy.you}</span>
                    <p>{pending}</p>
                  </div>
                  <div className="typing-indicator" role="status">
                    <span>{copy.thinking}</span>
                    <i />
                    <i />
                    <i />
                  </div>
                </>
              )}
              {shortened && <p className="chat-small-note">{copy.shortened}</p>}
              <div ref={end} />
            </div>
            <div className="chat-compose">
              {bot.aiReady === false && !error && <p className="chat-setup-notice" role="status">{setupNotice}</p>}
              {bot.id === "voice" && (
                <div className="voice-controls">
                  {voice.supported === false && (
                    <p className="voice-fallback">{copy.voice.unsupported}</p>
                  )}
                  {voice.playbackSupported === false && (
                    <p className="voice-fallback">{copy.voice.noPlayback}</p>
                  )}
                  {voice.playbackSupported && (
                    <div className="voice-playback">
                      <label>
                        <input
                          type="checkbox"
                          checked={readAloud}
                          onChange={(event) => {
                            setReadAloud(event.target.checked);
                            if (!event.target.checked) voice.stopSpeaking();
                          }}
                        />
                        {copy.voice.playback}
                      </label>
                      {voice.speaking ? (
                        <button
                          className="icon-button"
                          onClick={voice.stopSpeaking}
                          aria-label={copy.voice.stopPlayback}
                        >
                          <Square size={15} />
                        </button>
                      ) : (
                        <button
                          className="icon-button"
                          disabled={!lastReply || Boolean(pending)}
                          onClick={() => lastReply && voice.speak(lastReply)}
                          aria-label={copy.voice.replay}
                        >
                          <Volume2 size={18} />
                        </button>
                      )}
                    </div>
                  )}
                  {(voice.listening || voice.speaking) && (
                    <p className="voice-status" role="status">
                      {voice.listening
                        ? copy.voice.listening
                        : copy.voice.speaking}
                    </p>
                  )}
                  {voice.error && (
                    <p className="chat-error" role="alert">
                      {voice.error}
                    </p>
                  )}
                </div>
              )}
              {!messages.length && !pending && !error && (
                <div className="chat-starters">
                  {bot.starters.map((starter) => (
                    <button
                      key={starter}
                      onClick={() => {
                        setDraft(starter);
                        input.current?.focus();
                      }}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              )}
              {error && (
                <p className="chat-error" role="alert">
                  {error}
                </p>
              )}
              <form onSubmit={send}>
                <label htmlFor="chat-message" className="sr-only">
                  {copy.input}
                </label>
                <div className="chat-input-row">
                  <textarea
                    id="chat-message"
                    ref={input}
                    placeholder={brand?.prompt || copy.placeholder}
                    value={draft}
                    maxLength={chatPolicy.maxInput}
                    rows={2}
                    disabled={Boolean(pending)}
                    onChange={(event) => setDraft(event.target.value)}
                    aria-describedby="chat-input-count"
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  {bot.id === "voice" && (
                    <button
                      type="button"
                      className={`icon-button mic-button ${voice.listening ? "listening" : ""}`}
                      disabled={!voice.supported || Boolean(pending)}
                      aria-label={
                        voice.listening ? copy.voice.stop : copy.voice.start
                      }
                      aria-pressed={voice.listening}
                      onClick={voice.listening ? voice.stop : voice.start}
                    >
                      {voice.listening ? (
                        <MicOff size={19} />
                      ) : (
                        <Mic size={19} />
                      )}
                    </button>
                  )}
                  <button
                    className="chat-send"
                    type="submit"
                    disabled={!draft.trim() || Boolean(pending)}
                    aria-label={copy.send}
                  >
                    {pending ? (
                      <LoaderCircle size={18} className="spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                <p className="chat-input-meta" id="chat-input-count">
                  {draft.length} / {chatPolicy.maxInput} {copy.limit}
                </p>
              </form>
              {brand ? <div className="chat-brand-footer"><details className="chat-privacy-details"><summary>About this chat</summary><p>{bot.note}</p><p>{bot.id === "voice" ? copy.voice.privacy : botContent.privacy}</p></details><span className="chat-brand-credit"><Image src="/elvora-logo.svg" width={15} height={15} alt="" />Built by Elvora</span></div> : <p className="chat-privacy">{bot.id === "voice" ? copy.voice.privacy : botContent.privacy}</p>}
            </div>
          </BotEmbed>
        )}
      </section>
    </dialog>
  );
}
