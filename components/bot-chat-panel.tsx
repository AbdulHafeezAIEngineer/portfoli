"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AudioLines, Bot as BotIcon, LoaderCircle, Mic, MicOff, Send, Square, Trash2, Volume2, X } from "lucide-react";
import { botContent, chatPolicy, type Bot, type ChatMessage } from "@/data/bots";
import { buildContext } from "@/lib/chat/protocol";
import { useModal } from "@/hooks/use-modal";
import { useVoice } from "@/hooks/use-voice";

export default function BotChatPanel({ bot, messages, onMessagesChange, onClose }: { bot: Bot; messages: ChatMessage[]; onMessagesChange: (messages: ChatMessage[]) => void; onClose: () => void }) {
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
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [readAloud, setReadAloud] = useState(true);
  const copy = botContent.chat;
  const voice = useVoice(bot.id === "voice", (text) => { setDraft((value) => `${value}${value ? " " : ""}${text}`.slice(0, chatPolicy.maxInput)); input.current?.focus(); });
  const external = bot.kind === "real" && bot.method !== "api";
  const lastReply = [...messages].reverse().find((message) => message.role === "assistant")?.content;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; controller.current?.abort(); };
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [messages, pending, error]);
  useEffect(() => {
    if (wasPending.current && !pending) input.current?.focus();
    wasPending.current = Boolean(pending);
  }, [pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || controller.current || content.length > chatPolicy.maxInput) return;
    voice.stop(); voice.stopSpeaking();
    const abort = new AbortController();
    controller.current = abort;
    setError(""); setShortened(false); setPending(content); setDraft("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ botId: bot.id, messages: buildContext(messages, content) }), signal: abort.signal });
      const data: unknown = await response.json();
      if (!mounted.current) return;
      if (!response.ok) throw new Error(data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error.slice(0, 400) : copy.error);
      if (!data || typeof data !== "object" || !("reply" in data) || typeof data.reply !== "string" || !data.reply.trim() || data.reply.length > chatPolicy.maxReply) throw new Error(copy.invalidReply);
      const next: ChatMessage[] = [...messages, { role: "user", content }, { role: "assistant", content: data.reply }];
      onMessagesChange(next.slice(-40));
      setShortened("truncated" in data && data.truncated === true);
      if (bot.id === "voice" && readAloud) voice.speak(data.reply);
    } catch (reason) {
      if (mounted.current && !abort.signal.aborted) { setError(reason instanceof Error ? reason.message : copy.error); setDraft(content); }
    } finally {
      if (mounted.current) { setPending(""); input.current?.focus(); }
      controller.current = null;
    }
  }

  return (
    <dialog ref={dialog} className="chat-dialog" aria-labelledby="chat-title" aria-describedby="chat-note" onKeyDown={trapFocus} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="chat-panel">
        <header className="chat-header"><span className="chat-avatar" aria-hidden="true">{bot.id === "voice" ? <AudioLines size={24} /> : <BotIcon size={24} />}</span><div><p className="eyebrow">{botContent.methods[bot.method]}</p><h2 id="chat-title">{bot.name}</h2></div><div className="chat-header-actions">{!external && bot.configured && <button className="icon-button" disabled={Boolean(pending) || messages.length === 0} aria-label={copy.clear} onClick={() => { onMessagesChange([]); setError(""); setShortened(false); voice.stopSpeaking(); }}><Trash2 size={17} /></button>}<button className="icon-button" autoFocus onClick={onClose} aria-label={copy.close}><X size={23} /></button></div></header>
        <p id="chat-note" className="chat-note">{bot.note}</p>
        {!bot.configured ? <div className="chat-unconfigured"><BotIcon size={46} aria-hidden="true" /><h3>{copy.emptyRealTitle}</h3><p>{copy.emptyReal}</p></div> : external ? <div className="external-chat">{!embedLoaded && <p className="embed-loading" role="status"><LoaderCircle size={20} className="spin" />{copy.embedLoading}</p>}<iframe src="/api/bot-embed" title={`${bot.name}: ${copy.embedTitle}`} sandbox={bot.method === "script" ? "allow-scripts allow-forms allow-popups" : "allow-scripts allow-forms allow-same-origin allow-popups"} referrerPolicy="no-referrer" onLoad={() => setEmbedLoaded(true)} /><p>{copy.embedNote}</p></div> : <>
          <div className="chat-messages" role="log" aria-label={copy.transcript} aria-live="polite" aria-relevant="additions text" aria-atomic="false">
            {bot.welcome && <div className="message message-assistant"><span className="message-author">{bot.name}</span><p>{bot.welcome}</p></div>}
            {messages.map((message, index) => <div className={`message message-${message.role}`} key={`${index}-${message.role}`}><span className="message-author">{message.role === "user" ? copy.you : bot.name}</span><p>{message.content}</p></div>)}
            {pending && <><div className="message message-user"><span className="message-author">{copy.you}</span><p>{pending}</p></div><div className="typing-indicator" role="status"><span>{copy.thinking}</span><i /><i /><i /></div></>}
            {shortened && <p className="chat-small-note">{copy.shortened}</p>}
            <div ref={end} />
          </div>
          <div className="chat-compose">
            {bot.id === "voice" && <div className="voice-controls">{voice.supported === false && <p className="voice-fallback">{copy.voice.unsupported}</p>}{voice.playbackSupported === false && <p className="voice-fallback">{copy.voice.noPlayback}</p>}{voice.playbackSupported && <div className="voice-playback"><label><input type="checkbox" checked={readAloud} onChange={(event) => { setReadAloud(event.target.checked); if (!event.target.checked) voice.stopSpeaking(); }} />{copy.voice.playback}</label>{voice.speaking ? <button className="icon-button" onClick={voice.stopSpeaking} aria-label={copy.voice.stopPlayback}><Square size={15} /></button> : <button className="icon-button" disabled={!lastReply || Boolean(pending)} onClick={() => lastReply && voice.speak(lastReply)} aria-label={copy.voice.replay}><Volume2 size={18} /></button>}</div>}{(voice.listening || voice.speaking) && <p className="voice-status" role="status">{voice.listening ? copy.voice.listening : copy.voice.speaking}</p>}{voice.error && <p className="chat-error" role="alert">{voice.error}</p>}</div>}
            {!messages.length && !pending && <div className="chat-starters">{bot.starters.map((starter) => <button key={starter} onClick={() => { setDraft(starter); input.current?.focus(); }}>{starter}</button>)}</div>}
            {error && <p className="chat-error" role="alert">{error}</p>}
            <form onSubmit={send}><label htmlFor="chat-message" className="sr-only">{copy.input}</label><div className="chat-input-row"><textarea id="chat-message" ref={input} placeholder={copy.placeholder} value={draft} maxLength={chatPolicy.maxInput} rows={2} disabled={Boolean(pending)} onChange={(event) => setDraft(event.target.value)} aria-describedby="chat-input-count" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />{bot.id === "voice" && <button type="button" className={`icon-button mic-button ${voice.listening ? "listening" : ""}`} disabled={!voice.supported || Boolean(pending)} aria-label={voice.listening ? copy.voice.stop : copy.voice.start} aria-pressed={voice.listening} onClick={voice.listening ? voice.stop : voice.start}>{voice.listening ? <MicOff size={19} /> : <Mic size={19} />}</button>}<button className="chat-send" type="submit" disabled={!draft.trim() || Boolean(pending)} aria-label={copy.send}>{pending ? <LoaderCircle size={18} className="spin" /> : <Send size={18} />}</button></div><p className="chat-input-meta" id="chat-input-count">{draft.length} / {chatPolicy.maxInput} {copy.limit}</p></form>
            <p className="chat-privacy">{bot.id === "voice" ? copy.voice.privacy : botContent.privacy}</p>
          </div>
        </>}
      </section>
    </dialog>
  );
}
