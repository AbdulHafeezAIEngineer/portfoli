## components/admin-app.tsx

``````tsx
"use client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  LoaderCircle,
  LogOut,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { adminContent as copy, adminDefaults, adminFields } from "@/data/admin";
type RecordData = Record<string, unknown>;
async function api(resource: string, method = "GET", body?: unknown) {
  const response = await fetch(`/api/admin/${resource}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(typeof data.error === "string" ? data.error : copy.error);
  return data;
}
export function AdminApp({ section }: { section: string }) {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [dashboard, setDashboard] = useState<RecordData>({});
  const [editor, setEditor] = useState<RecordData | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const data = await api(section === "security" ? "dashboard" : section);
      if (section === "dashboard" || section === "security") setDashboard(data);
      else if (section === "settings")
        setEditor(data || adminDefaults.settings);
      else setRecords(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.error);
    } finally {
      setBusy(false);
    }
  }, [section]);
  useEffect(() => {
    if (section !== "login") void load();
  }, [section, load]);
  if (section === "login") return <AdminLogin />;
  async function mutate(method: string, body: unknown) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api(section, method, body);
      setEditor(null);
      setMessage(method === "DELETE" ? copy.deleted : copy.saved);
      await load();
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.error);
    } finally {
      setBusy(false);
    }
  }
  async function move(index: number, direction: number) {
    const next = [...records];
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    await mutate("PATCH", { ids: next.map((record) => record.id) });
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="wordmark" href="/admin">
          Elvora<span>.</span>
        </Link>
        <p>{copy.subtitle}</p>
        <nav aria-label={copy.subtitle}>
          <Link
            href="/admin"
            aria-current={section === "dashboard" ? "page" : undefined}
          >
            {copy.dashboard}
          </Link>
          {copy.resources.map((resource) => (
            <Link
              key={resource.id}
              href={`/admin/${resource.id}`}
              aria-current={section === resource.id ? "page" : undefined}
            >
              {resource.label}
            </Link>
          ))}
          <Link
            href="/admin/security"
            aria-current={section === "security" ? "page" : undefined}
          >
            {copy.security}
          </Link>
        </nav>
        <Link href="/" className="admin-back">
          {copy.back}
          <ArrowUpRight size={15} />
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          <LogOut size={15} />
          {copy.signOut}
        </button>
      </aside>
      <main id="main-content" className="admin-main">
        <header>
          <div>
            <p className="eyebrow">{copy.title}</p>
            <h1>
              {section === "dashboard"
                ? copy.dashboard
                : section === "security"
                  ? copy.security
                  : copy.resources.find((resource) => resource.id === section)
                      ?.label}
            </h1>
          </div>
          {adminDefaults[section] && section !== "settings" && (
            <button
              className="button button-gold"
              onClick={() => {
                setEditor({ ...adminDefaults[section] });
                setMessage("");
              }}
            >
              <Plus size={17} />
              {copy.new}
            </button>
          )}
        </header>
        {busy && (
          <p className="admin-loading" role="status">
            <LoaderCircle size={18} className="spin" />
            {copy.loading}
          </p>
        )}
        {error && (
          <p className="form-failure" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="form-success" role="status">
            {message}
          </p>
        )}
        {section === "dashboard" && (
          <>
            <p className="admin-note">{copy.originWarning}</p>
            <div className="admin-stats">
              {Object.entries(dashboard)
                .filter(([key]) => key !== "twoFactor")
                .map(([key, value]) => (
                  <article className="glass" key={key}>
                    <span>{key}</span>
                    <strong>{String(value)}</strong>
                  </article>
                ))}
            </div>
          </>
        )}
        {section === "security" ? (
          <SecurityPanel enabled={dashboard.twoFactor === true} />
        ) : editor ? (
          <RecordEditor
            resource={section}
            initial={editor}
            busy={busy}
            onSave={(data) => mutate("POST", data)}
            onClose={() => setEditor(null)}
          />
        ) : (
          section !== "dashboard" &&
          section !== "settings" && (
            <div className="admin-records">
              {["projects", "bots", "skills", "certificates"].includes(
                section,
              ) && <p className="admin-note">{copy.reorderHelp}</p>}
              {section === "chatlogs" && (
                <p className="admin-note">{copy.retention}</p>
              )}
              {!busy && !records.length && <p>{copy.empty}</p>}
              {records.map((record, index) => (
                <article className="admin-record glass" key={String(record.id)}>
                  <div>
                    <h2>
                      {String(
                        record.title ||
                          record.name ||
                          record.botId ||
                          record.action ||
                          record.id,
                      )}
                    </h2>
                    {Boolean(record.email) && (
                      <a href={`mailto:${String(record.email)}`}>
                        {String(record.email)}
                      </a>
                    )}
                    {Boolean(record.createdAt) && (
                      <time dateTime={String(record.createdAt)}>
                        {new Date(String(record.createdAt)).toLocaleString()}
                      </time>
                    )}
                    {Boolean(record.message) && (
                      <p className="admin-message">{String(record.message)}</p>
                    )}
                    {Boolean(record.userMessage) && (
                      <>
                        <p className="admin-message">
                          {String(record.userMessage)}
                        </p>
                        <p className="admin-message admin-reply">
                          {String(record.reply)}
                        </p>
                      </>
                    )}
                    {Boolean(record.deliveryStatus) && (
                      <p>
                        {copy.delivery}: {String(record.deliveryStatus)}
                      </p>
                    )}
                    {Boolean(record.resource) && (
                      <p>
                        {String(record.resource)} /{" "}
                        {String(record.recordId || "")}
                      </p>
                    )}
                  </div>
                  <div className="admin-record-actions">
                    {adminFields[section] && (
                      <>
                        <button
                          className="icon-button"
                          disabled={busy || index === 0}
                          aria-label={`${copy.up}: ${String(record.title || record.name)}`}
                          onClick={() => move(index, -1)}
                        >
                          <ArrowUp size={17} />
                        </button>
                        <button
                          className="icon-button"
                          disabled={busy || index === records.length - 1}
                          aria-label={`${copy.down}: ${String(record.title || record.name)}`}
                          onClick={() => move(index, 1)}
                        >
                          <ArrowDown size={17} />
                        </button>
                        <button
                          className="button button-outline"
                          disabled={busy}
                          onClick={() => setEditor(record)}
                        >
                          {copy.edit}
                        </button>
                      </>
                    )}
                    {section === "inbox" && (
                      <button
                        className="button button-outline"
                        disabled={busy}
                        onClick={() =>
                          mutate("PATCH", { id: record.id, read: !record.read })
                        }
                      >
                        {record.read ? copy.unread : copy.read}
                      </button>
                    )}
                    {section !== "audit" && (
                      <button
                        className="icon-button"
                        disabled={busy}
                        aria-label={`${copy.remove}: ${String(record.title || record.name || record.id)}`}
                        onClick={() => {
                          if (window.confirm(copy.deleteConfirm))
                            void mutate("DELETE", { id: record.id });
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
function AdminLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <main id="main-content" className="admin-login">
      <form
        className="glass"
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const form = new FormData(event.currentTarget);
          setBusy(true);
          setError("");
          try {
            const result = await signIn("credentials", {
              redirect: false,
              email: form.get("email"),
              password: form.get("password"),
              code: form.get("code"),
              callbackUrl: "/admin",
            });
            if (result?.ok && !result.error) window.location.assign("/admin");
            else setError(copy.loginError);
          } catch {
            setError(copy.loginError);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Link className="wordmark" href="/">
          Elvora<span>.</span>
        </Link>
        <h1>{copy.loginTitle}</h1>
        <p>{copy.loginDescription}</p>
        <label htmlFor="admin-email">{copy.email}</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          maxLength={254}
        />
        <label htmlFor="admin-password">{copy.password}</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={128}
        />
        <label htmlFor="admin-code">{copy.code}</label>
        <input
          id="admin-code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
        />
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <button className="button button-gold" disabled={busy}>
          {busy ? copy.signingIn : copy.signIn}
        </button>
      </form>
    </main>
  );
}
function RecordEditor({
  resource,
  initial,
  busy,
  onSave,
  onClose,
}: {
  resource: string;
  initial: RecordData;
  busy: boolean;
  onSave: (data: RecordData) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState<RecordData>(() =>
    Object.fromEntries(
      (adminFields[resource] || []).map((field) => [
        field.key,
        field.type === "json"
          ? JSON.stringify(initial[field.key] ?? null, null, 2)
          : (initial[field.key] ?? (field.type === "boolean" ? false : "")),
      ]),
    ),
  );
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  return (
    <form
      className="admin-editor glass"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        try {
          const data: RecordData = {};
          for (const field of adminFields[resource])
            data[field.key] =
              field.type === "json"
                ? JSON.parse(String(values[field.key]))
                : values[field.key];
          if (resource !== "settings" && typeof initial.order === "number")
            data.order = initial.order;
          onSave(data);
        } catch {
          setError(copy.jsonHelp);
        }
      }}
    >
      <div className="admin-editor-top">
        <p className="admin-note">{copy.noSecrets}</p>
        {resource !== "settings" && (
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label={copy.cancel}
          >
            <X size={20} />
          </button>
        )}
      </div>
      {adminFields[resource]?.map((field) => (
        <div className="form-field" key={field.key}>
          <label htmlFor={`edit-${field.key}`}>
            {copy.fields[field.key as keyof typeof copy.fields] || field.key}
          </label>
          {field.type === "boolean" ? (
            <input
              id={`edit-${field.key}`}
              type="checkbox"
              checked={Boolean(values[field.key])}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]: event.target.checked,
                }))
              }
            />
          ) : field.type === "json" || field.type === "long" ? (
            <textarea
              id={`edit-${field.key}`}
              rows={field.type === "json" ? 5 : 4}
              value={String(values[field.key])}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
            />
          ) : (
            <input
              id={`edit-${field.key}`}
              type={field.type === "number" ? "number" : "text"}
              value={String(values[field.key])}
              readOnly={field.key === "id" && Boolean(initial.id)}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]:
                    field.type === "number"
                      ? Number(event.target.value)
                      : event.target.value,
                }))
              }
            />
          )}
        </div>
      ))}
      {["projects", "certificates"].includes(resource) && (
        <div className="admin-upload">
          <label htmlFor="admin-images">{copy.upload}</label>
          <p>{copy.uploadHelp}</p>
          <input
            id="admin-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={resource === "projects"}
            disabled={uploading || busy}
            onChange={async (event) => {
              const files = event.target.files;
              if (!files?.length) return;
              setUploading(true);
              setError("");
              try {
                const form = new FormData();
                for (const file of Array.from(files))
                  form.append("images", file);
                const response = await fetch("/api/admin/upload", {
                  method: "POST",
                  body: form,
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || copy.error);
                setValues((current) =>
                  resource === "certificates"
                    ? { ...current, image: result.images[0].src }
                    : {
                        ...current,
                        screenshots: JSON.stringify(
                          [
                            ...JSON.parse(String(current.screenshots)),
                            ...result.images,
                          ],
                          null,
                          2,
                        ),
                      },
                );
              } catch (error) {
                setError(error instanceof Error ? error.message : copy.error);
              } finally {
                setUploading(false);
                event.target.value = "";
              }
            }}
          />
          {uploading && <p role="status">{copy.uploading}</p>}
        </div>
      )}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <p className="admin-note">{copy.jsonHelp}</p>
      <button className="button button-gold" disabled={busy || uploading}>
        {copy.save}
      </button>
    </form>
  );
}
function SecurityPanel({ enabled }: { enabled: boolean }) {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [code, setCode] = useState("");
  const [setup, setSetup] = useState<{ secret: string; ticket: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function perform(operation: string) {
    setBusy(true);
    setError("");
    try {
      const result = await api("security", "POST", {
        operation,
        currentPassword,
        newPassword,
        code,
        ...(setup ? { ticket: setup.ticket } : {}),
      });
      if (result.secret) setSetup(result);
      if (result.signOut) await signOut({ callbackUrl: "/admin/login" });
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-editor glass">
      <div className="form-field">
        <label htmlFor="current-password">{copy.currentPassword}</label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrent(event.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="new-password">{copy.newPassword}</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNew(event.target.value)}
        />
        <p className="admin-note">{copy.passwordRule}</p>
      </div>
      <div className="form-field">
        <label htmlFor="security-code">{copy.code}</label>
        <input
          id="security-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          maxLength={6}
          onChange={(event) => setCode(event.target.value)}
        />
      </div>
      <button
        className="button button-gold"
        disabled={busy}
        onClick={() => perform("password")}
      >
        {copy.changePassword}
      </button>
      <hr />
      <h2>{copy.twoFactor}</h2>
      {setup && (
        <div className="totp-setup">
          <p>{copy.setupHelp}</p>
          <label>{copy.setupSecret}</label>
          <code>{setup.secret}</code>
        </div>
      )}
      <button
        className="button button-outline"
        disabled={busy}
        onClick={() =>
          perform(
            enabled ? "totp-disable" : setup ? "totp-confirm" : "totp-setup",
          )
        }
      >
        {enabled ? copy.disable : setup ? copy.confirm : copy.setup}
      </button>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
``````

## components/back-to-top.tsx

``````tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  if (!visible) return null;
  return (
    <a
      href="#top"
      className="back-to-top icon-button"
      aria-label={site.ui.back}
    >
      <ArrowUp size={19} />
    </a>
  );
}
``````

## components/bot-chat-panel.tsx

``````tsx
"use client";
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
      className="chat-dialog"
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
          <span className="chat-avatar" aria-hidden="true">
            {bot.id === "voice" ? (
              <AudioLines size={24} />
            ) : (
              <BotIcon size={24} />
            )}
          </span>
          <div>
            <p className="eyebrow">{botContent.methods[bot.method]}</p>
            <h2 id="chat-title">{bot.name}</h2>
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
          {bot.note}
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
                  <span className="message-author">{bot.name}</span>
                  <p>{bot.welcome}</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  className={`message message-${message.role}`}
                  key={`${index}-${message.role}`}
                >
                  <span className="message-author">
                    {message.role === "user" ? copy.you : bot.name}
                  </span>
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
              {!messages.length && !pending && (
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
                    placeholder={copy.placeholder}
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
              <p className="chat-privacy">
                {bot.id === "voice" ? copy.voice.privacy : botContent.privacy}
              </p>
            </div>
          </BotEmbed>
        )}
      </section>
    </dialog>
  );
}
``````

## components/bot-embed.tsx

``````tsx
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
``````

## components/bot-services.tsx

``````tsx
"use client";

import dynamic from "next/dynamic";
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

const ChatPanel = dynamic(() => import("./bot-chat-panel"), { ssr: false });
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
    <section id="ai-bots" className="bot-services" aria-labelledby="bots-title">
      <Reveal>
        <div className="section-heading bots-heading">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="bots-title">{copy.title}</h2>
          </div>
          <p>{copy.description}</p>
        </div>
      </Reveal>
      <div className="bots-grid">
        {bots.map((bot, index) => {
          const Icon = icons[bot.id as keyof typeof icons] || Sparkles;
          return (
            <Reveal key={bot.id} delay={(index % 2) * 0.06}>
              <article
                className={`bot-card bot-card-${bot.id}`}
                aria-labelledby={`bot-name-${bot.id}`}
              >
                <div className="bot-card-top">
                  <div className="bot-art" aria-hidden="true">
                    <span />
                    <Icon size={42} strokeWidth={1.2} />
                    <i />
                    <i />
                    <i />
                  </div>
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
                    <button
                      className="button button-outline"
                      aria-haspopup="dialog"
                      aria-label={`${copy.try}: ${bot.name}`}
                      onClick={() => setActive(bot)}
                    >
                      {copy.try}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                    {!bot.configured && (
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
      <section
        id="embed-methods"
        className="embed-section"
        aria-labelledby="embed-title"
      >
        <Reveal>
          <p className="eyebrow">{copy.integrationEyebrow}</p>
          <h3 id="embed-title">{copy.embedTitle}</h3>
          <p className="embed-intro">{copy.embedDescription}</p>
        </Reveal>
        <div className="embed-grid">
          {embedMethods.map((method, index) => (
            <article className="embed-card glass" key={method.id}>
              <span className="embed-number">0{index + 1}</span>
              <h4>{method.title}</h4>
              <p>{method.description}</p>
              <pre aria-label={`${method.title}: ${copy.example}`} tabIndex={0}>
                <code>{method.code}</code>
              </pre>
              <h5>{copy.pros}</h5>
              <ul>
                {method.pros.map((pro) => (
                  <li key={pro}>{pro}</li>
                ))}
              </ul>
              <h5>{copy.cons}</h5>
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
``````

## components/brand-mark.tsx

``````tsx
import Image from "next/image";
import { site } from "@/data/site";

export function BrandMark({ brand }: { brand: string }) {
  return (
    <>
      <Image
        className="brand-symbol"
        src={site.logo.src}
        alt=""
        width={44}
        height={44}
        aria-hidden="true"
      />
      {brand}
    </>
  );
}
``````

## components/certificate-viewer.tsx

``````tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LoaderCircle, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  certificateContent as copy,
  type Certificate,
} from "@/data/certificates";
import { useModal } from "@/hooks/use-modal";

export default function CertificateViewer({
  certificate,
  onClose,
}: {
  certificate: Certificate;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trapFocus = useModal(dialog);
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  function reset() {
    setZoom(1);
    stage.current?.scrollTo({ left: 0, top: 0 });
  }
  return (
    <dialog
      className="certificate-dialog"
      ref={dialog}
      aria-labelledby="certificate-view-title"
      aria-describedby="certificate-help"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        trapFocus(event);
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          setZoom((value) => Math.min(3, value + 0.25));
        }
        if (event.key === "-") {
          event.preventDefault();
          setZoom((value) => Math.max(1, value - 0.25));
        }
        if (event.key === "0") {
          event.preventDefault();
          reset();
        }
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="certificate-view-shell">
        <header>
          <div>
            <p className="eyebrow">{certificate.issuer}</p>
            <h2 id="certificate-view-title">{certificate.title}</h2>
          </div>
          <button
            className="icon-button"
            autoFocus
            onClick={onClose}
            aria-label={copy.close}
          >
            <X size={23} />
          </button>
        </header>
        <div className="certificate-toolbar">
          <button
            className="icon-button"
            onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
            disabled={zoom <= 1}
            aria-label={copy.zoomOut}
          >
            <ZoomOut size={20} />
          </button>
          <span role="status" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="icon-button"
            onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
            disabled={zoom >= 3}
            aria-label={copy.zoomIn}
          >
            <ZoomIn size={20} />
          </button>
          <button
            className="icon-button"
            onClick={reset}
            aria-label={copy.reset}
          >
            <RotateCcw size={19} />
          </button>
        </div>
        <div
          className="certificate-stage"
          ref={stage}
          tabIndex={0}
          aria-label={certificate.title}
        >
          {!loaded && !failed && (
            <span className="certificate-loader" role="status">
              <LoaderCircle className="spin" size={26} />
              <span className="sr-only">{copy.loading}</span>
            </span>
          )}
          {failed ? (
            <p className="certificate-image-error" role="alert">
              {copy.unavailable}
            </p>
          ) : (
            <div
              className="certificate-zoom-canvas"
              style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
            >
              <Image
                src={certificate.image}
                alt={certificate.alt}
                fill
                sizes="(max-width: 700px) 200vw, 2400px"
                priority
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setLoaded(true);
                  setFailed(true);
                }}
              />
            </div>
          )}
        </div>
        <p id="certificate-help" className="certificate-help">
          {copy.help}
        </p>
      </div>
    </dialog>
  );
}
``````

## components/certifications.tsx

``````tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import {
  certificateContent as copy,
  type Certificate,
} from "@/data/certificates";
import { Reveal } from "./reveal";

const CertificateViewer = dynamic(() => import("./certificate-viewer"), {
  ssr: false,
});

export function Certifications({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  return (
    <section
      id="certification"
      className="container certification-section"
      aria-labelledby="certification-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="certification-title">{copy.title}</h2>
        <p className="section-intro">{copy.description}</p>
      </Reveal>
      {certificates.map((certificate) => (
        <Reveal key={certificate.id}>
          <article className="certificate-card glass">
            <button
              className="certificate-preview"
              onClick={() => setSelected(certificate)}
              aria-haspopup="dialog"
              aria-label={`${copy.enlarge}: ${certificate.title}`}
            >
              <Image
                src={certificate.image}
                alt={certificate.alt}
                width={1600}
                height={1120}
                sizes="(max-width: 700px) 90vw, 600px"
              />
              <span>
                <Expand size={17} aria-hidden="true" />
                {copy.enlarge}
              </span>
            </button>
            <div className="certificate-info">
              {certificate.isPlaceholder && (
                <p className="placeholder-tag">{copy.placeholder}</p>
              )}
              <h3>{certificate.title}</h3>
              <dl>
                <div>
                  <dt>{copy.issuer}</dt>
                  <dd>{certificate.issuer}</dd>
                </div>
                <div>
                  <dt>{copy.date}</dt>
                  <dd>
                    {certificate.issuedAt ? (
                      <time dateTime={certificate.issuedAt}>
                        {certificate.dateLabel}
                      </time>
                    ) : (
                      certificate.dateLabel
                    )}
                  </dd>
                </div>
              </dl>
              <p>{certificate.description}</p>
            </div>
          </article>
        </Reveal>
      ))}
      {selected && (
        <CertificateViewer
          certificate={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
``````

## components/contact-form.tsx

``````tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Turnstile } from "./turnstile";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import {
  contactContent as copy,
  contactPolicy as policy,
} from "@/data/contact";
import {
  contactFields,
  fieldErrors,
  type ContactFields,
  type FieldErrors,
} from "@/lib/contact/schema";

const empty: ContactFields = { name: "", email: "", message: "" };
export function ContactForm() {
  const [values, setValues] = useState<ContactFields>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [failure, setFailure] = useState("");
  const [turnstileToken, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const website = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const locked = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  function focusError(next: FieldErrors) {
    const field = (["name", "email", "message"] as const).find(
      (key) => next[key],
    );
    if (field)
      (form.current?.elements.namedItem(field) as HTMLElement | null)?.focus();
  }
  function validateField(key: keyof ContactFields) {
    const parsed = contactFields.shape[key].safeParse(values[key]);
    setErrors((current) => ({
      ...current,
      [key]: parsed.success ? undefined : parsed.error.issues[0]?.message,
    }));
  }
  function updateField(key: keyof ContactFields, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    if (status === "success") setStatus("idle");
    if (errors[key]) {
      const parsed = contactFields.shape[key].safeParse(value);
      setErrors((current) => ({
        ...current,
        [key]: parsed.success ? undefined : parsed.error.issues[0]?.message,
      }));
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    setStatus("idle");
    const parsed = contactFields.safeParse(values);
    if (!parsed.success) {
      const next = fieldErrors(parsed.error);
      setErrors(next);
      focusError(next);
      return;
    }
    setErrors({});
    locked.current = true;
    setSending(true);
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          website: website.current?.value || "",
          turnstileToken,
        }),
        signal: abort.signal,
      });
      const data: unknown = await response.json();
      const payload =
        data && typeof data === "object"
          ? (data as { ok?: boolean; error?: unknown; fields?: unknown })
          : null;
      if (response.status === 202 && payload?.ok === true) {
        setStatus("success");
        setValues(empty);
        if (website.current) website.current.value = "";
        return;
      }
      if (
        response.status === 422 &&
        payload?.fields &&
        typeof payload.fields === "object"
      ) {
        const next: FieldErrors = {};
        for (const key of ["name", "email", "message"] as const) {
          const message = (payload.fields as Record<string, unknown>)[key];
          if (typeof message === "string") next[key] = message;
        }
        setErrors(next);
        focusError(next);
      }
      setFailure(
        typeof payload?.error === "string" ? payload.error : copy.failure,
      );
      setStatus("error");
    } catch {
      if (!abort.signal.aborted) {
        setFailure(copy.failure);
        setStatus("error");
      }
    } finally {
      setToken("");
      setResetKey((key) => key + 1);
      locked.current = false;
      if (!abort.signal.aborted) setSending(false);
    }
  }
  return (
    <form
      ref={form}
      className="contact-form glass"
      onSubmit={submit}
      noValidate
      aria-busy={sending}
      aria-labelledby="contact-form-title"
    >
      <h3 id="contact-form-title">{copy.formTitle}</h3>
      <div className="form-pair">
        {(["name", "email"] as const).map((key) => (
          <div className="form-field" key={key}>
            <label htmlFor={`contact-${key}`}>{copy[key]}</label>
            <input
              id={`contact-${key}`}
              name={key}
              type={key === "email" ? "email" : "text"}
              autoComplete={key}
              required
              maxLength={key === "name" ? policy.maxName : policy.maxEmail}
              value={values[key]}
              placeholder={
                key === "name" ? copy.namePlaceholder : copy.emailPlaceholder
              }
              onChange={(event) => updateField(key, event.target.value)}
              onBlur={() => validateField(key)}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
              disabled={sending}
            />
            {errors[key] && (
              <p className="field-error" id={`${key}-error`}>
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">{copy.message}</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={policy.maxMessage}
          value={values.message}
          placeholder={copy.messagePlaceholder}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => validateField("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`message-hint${errors.message ? " message-error" : ""}`}
          disabled={sending}
        />
        <div className="message-meta">
          <p id="message-hint">{copy.messageHint}</p>
          <span>
            {values.message.length}/{policy.maxMessage}{" "}
            <span className="sr-only">{copy.characters}</span>
          </span>
        </div>
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">{copy.honeypot}</label>
        <input
          id="contact-website"
          name="website"
          ref={website}
          tabIndex={-1}
          autoComplete="off"
          maxLength={200}
        />
      </div>
      <Turnstile onToken={setToken} resetKey={resetKey} />
      <p className="contact-privacy">{copy.privacy}</p>
      <button className="button button-gold" type="submit" disabled={sending}>
        {sending ? (
          <>
            {copy.sending}
            <LoaderCircle size={18} className="spin" aria-hidden="true" />
          </>
        ) : (
          <>
            {copy.send}
            <ArrowUpRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <div aria-live="polite" role="status">
        {sending && <span className="sr-only">{copy.sendingStatus}</span>}
        {status === "success" && (
          <p className="form-success">
            <CheckCircle2 size={19} aria-hidden="true" />
            {copy.success}
          </p>
        )}
      </div>
      {status === "error" && (
        <div className="form-failure" role="alert">
          <strong>{copy.errorTitle}</strong>
          <p>{failure}</p>
        </div>
      )}
    </form>
  );
}
``````

## components/contact.tsx

``````tsx
import { ArrowUpRight, Mail } from "lucide-react";
import { contactContent as copy } from "@/data/contact";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";

export function Contact({ email }: { email: string }) {
  return (
    <section
      id="contact"
      className="container elvora-contact"
      aria-labelledby="contact-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="contact-title">{copy.title}</h2>
        <p className="section-intro">{copy.description}</p>
      </Reveal>
      <div className="contact-grid">
        <Reveal>
          <div className="email-card">
            <Mail size={28} strokeWidth={1.3} aria-hidden="true" />
            <p className="eyebrow">{copy.emailLabel}</p>
            <p>{copy.emailNote}</p>
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <small>{copy.emailCta}</small>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
``````

## components/demo-site.tsx

``````tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Menu,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { demos, demoUI as ui, type DemoSlug } from "@/data/demos";

export function DemoSite({ slug }: { slug: DemoSlug }) {
  const d = demos[slug];
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All homes");
  const [bag, setBag] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [notice, setNotice] = useState("");
  const [added, setAdded] = useState(false);
  return (
    <main id="main-content" className={`demo-site demo-${slug}`}>
      <div className="demo-concept-bar">
        <Link href="/#work">
          <ArrowLeft size={12} />
          {ui.back}
        </Link>
        <span>
          {ui.concept} / {d.category}
        </span>
        <span className="demo-fictional">{ui.footnote}</span>
      </div>
      <header className="demo-header">
        <a href="#demo-top" className="demo-wordmark">
          {d.name}
        </a>
        <nav
          aria-label={`${d.name} navigation`}
          className={menu ? "demo-nav is-open" : "demo-nav"}
        >
          {d.nav.map((label, i) => (
            <a
              key={label}
              href={i === 0 ? "#collection" : "#detail"}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="#collection" className="demo-header-cta">
          {slug === "store" ? (
            <>
              <ShoppingBag size={16} />
              {ui.bag} ({bag})
            </>
          ) : (
            <>
              {d.action}
              <ArrowRight size={15} />
            </>
          )}
        </a>
        <button
          className="demo-menu"
          aria-expanded={menu}
          aria-label={menu ? ui.close : ui.menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <section id="demo-top" className="demo-hero" data-capture="home">
        <div className="demo-hero-copy">
          <p className="demo-kicker">{d.kicker}</p>
          <h1>{d.headline}</h1>
          <p>{d.intro}</p>
          <div className="demo-actions">
            <a className="demo-primary" href="#collection">
              {d.action}
              <ArrowRight size={17} />
            </a>
            <a className="demo-secondary" href="#detail">
              {d.secondary}
              <ArrowDown size={14} />
            </a>
          </div>
          <span className="demo-edition">{ui.smallTitle}</span>
        </div>
        <div className="demo-hero-art">
          {slug === "restaurant" ? (
            <Dish />
          ) : slug === "real-estate" ? (
            <Architecture />
          ) : slug === "saas" ? (
            <Dashboard />
          ) : (
            <Garment variant={0} />
          )}
          <span className="demo-art-caption">
            {slug === "restaurant"
              ? ui.restaurantCaption
              : slug === "real-estate"
                ? ui.realEstateCaption
                : slug === "store"
                  ? ui.storeCaption
                  : ui.sample}
          </span>
        </div>
      </section>
      <section id="collection" className="demo-collection" data-capture="inner">
        <div className="demo-section-heading">
          <div>
            <p className="demo-kicker">
              {slug === "restaurant" ? ui.restaurantLabel : ui.collection}
            </p>
            <h2>{d.inner}</h2>
          </div>
          <p>{d.description}</p>
        </div>
        {slug === "real-estate" && (
          <div
            className="demo-filters"
            role="group"
            aria-label={ui.filterLabel}
          >
            {ui.locations.map((location) => (
              <button
                key={location}
                aria-pressed={filter === location}
                onClick={() => setFilter(location)}
              >
                {location}
              </button>
            ))}
          </div>
        )}
        <div className="demo-item-grid">
          {d.items
            .filter(
              (item) =>
                slug !== "real-estate" ||
                filter === "All homes" ||
                item.detail.startsWith(filter),
            )
            .map((item, i) => (
              <article className="demo-item" key={item.name}>
                {slug === "restaurant" ? (
                  <div className={`demo-item-art dish-art dish-${i}`}>
                    <Dish small />
                  </div>
                ) : slug === "real-estate" ? (
                  <div className={`demo-item-art building-${i}`}>
                    <Architecture />
                  </div>
                ) : slug === "store" ? (
                  <div className="demo-item-art">
                    <Garment variant={i} />
                  </div>
                ) : (
                  <div className="saas-feature-icon">
                    {i === 0 ? (
                      <span className="mini-board">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : i === 1 ? (
                      <span className="mini-notes">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      <span className="mini-bars">
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                  </div>
                )}
                <div className="demo-item-label">
                  <h3>{item.name}</h3>
                  <span>{item.price}</span>
                </div>
                <p>{item.detail}</p>
                <a href="#detail" aria-label={`${ui.details}: ${item.name}`}>
                  {ui.details}
                  <ArrowRight size={15} />
                </a>
              </article>
            ))}
        </div>
      </section>
      <section id="detail" className="demo-detail" data-capture="feature">
        <div className="demo-detail-art">
          {slug === "restaurant" ? (
            <Dish />
          ) : slug === "real-estate" ? (
            <Architecture />
          ) : slug === "store" ? (
            <Garment variant={0} />
          ) : (
            <Dashboard />
          )}
        </div>
        <div className="demo-detail-copy">
          <p className="demo-kicker">{ui.feature}</p>
          <h2>{d.feature}</h2>
          <p>{d.featureText}</p>
          {slug === "real-estate" && (
            <p className="demo-dimensions">{ui.dimensions}</p>
          )}
          {slug === "store" && (
            <>
              <p className="demo-product-price">{d.items[0].price}</p>
              <button
                className="demo-primary"
                onClick={() => {
                  setBag((value) => value + 1);
                  setAdded(true);
                }}
              >
                {added ? <Check size={17} /> : <Plus size={17} />}
                {added ? ui.added : ui.add}
              </button>
              <details>
                <summary>{ui.itemDetails}</summary>
                <p>{ui.itemCare}</p>
              </details>
            </>
          )}
          {slug === "restaurant" && (
            <a className="demo-primary" href="#collection">
              {d.action}
              <ArrowRight size={16} />
            </a>
          )}
          {slug === "saas" && (
            <>
              <div
                className="demo-billing"
                role="group"
                aria-label={ui.billingLabel}
              >
                <button aria-pressed={!yearly} onClick={() => setYearly(false)}>
                  {ui.monthly}
                </button>
                <button aria-pressed={yearly} onClick={() => setYearly(true)}>
                  {ui.yearly}
                </button>
              </div>
              <div className="demo-plans">
                {ui.plans.map((plan) => (
                  <article key={plan.name}>
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                    <strong>
                      $
                      {yearly
                        ? Math.round(Number(plan.price) * 0.8)
                        : plan.price}
                    </strong>
                    <span>{ui.currency}</span>
                    <button onClick={() => setNotice(ui.planNote)}>
                      {ui.planAction}
                      <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
              <p className="demo-notice" role="status">
                {notice}
              </p>
            </>
          )}
        </div>
      </section>
      <footer className="demo-footer">
        <a href="#demo-top" className="demo-wordmark">
          {d.name}
        </a>
        <p>{d.note}</p>
        <Link href="/#work">
          {ui.back}
          <ArrowRight size={15} />
        </Link>
      </footer>
    </main>
  );
}
function Dish({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`dish-illustration${small ? " small" : ""}`}
      aria-hidden="true"
    >
      <div className="dish-linen" />
      <div className="dish-plate">
        <div className="dish-sauce" />
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className={`dish-leaf leaf-${i}`} />
        ))}
        <b className="dish-cheese" />
        <span className="dish-seasoning" />
      </div>
      <div className="dish-cutlery" />
      <div className="dish-herb" />
    </div>
  );
}
function Architecture() {
  return (
    <svg
      className="architecture-art"
      viewBox="0 0 900 700"
      role="img"
      aria-label={ui.architectureAlt}
    >
      <defs>
        <linearGradient id="arch-sky" x2="0" y2="1">
          <stop stopColor="#acbdc0" />
          <stop offset="1" stopColor="#e6dfc8" />
        </linearGradient>
        <linearGradient id="arch-glass" x2="1" y2="1">
          <stop stopColor="#52645c" />
          <stop offset=".5" stopColor="#82968b" />
          <stop offset="1" stopColor="#2c403c" />
        </linearGradient>
        <linearGradient id="arch-floor">
          <stop stopColor="#d4c5a9" />
          <stop offset="1" stopColor="#ece2cb" />
        </linearGradient>
      </defs>
      <path fill="url(#arch-sky)" d="M0 0h900v700H0z" />
      <circle cx="720" cy="150" r="82" fill="#fff0d2" opacity=".7" />
      <path d="M0 440 250 365 900 420v280H0" fill="#b6b29c" />
      <path fill="url(#arch-floor)" d="m0 510 700-80 200 85v185H0" />
      <path d="M130 270h630v260H130z" fill="#d9d0b7" />
      <path d="m130 270 120-75h630l-120 75" fill="#e9dfc6" />
      <path d="m760 270 120-75v250l-120 85" fill="#bdb69f" />
      <path d="M175 310h540v175H175z" fill="url(#arch-glass)" />
      <path
        d="M260 310v175m110-175v175m110-175v175m110-175v175"
        stroke="#d8cdb2"
        strokeWidth="9"
      />
      <path d="M115 492h660v30H115z" fill="#f0e3c8" />
      <path d="m60 610 500-40 225 62-520 55" fill="#749c9a" />
      <path d="m80 613 480-32 190 49-490 42" fill="#a5c6bf" />
      <path
        d="M48 260q80-90 120-225M65 235q-5-95-50-145M80 210q95-45 185-17M105 160q-60-110-110-120"
        stroke="#68775d"
        strokeWidth="22"
        fill="none"
      />
      <path d="M50 490 76 190" stroke="#7e7255" strokeWidth="13" />
      <path d="m790 560 35-135 40 135" fill="#667a56" />
      <ellipse cx="815" cy="565" rx="75" ry="16" fill="#6f785a" opacity=".4" />
      <path d="m0 700 900-80v80" fill="#948d74" opacity=".2" />
    </svg>
  );
}
function Dashboard() {
  return (
    <div className="orbit-dashboard" aria-label={ui.workspaceAlt}>
      <aside>
        <strong>◉ {demos.saas.name}</strong>
        <span>⌘ &nbsp; Workspace</span>
        <span>▦ &nbsp; Projects</span>
        <span>◷ &nbsp; Activity</span>
        <span>◎ &nbsp; Team</span>
        <div className="orbit-avatar">{ui.sampleInitials}</div>
      </aside>
      <div className="orbit-main">
        <div className="orbit-toolbar">
          <span>{ui.sample}</span>
          <i>•••</i>
        </div>
        <p className="orbit-project-title">{ui.project}</p>
        <p>{ui.activity}</p>
        <div className="orbit-stats">
          <div>
            <small>{ui.progress}</small>
            <strong>
              72<span>%</span>
            </strong>
            <i />
          </div>
          <div>
            <div className="orbit-chart">
              {[30, 48, 40, 65, 55, 81, 92].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="orbit-board">
          {ui.tasks.map((task, i) => (
            <div key={task}>
              <small>{ui.board[i]}</small>
              <article>
                <i />
                <strong>{task}</strong>
                <span>{ui.taskContext}</span>
                <b>{i === 2 ? "✓" : ui.sampleInitials}</b>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Garment({ variant }: { variant: number }) {
  return (
    <svg
      className={`garment-art garment-${variant}`}
      viewBox="0 0 500 650"
      role="img"
      aria-label={ui.garmentAlts[variant] || ui.garmentAlts[0]}
    >
      <defs>
        <linearGradient id={`fabric-${variant}`}>
          <stop
            stopColor={
              variant === 0 ? "#a47c5d" : variant === 1 ? "#cec8ba" : "#303432"
            }
          />
          <stop
            offset=".45"
            stopColor={
              variant === 0 ? "#d0aa86" : variant === 1 ? "#f3ede0" : "#666961"
            }
          />
          <stop
            offset="1"
            stopColor={
              variant === 0 ? "#916b50" : variant === 1 ? "#b7b1a4" : "#282c2b"
            }
          />
        </linearGradient>
      </defs>
      <ellipse
        cx="250"
        cy="603"
        rx="160"
        ry="19"
        fill="#473b2d"
        opacity=".12"
      />
      {variant < 2 ? (
        <>
          <path
            d="m185 110 65-20 65 20 86 52 50 218-60 18-41-143 12 325H140l10-325-41 143-60-18 50-218z"
            fill={`url(#fabric-${variant})`}
          />
          <path
            d="m185 110 65 142 65-142-30 110 35 34-68 95-68-95 35-34z"
            fill={variant === 0 ? "#b48b68" : "#e0d8ca"}
          />
          <path
            d="M250 250v330"
            stroke={variant === 0 ? "#8a654c" : "#b0a999"}
            strokeWidth="2"
          />
          <path d="m160 393 60 5m65 0 55-5" stroke="#715d4b" strokeWidth="3" />
          {[320, 370, 420].map((y) => (
            <circle key={y} cx="265" cy={y} r="4" fill="#5b4739" />
          ))}
          <path
            d="m150 255 20 130m180-130-20 130"
            stroke="#fff"
            strokeOpacity=".1"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path
            d="M150 100h200l13 120-43 370h-81l11-330-11 330h-80l-22-370z"
            fill={`url(#fabric-${variant})`}
          />
          <path
            d="M155 125h190m-95 0v135m-58-80-18 360m138-360-15 360"
            stroke="#e6e0cf"
            strokeOpacity=".22"
            strokeWidth="2"
          />
          <path
            d="m155 150 47 0-38 65m181-65h-47l44 65"
            fill="none"
            stroke="#242927"
            strokeWidth="2"
          />
        </>
      )}
      <path
        d="M190 106q60-35 120 0"
        fill="none"
        stroke="#644e3b"
        strokeWidth="3"
        opacity=".3"
      />
    </svg>
  );
}
``````

## components/experience.tsx

``````tsx
import {
  ArrowDownRight,
  Blocks,
  Braces,
  Database,
  ShieldCheck,
} from "lucide-react";
import { experience as copy } from "@/data/experience";
import { Reveal } from "./reveal";

const fundamentalsIcons = {
  frontend: Blocks,
  backend: Braces,
  database: Database,
  deployment: ShieldCheck,
};

export function Experience() {
  return (
    <section
      id="experience"
      className="container experience-section"
      aria-labelledby="experience-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="experience-intro">
          <div>
            <h2 id="experience-title">{copy.title}</h2>
            <p className="experience-lead">{copy.lead}</p>
          </div>
          <div className="about-story">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="process-grid">
        {copy.process.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.04}>
            <article className="process-card glass">
              <span>0{index + 1}</span>
              <ArrowDownRight size={17} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <aside className="experience-facts">
          <div>
            <p className="eyebrow">{copy.factsLabel}</p>
            <p>{copy.factsNote}</p>
          </div>
          <dl>
            {copy.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Reveal>
      <div className="fundamentals-section">
        <Reveal>
          <p className="eyebrow">{copy.fundamentals.eyebrow}</p>
          <h2 id="fundamentals-title">{copy.fundamentals.title}</h2>
          <p className="section-intro">{copy.fundamentals.description}</p>
        </Reveal>
        <div className="fundamentals-grid">
          {copy.fundamentals.blocks.map((block, index) => {
            const Icon = fundamentalsIcons[block.id];
            return (
              <Reveal key={block.id} delay={index * 0.04}>
                <article className="fundamental-card">
                  <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                  <h3>{block.title}</h3>
                  {block.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="fundamentals-closing">{copy.fundamentals.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
``````

## components/footer.tsx

``````tsx
import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";
import { BrandMark } from "./brand-mark";

export function Footer({ brand }: { brand: string }) {
  return (
    <footer className="container footer">
      <a href="#top" className="wordmark" aria-label={`${brand} — Home`}>
        <BrandMark brand={brand} />
      </a>
      <p>
        © {new Date().getFullYear()} {brand}
      </p>
      <p>{site.footer}</p>
      <BackToTop />
    </footer>
  );
}
``````

## components/hero.tsx

``````tsx
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Code2 } from "lucide-react";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div>
          <p className="eyebrow">
            <span className="tiny-line" />
            {site.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            {site.hero.heading[0]}
            <br />
            <span className="gold-text">{site.hero.heading[1]}</span>
            <br />
            {site.hero.heading[2]}
          </h1>
        </div>
        <div>
          <p className="hero-intro">{site.hero.intro}</p>
          <p className="hero-tagline">{site.hero.tagline}</p>
          <div className="hero-actions">
            <a href="#work" className="button button-gold">
              {site.hero.primary}
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a href="#contact" className="button button-outline">
              {site.hero.secondary}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-note">{site.hero.note}</p>
        </div>
      </div>
      <div className="hero-visual">
        <div className="portrait-orbit" aria-hidden="true" />
        <figure className="portrait-card">
          <div className="portrait-topline">
            <span>{site.brand.toUpperCase()} / 01</span>
            <span className="status-dot" />
          </div>
          <div className="portrait-image">
            <Image
              src={site.hero.portrait}
              alt={site.hero.portraitAlt}
              fill
              sizes="(max-width: 700px) 85vw, 390px"
              priority
            />
            <span className="portrait-placeholder">
              {site.hero.portraitStatus}
            </span>
          </div>
          <figcaption>
            <span className="eyebrow">{site.hero.portraitLabel}</span>
            <strong>{site.name}</strong>
            <p>{site.hero.portraitCaption}</p>
          </figcaption>
        </figure>
        <div className="floating-note glass">
          <Code2 size={23} aria-hidden="true" />
          <span>{site.hero.floatingLabel}</span>
        </div>
        <span className="visual-coordinates" aria-hidden="true">
          CREATIVE × TECHNICAL
        </span>
      </div>
      <div className="hero-bottom">
        <div className="expertise-list">
          {site.expertise.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <a href="#work" className="scroll-link" aria-label={site.hero.primary}>
          <span aria-hidden="true">SCROLL TO EXPLORE</span>
          <ArrowDownRight size={18} />
        </a>
      </div>
    </section>
  );
}
``````

## components/motion-provider.tsx

``````tsx
"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
``````

## components/navbar.tsx

``````tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { site } from "@/data/site";
import { BrandMark } from "./brand-mark";

export function Navbar({ identity }: { identity: { brand: string } }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
    const media = window.matchMedia("(min-width: 1024px)");
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (
        !menu.current?.contains(event.target as Node) &&
        !menuButton.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Storage can be unavailable. */
    }
  }

  return (
    <header className="site-header">
      <nav className="container nav-row" aria-label="Main navigation">
        <a
          href="#top"
          className="wordmark"
          aria-label={`${identity.brand} — Home`}
          onClick={() => setOpen(false)}
        >
          <BrandMark brand={identity.brand} />
        </a>
        <div className="desktop-nav">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? site.ui.light : site.ui.dark}
          >
            <Sun size={19} className="sun-icon" aria-hidden="true" />
            <Moon size={19} className="moon-icon" aria-hidden="true" />
          </button>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label={open ? site.ui.menuClose : site.ui.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div
          id="mobile-navigation"
          className="mobile-nav"
          ref={menu}
          hidden={!open}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node) &&
              event.relatedTarget !== menuButton.current
            )
              setOpen(false);
          }}
        >
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
``````

## components/project-card.tsx

``````tsx
"use client";
import Image from "next/image";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
export function ProjectCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: ProjectView;
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 110, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 110, damping: 22 });
  useEffect(() => {
    const media = matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const tilt = finePointer && !reduced;
  const mobile = project.screenshots[2] || project.screenshots[0];
  return (
    <button
      className="project-card device-project"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${site.work.view}: ${project.title}`}
      onPointerMove={(event) => {
        if (!tilt) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(
          (-(event.clientY - rect.top - rect.height / 2) / rect.height) * 10,
        );
        y.set(((event.clientX - rect.left - rect.width / 2) / rect.width) * 12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div
        className="device-stage"
        style={{ "--project-accent": project.accent } as React.CSSProperties}
      >
        <span className="device-project-number" aria-hidden="true">
          0{index + 1}
        </span>
        <div className="device-floor" />
        <div className="device-float">
          <m.div
            className="device-composition"
            style={tilt ? { rotateX, rotateY } : undefined}
          >
            <div className="device-laptop">
              <div className="device-laptop-lid">
                <span className="device-camera" />
                <div className="device-screen">
                  <Image
                    src={project.screenshots[0].src}
                    alt={project.screenshots[0].alt}
                    fill
                    sizes="(max-width:700px) 80vw, 480px"
                  />
                  <span className="device-reflection" />
                </div>
              </div>
              <div className="device-laptop-base">
                <i />
              </div>
            </div>
            <div className="device-phone">
              <div className="device-phone-screen">
                <Image
                  src={mobile.src}
                  alt={mobile.alt}
                  fill
                  sizes="(max-width:700px) 23vw, 145px"
                />
                <span className="device-reflection" />
              </div>
              <span className="device-phone-notch" />
            </div>
          </m.div>
        </div>
        <span className="device-view">
          {site.work.view}
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="project-info">
        <div>
          <span className="project-industry">{project.industry}</span>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
        <ArrowUpRight className="project-arrow" size={23} aria-hidden="true" />
      </div>
      <div className="project-footer">
        <span>
          <i style={{ background: project.accent }} />
          {site.work.concept}
        </span>
        <span>
          0{index + 1} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}
``````

## components/project-gallery.tsx

``````tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, X } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";

export default function ProjectGallery({
  project,
  onClose,
}: {
  project: ProjectView;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const touch = useRef({ x: 0, y: 0 });
  const count = project.screenshots.length;
  const image = project.screenshots[index];

  const go = useCallback(
    (next: number) => {
      const normalized = (next + count) % count;
      if (normalized === index) return;
      setLoaded(false);
      setFailed(false);
      setIndex(normalized);
    },
    [count, index],
  );

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    thumbnails.current[index]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "instant",
    });
  }, [index]);

  return (
    <dialog
      ref={dialog}
      className="gallery"
      aria-labelledby="gallery-title"
      aria-describedby="gallery-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const buttons = dialog.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled]),a[href]",
          );
          if (!buttons?.length) return;
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          return;
        }
        if (event.altKey || event.metaKey || event.ctrlKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          go(index + (event.key === "ArrowLeft" ? -1 : 1));
        }
      }}
    >
      <div className="gallery-shell">
        <header className="gallery-header">
          <div>
            <p className="eyebrow">
              {site.work.concept} · {project.industry}
            </p>
            <h2 id="gallery-title">{project.title}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={site.ui.close}
            autoFocus
          >
            <X size={24} />
          </button>
        </header>
        <div
          className="gallery-media"
          onTouchStart={(event) => {
            touch.current = {
              x: event.changedTouches[0].clientX,
              y: event.changedTouches[0].clientY,
            };
          }}
          onTouchEnd={(event) => {
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
              go(index + (dx < 0 ? 1 : -1));
          }}
        >
          {!loaded && !failed && (
            <span className="image-loader" role="status">
              <LoaderCircle className="spin" size={24} />
              <span className="sr-only">{site.ui.loadingImage}</span>
            </span>
          )}
          {failed ? (
            <p className="gallery-error" role="status">
              {site.ui.imageError}
            </p>
          ) : (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 700px) 100vw, 1200px"
              className={loaded ? "loaded" : ""}
              priority
              onLoad={() => setLoaded(true)}
              onError={() => {
                setFailed(true);
                setLoaded(true);
              }}
            />
          )}
          <button
            className="gallery-arrow gallery-prev"
            onClick={() => go(index - 1)}
            aria-label={site.ui.previous}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="gallery-arrow gallery-next"
            onClick={() => go(index + 1)}
            aria-label={site.ui.next}
          >
            <ChevronRight size={24} />
          </button>
          <span className="gallery-counter" aria-hidden="true">
            {index + 1} / {count}
          </span>
        </div>
        <p
          className="gallery-announcement"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {image.title} — {site.ui.screenshot} {index + 1} {site.ui.of} {count}
        </p>
        <div
          className="gallery-thumbnails"
          role="group"
          aria-label={site.work.gallery}
        >
          {project.screenshots.map((screenshot, i) => (
            <button
              key={screenshot.src}
              ref={(node) => {
                thumbnails.current[i] = node;
              }}
              className={i === index ? "active" : ""}
              aria-label={`${site.ui.show} ${screenshot.title}`}
              aria-pressed={i === index}
              onClick={() => go(i)}
            >
              <Image src={screenshot.src} alt="" fill sizes="100px" />
              <span>{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="gallery-details">
          <div>
            <p id="gallery-description">{project.description}</p>
            {project.demoUrl && (
              <Link className="gallery-demo-link" href={project.demoUrl}>
                {site.ui.demo} ↗
              </Link>
            )}
          </div>
          <div>
            <span className="eyebrow">{site.ui.stack}</span>
            <ul>
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="gallery-highlights">
          <span className="eyebrow">{site.ui.highlights}</span>
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <p className="gallery-help">{site.ui.galleryHelp}</p>
      </div>
    </dialog>
  );
}
``````

## components/reveal.tsx

``````tsx
"use client";

import { m, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 1, y: 0 }}
      whileInView={reduced ? undefined : { y: [18, 0], opacity: [0.45, 1] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
``````

## components/skills.tsx

``````tsx
import { skillContent as copy, type Skill } from "@/data/skills";
import { Reveal } from "./reveal";

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section
      id="skills"
      className="container skills-section"
      aria-labelledby="skills-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="section-heading">
          <h2 id="skills-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
      </Reveal>
      <div className="skills-grid">
        {copy.categories.map((category, index) => (
          <Reveal key={category} delay={index * 0.04}>
            <article className="skill-group glass">
              <span className="skill-number">0{index + 1}</span>
              <h3>{category}</h3>
              <ul>
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <li
                      key={skill.id}
                      className={
                        skill.name.includes("[PLACEHOLDER]")
                          ? "skill-placeholder"
                          : ""
                      }
                    >
                      {skill.name}
                    </li>
                  ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="skills-note">{copy.note}</p>
    </section>
  );
}
``````

## components/turnstile.tsx

``````tsx
"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
type TurnstileAPI = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}
export function Turnstile({
  onToken,
  resetKey,
}: {
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!ready || !key || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    const id = api.render(container.current, {
      sitekey: key,
      action: "contact",
      theme:
        document.documentElement.dataset.theme === "light" ? "light" : "dark",
      size: "flexible",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => {
      api.remove(id);
    };
  }, [ready, key, onToken, resetKey]);
  if (!key) return null;
  return (
    <div className="contact-security">
      <Script
        id="turnstile-script"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={container} />
    </div>
  );
}
``````

## components/work.tsx

``````tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Bot, Code2 } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";

import type { Bot as BotData } from "@/data/bots";

const BotServices = dynamic(
  () => import("./bot-services").then((module) => module.BotServices),
  {
    ssr: false,
    loading: () => (
      <div id="ai-bots" className="bot-loading" role="status">
        {site.ui.loading}
      </div>
    ),
  },
);

const Gallery = dynamic(() => import("./project-gallery"), { ssr: false });

export function Work({
  projects,
  bots,
}: {
  projects: ProjectView[];
  bots: BotData[];
}) {
  const [tab, setTab] = useState(0);
  const [botsVisited, setBotsVisited] = useState(false);
  const [project, setProject] = useState<ProjectView | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const sync = () => {
      if (["#ai-bots", "#embed-methods"].includes(window.location.hash)) {
        setTab(1);
        setBotsVisited(true);
      } else if (window.location.hash === "#work") setTab(0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (
      tab !== 1 ||
      !["#ai-bots", "#embed-methods"].includes(window.location.hash)
    )
      return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [tab]);
  function selectTab(next: number) {
    setTab(next);
    if (next === 1) setBotsVisited(true);
    if (
      next === 0 &&
      ["#ai-bots", "#embed-methods"].includes(window.location.hash)
    )
      window.history.replaceState(null, "", "#work");
  }

  return (
    <section
      id="work"
      className="container work-section"
      aria-labelledby="work-title"
    >
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{site.work.eyebrow}</p>
            <h2 id="work-title">{site.work.title}</h2>
          </div>
          <p>{site.work.description}</p>
        </div>
        <div
          className="service-tabs"
          role="tablist"
          aria-label="Portfolio categories"
        >
          {site.work.tabs.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              id={`tab-${item.id}`}
              role="tab"
              aria-selected={tab === index}
              aria-controls={`panel-${item.id}`}
              tabIndex={tab === index ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => {
                if (
                  !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - tab;
                selectTab(next);
                tabs.current[next]?.focus();
              }}
            >
              <span className="tab-icon">
                {index === 0 ? <Code2 size={21} /> : <Bot size={21} />}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
              <span className="tab-count">04</span>
            </button>
          ))}
        </div>
      </Reveal>
      <div
        role="tabpanel"
        id="panel-web"
        aria-labelledby="tab-web"
        hidden={tab !== 0}
        tabIndex={0}
      >
        <div className="projects-grid">
          {projects.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.06}>
              <ProjectCard
                project={item}
                index={index}
                total={projects.length}
                onOpen={() => setProject(item)}
              />
            </Reveal>
          ))}
        </div>
        <p className="work-disclaimer">
          {site.work.disclaimer}
          <br />
          <span>{site.work.screenshotNote}</span>
        </p>
      </div>
      <div
        role="tabpanel"
        id="panel-bots"
        aria-labelledby="tab-bots"
        hidden={tab !== 1}
        tabIndex={0}
      >
        {botsVisited && <BotServices bots={bots} />}
      </div>
      {project && (
        <Gallery project={project} onClose={() => setProject(null)} />
      )}
    </section>
  );
}
``````

