## components/AiBotVideo.tsx

``````tsx
"use client";
import { VisibilityVideo } from "./VisibilityVideo";

export function AiBotVideo() {
  return (
    <VisibilityVideo
      name="ai-bot"
      caption="A customer asks. The bot answers. Instantly."
    />
  );
}
``````

## components/VisibilityVideo.tsx

``````tsx
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMotionPreference } from "./motion-preference";

/** A background showcase, controlled by the site's single Motion switch. */
export function VisibilityVideo({
  name,
  caption,
}: {
  name: "work-showcase" | "ai-bot";
  caption: string;
}) {
  const { reduced } = useMotionPreference();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const poster = `/videos/${name}-poster.webp`;

  useEffect(() => {
    const media = video.current;
    const container = frame.current;
    if (reduced || !media || !container) return;
    let visible = false;
    // Set both properties before play(): some mobile browsers check defaultMuted.
    media.muted = true;
    media.defaultMuted = true;
    const resume = () => {
      if (
        !visible ||
        document.hidden ||
        document.documentElement.dataset.motion === "reduced"
      ) {
        media.autoplay = false;
        media.pause();
        return;
      }
      media.autoplay = true;
      if (media.paused)
        void media.play().catch(() => {
          // A browser-level autoplay restriction is retried on the next real interaction.
        });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        resume();
      },
      { threshold: 0, rootMargin: "100px 0px" },
    );
    observer.observe(container);
    media.addEventListener("canplay", resume);
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("pointerdown", resume, { passive: true });
    document.addEventListener("keydown", resume);
    return () => {
      observer.disconnect();
      media.pause();
      media.removeEventListener("canplay", resume);
      document.removeEventListener("visibilitychange", resume);
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
  }, [reduced]);

  return (
    <figure className="showcase-video" data-showcase-video={name}>
      <div ref={frame} className="showcase-video-frame">
        {reduced ? (
          <Image
            src={poster}
            alt={caption}
            fill
            loading="eager"
            sizes="100vw"
          />
        ) : (
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            aria-label={caption}
            disablePictureInPicture
          >
            <source
              src={`/videos/${name}-mobile.webm`}
              type="video/webm"
              media="(max-width: 767px)"
            />
            <source
              src={`/videos/${name}-mobile.mp4`}
              type="video/mp4"
              media="(max-width: 767px)"
            />
            <source src={`/videos/${name}.webm`} type="video/webm" />
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
``````

## components/WorkShowcaseVideo.tsx

``````tsx
"use client";
import { VisibilityVideo } from "./VisibilityVideo";

export function WorkShowcaseVideo() {
  return (
    <VisibilityVideo
      name="work-showcase"
      caption="A look at the concept websites, in motion."
    />
  );
}
``````

## components/admin-app.tsx

``````tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { site } from "@/data/site";
import { adminLoginError, submitAdminLogin } from "@/lib/admin/login-client";
import { useModal } from "@/hooks/use-modal";
type RecordData = Record<string, unknown>;
async function api(
  resource: string,
  method = "GET",
  body?: unknown,
  signal?: AbortSignal,
) {
  const response = await fetch(`/api/admin/${resource}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(typeof data.error === "string" ? data.error : copy.error);
  return data;
}
export function AdminApp({
  section,
  loginReady = true,
}: {
  section: string;
  loginReady?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [deleting, setDeleting] = useState<RecordData | null>(null);
  const [lead, setLead] = useState<RecordData | null>(null);
  const paginated = ["inbox", "chatlogs", "audit"].includes(section);
  const loading = useRef<AbortController | null>(null);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [dashboard, setDashboard] = useState<RecordData>({});
  const [editor, setEditor] = useState<RecordData | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    loading.current?.abort();
    const controller = new AbortController();
    loading.current = controller;
    setBusy(true);
    setError("");
    try {
      const suffix = paginated
        ? `?${new URLSearchParams({ page: String(page), q: query, status: filter, sort })}`
        : "";
      const data = await api(
        (section === "security" ? "dashboard" : section) + suffix,
        "GET",
        undefined,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      if (section === "dashboard" || section === "security") setDashboard(data);
      else if (section === "settings")
        setEditor(data || adminDefaults.settings);
      else if (paginated) {
        setRecords(data.items);
        setPages(data.pages);
        setTotal(data.total);
        if (page > data.pages) setPage(data.pages);
      } else setRecords(data);
    } catch (error) {
      if (!controller.signal.aborted)
        setError(error instanceof Error ? error.message : copy.error);
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }, [section, paginated, page, query, filter, sort]);
  useEffect(() => {
    if (section !== "login") void load();
    return () => loading.current?.abort();
  }, [section, load]);
  if (section === "login") return <AdminLogin ready={loginReady} />;
  async function mutate(method: string, body: unknown) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api(section, method, body);
      setEditor(null);
      setLead(null);
      setDeleting(null);
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
            <p className="admin-note">
              {dashboard.contentSource === "database"
                ? "Published CMS content appears on the website."
                : "The public website uses repository content. Set CONTENT_SOURCE=database after populating the CMS to publish these records."}
            </p>
            <div className="admin-stats">
              {Object.entries(dashboard)
                .filter(([, value]) => typeof value === "number")
                .map(([key, value]) => (
                  <article className="glass" key={key}>
                    <span>
                      {{
                        projects: "Projects",
                        bots: "Bots",
                        messages: "Inquiries",
                        unread: "Unread",
                        newInquiries: "New inquiries",
                      }[key] || key}
                    </span>
                    <strong>{String(value)}</strong>
                  </article>
                ))}
            </div>
            <h2>Recent inquiries</h2>
            {!busy &&
              Array.isArray(dashboard.recent) &&
              dashboard.recent.length === 0 && (
                <p className="admin-note">No inquiries yet.</p>
              )}
            <div className="admin-records">
              {(Array.isArray(dashboard.recent)
                ? (dashboard.recent as RecordData[])
                : []
              ).map((row) => (
                <Link
                  className="admin-record glass"
                  key={String(row.id)}
                  href="/admin/inbox"
                >
                  <strong>{String(row.name)}</strong>
                  <span>{String(row.status)}</span>
                </Link>
              ))}
            </div>
          </>
        )}
        {paginated && (
          <form
            className="admin-filters"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(search);
            }}
          >
            <label className="sr-only" htmlFor="admin-search">
              Search records
            </label>
            <input
              id="admin-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records"
              maxLength={200}
            />
            <button className="button button-outline" disabled={busy}>
              Search
            </button>
            <label className="sr-only" htmlFor="admin-sort">
              Sort records
            </label>
            <select
              id="admin-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            {section === "inbox" && (
              <>
                <label className="sr-only" htmlFor="admin-status">
                  Filter status
                </label>
                <select
                  id="admin-status"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All statuses</option>
                  {["new", "contacted", "in-progress", "closed"].map(
                    (value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ),
                  )}
                </select>
              </>
            )}
          </form>
        )}
        {lead && (
          <LeadEditor
            key={String(lead.id)}
            initial={lead}
            busy={busy}
            save={(data) => mutate("PATCH", data)}
            close={() => setLead(null)}
          />
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
              {[
                "projects",
                "bots",
                "skills",
                "certificates",
                "services",
                "faqs",
                "testimonials",
              ].includes(section) && (
                <p className="admin-note">{copy.reorderHelp}</p>
              )}
              {section === "chatlogs" && (
                <p className="admin-note">{copy.retention}</p>
              )}
              {!busy && !records.length && <p>{copy.empty}</p>}
              {records.map((record, index) => (
                <article className="admin-record glass" key={String(record.id)}>
                  <div>
                    <h2>
                      {String(
                        record.question ||
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
                    {section === "inbox" && (
                      <p>
                        Status: {String(record.status)}
                        {record.company ? ` · ${record.company}` : ""}
                        {record.service ? ` · ${record.service}` : ""}
                      </p>
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
                          aria-label={`${copy.up}: ${String(record.question || record.title || record.name)}`}
                          onClick={() => move(index, -1)}
                        >
                          <ArrowUp size={17} />
                        </button>
                        <button
                          className="icon-button"
                          disabled={busy || index === records.length - 1}
                          aria-label={`${copy.down}: ${String(record.question || record.title || record.name)}`}
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
                        onClick={() => setLead(record)}
                      >
                        Manage inquiry
                      </button>
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
                        aria-label={`${copy.remove}: ${String(record.question || record.title || record.name || record.id)}`}
                        onClick={() => {
                          setDeleting(record);
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
        {paginated && (
          <div className="admin-pagination">
            <button
              className="button button-outline"
              disabled={busy || page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <span>
              {total} records · Page {page} of {pages}
            </span>
            <button
              className="button button-outline"
              disabled={busy || page >= pages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        )}
        {deleting && (
          <DeleteDialog
            error={error}
            busy={busy}
            close={() => setDeleting(null)}
            confirm={() => mutate("DELETE", { id: deleting.id })}
          />
        )}
      </main>
    </div>
  );
}
function AdminLogin({ ready }: { ready: boolean }) {
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const alert = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (code) setError(adminLoginError(code));
  }, []);
  useEffect(() => {
    if (error) alert.current?.focus();
  }, [error]);
  return (
    <main id="main-content" className="admin-login">
      <form
        className="glass"
        aria-busy={busy}
        onSubmit={async (event) => {
          event.preventDefault();
          if (locked.current || !ready) return;
          locked.current = true;
          const form = new FormData(event.currentTarget);
          setBusy(true);
          setError("");
          try {
            await submitAdminLogin({
              email: String(form.get("email") || ""),
              password: String(form.get("password") || ""),
              code: String(form.get("code") || ""),
            });
            window.location.assign("/admin");
          } catch (failure) {
            const safe = [
              copy.loginError,
              copy.loginUnavailable,
              copy.loginLimited,
              copy.loginSessionError,
            ] as readonly string[];
            setError(
              failure instanceof Error && safe.includes(failure.message)
                ? failure.message
                : copy.loginUnavailable,
            );
          } finally {
            locked.current = false;
            setBusy(false);
          }
        }}
      >
        <Link className="wordmark" href="/">
          Elvora<span>.</span>
        </Link>
        <h1>{copy.loginTitle}</h1>
        <p>{copy.loginDescription}</p>
        {!ready && (
          <div className="admin-setup-notice" role="status">
            <h2>{copy.setupTitle}</h2>
            <p>{copy.setupDescription}</p>
            <button
              type="button"
              className="button button-outline"
              onClick={() => window.location.reload()}
            >
              {copy.checkSetup}
            </button>
          </div>
        )}
        <label htmlFor="admin-email">{copy.email}</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          maxLength={254}
          defaultValue={site.email}
          disabled={busy}
        />
        <label htmlFor="admin-password">{copy.password}</label>
        <div className="admin-password-field">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            aria-describedby="admin-password-help"
            maxLength={128}
            disabled={busy}
          />
          <button
            type="button"
            className="admin-password-toggle"
            aria-controls="admin-password"
            onClick={() => setShowPassword((visible) => !visible)}
            disabled={busy}
          >
            {showPassword ? copy.hidePassword : copy.showPassword}
          </button>
        </div>
        <p id="admin-password-help" className="admin-login-help">
          {copy.passwordHelp}
        </p>
        <details className="admin-authenticator">
          <summary>{copy.codeToggle}</summary>
          <p id="admin-code-help" className="admin-login-help">
            {copy.codeHelp}
          </p>
          <label htmlFor="admin-code">{copy.code}</label>
          <input
            id="admin-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-describedby="admin-code-help"
            pattern="[0-9]{6}"
            maxLength={6}
            disabled={busy}
          />
        </details>
        {error && (
          <p ref={alert} tabIndex={-1} role="alert" className="field-error">
            {error}
          </p>
        )}
        <button className="button button-gold" disabled={busy || !ready}>
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
        field.type === "lines"
          ? Array.isArray(initial[field.key])
            ? (initial[field.key] as string[]).join("\n")
            : ""
          : field.type === "json"
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
              field.type === "lines"
                ? String(values[field.key])
                    .split("\n")
                    .map((value) => value.trim())
                    .filter(Boolean)
                : field.type === "json"
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
            {field.type === "lines"
              ? `${field.key[0].toUpperCase()}${field.key.slice(1)} (one per line)`
              : copy.fields[field.key as keyof typeof copy.fields] || field.key}
          </label>
          {field.type === "boolean" ? (
            <input
              id={`edit-${field.key}`}
              disabled={busy}
              type="checkbox"
              checked={Boolean(values[field.key])}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [field.key]: event.target.checked,
                }))
              }
            />
          ) : field.type === "json" ||
            field.type === "long" ||
            field.type === "lines" ? (
            <textarea
              id={`edit-${field.key}`}
              disabled={busy}
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
              disabled={busy}
              required={
                ![
                  "demoUrl",
                  "image",
                  "portrait",
                  "issuedAt",
                  "systemPrompt",
                  "note",
                ].includes(field.key)
              }
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
      {["projects", "certificates", "testimonials"].includes(resource) && (
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
                  resource === "certificates" || resource === "testimonials"
                    ? {
                        ...current,
                        [resource === "testimonials" ? "portrait" : "image"]:
                          result.images[0].src,
                      }
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

function DeleteDialog({
  busy,
  close,
  confirm,
  error,
}: {
  error: string;
  busy: boolean;
  close: () => void;
  confirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trap = useModal(dialog);
  return (
    <dialog
      ref={dialog}
      className="admin-confirm"
      aria-labelledby="delete-title"
      onKeyDown={trap}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) close();
      }}
    >
      <h2 id="delete-title">Delete this record?</h2>
      <p>This action cannot be undone.</p>
      {error && <p role="alert">{error}</p>}
      <div>
        <button
          className="button button-outline"
          disabled={busy}
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="button button-gold"
          disabled={busy}
          onClick={confirm}
        >
          Delete record
        </button>
      </div>
    </dialog>
  );
}
function LeadEditor({
  initial,
  busy,
  save,
  close,
}: {
  initial: RecordData;
  busy: boolean;
  save: (data: RecordData) => void;
  close: () => void;
}) {
  const [status, setStatus] = useState(String(initial.status));
  const [notes, setNotes] = useState(String(initial.notes || ""));
  return (
    <form
      className="admin-editor glass lead-editor"
      onSubmit={(e) => {
        e.preventDefault();
        save({ id: initial.id, status, notes });
      }}
    >
      <h2>Manage inquiry from {String(initial.name)}</h2>
      <label htmlFor="lead-status">Status</label>
      <select
        id="lead-status"
        disabled={busy}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {["new", "contacted", "in-progress", "closed"].map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
      <label htmlFor="lead-notes">Private notes</label>
      <textarea
        id="lead-notes"
        rows={5}
        maxLength={5000}
        disabled={busy}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button className="button button-gold" disabled={busy}>
        Save inquiry
      </button>
      <button
        type="button"
        className="button button-outline"
        disabled={busy}
        onClick={close}
      >
        Cancel
      </button>
    </form>
  );
}
``````

## components/back-to-top.tsx

``````tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { subscribeScroll } from "@/lib/scroll";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    return subscribeScroll(({ y }) => setVisible(y > 600));
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

## components/bot-build-process.tsx

``````tsx
import {
  BookOpen,
  CheckCheck,
  Code2,
  MessagesSquare,
  Search,
} from "lucide-react";
import { Reveal } from "./reveal";
import { ReadingText } from "./reading-text";
import { TextReveal } from "./text-reveal";

const steps = [
  {
    title: "Understand the job",
    description:
      "Start with the questions your visitors ask, the actions the assistant should support, and where a person needs to take over.",
    note: "A clear purpose comes first",
    icon: Search,
  },
  {
    title: "Prepare the knowledge",
    description:
      "Organize your approved FAQs, services and business information. Give the assistant clear context and keep private information outside its knowledge base.",
    note: "Your information, carefully grounded",
    icon: BookOpen,
  },
  {
    title: "Build the conversation",
    description:
      "Shape the tone, instructions and conversation flow. Connect useful actions when needed, and give uncertain answers a clear fallback.",
    note: "Useful answers, with boundaries",
    icon: MessagesSquare,
  },
  {
    title: "Connect it to your website",
    description:
      "Choose a hosted embed, a floating widget or a custom chat interface. Connect the provider securely and make the experience work on mobile and desktop.",
    note: "The integration methods are below",
    icon: Code2,
  },
  {
    title: "Test, launch and improve",
    description:
      "Review real questions, incorrect answers and failure cases. Check consent, usage limits and handover before launch, then refine the assistant as your business changes.",
    note: "Review continues after launch",
    icon: CheckCheck,
  },
];

export function BotBuildProcess() {
  return (
    <section
      id="bot-build"
      className="container studio-section reference-workflow bot-build-process"
      aria-labelledby="bot-build-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">FROM YOUR KNOWLEDGE TO A USEFUL ASSISTANT</p>
        </Reveal>
        <TextReveal id="bot-build-title" text="How I Build Bots." />
        <Reveal>
          <ReadingText text="A useful assistant starts with your business, your information and a clear job to do. I shape the knowledge, conversation and integration, then test the details before it reaches your visitors." />
        </Reveal>
      </div>
      <div className="workflow-cards">
        {steps.map(({ title, description, note, icon: Icon }, index) => (
          <Reveal key={title} delay={index * 0.04}>
            <article className="workflow-step">
              <span className="workflow-number">{index + 1}</span>
              <Icon
                size={18}
                className="workflow-card-icon"
                aria-hidden="true"
              />
              <h3>{title}</h3>
              <p>{description}</p>
              <small>{note}</small>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
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
``````

## components/bot-services.tsx

``````tsx
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
                      <Icon size={42} strokeWidth={1.2} />
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
                        aria-label={`${copy.try}: ${bot.name}`}
                        onClick={() => setActive(bot)}
                      >
                        {copy.try}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                    )}
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
import { imagePreview } from "@/lib/image-preview";
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
                {...imagePreview(certificate.image)}
                alt={certificate.alt}
                fill
                sizes="(max-width: 700px) 200vw, 2400px"
                loading="eager"
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

import Image from "next/image";
import { imagePreview } from "@/lib/image-preview";
import { useState } from "react";
import { Expand } from "lucide-react";
import {
  certificateContent as copy,
  type Certificate,
} from "@/data/certificates";
import { Reveal } from "./reveal";

import CertificateViewer from "./certificate-viewer";

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
        <h1 id="certification-title">{copy.title}</h1>
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
                loading="eager"
                fetchPriority="low"
                src={certificate.image}
                {...imagePreview(certificate.image)}
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

## components/concept-site.tsx

``````tsx
"use client";

import artColors from "@/data/project-art-colors.json";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Leaf, Menu, Plus, Sun, Waves, X } from "lucide-react";
import { concepts, conceptUI as ui, type ConceptSlug } from "@/data/concepts";

export function ConceptSite({ slug }: { slug: ConceptSlug }) {
  const d = concepts[slug];
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState<string>(d.filters[0]);
  const [choice, setChoice] = useState<string>(d.items[0].name);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState<string>(ui.guestsOptions[1]);
  const [date, setDate] = useState("");
  const [finish, setFinish] = useState<string>(ui.finishes[0]);
  const [projectType, setProjectType] = useState("Residential");
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<{ text: string; details: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
  }, []);
  const model = d.items.find((item) => item.category === filter) || d.items[0];
  const filtered = d.items.filter((item) => filter === d.filters[0] || item.category === filter);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (slug === "solenne") {
      if (arrival < today) { setError(ui.futureDate); return; }
      if (departure <= arrival) { setError(ui.invalidStay); return; }
      setSummary({ text: ui.staySummary, details: `${choice} · ${arrival} → ${departure} · ${guests}` });
    } else if (slug === "aster") {
      if (date < today) { setError(ui.futureDate); return; }
      setSummary({ text: ui.visitSummary, details: `${choice} · ${date}` });
    } else if (slug === "vanta") {
      setSummary({ text: ui.carSummary, details: `${model.name} · ${finish}` });
    } else setSummary({ text: ui.briefSummary, details: `${d.name} / ${projectType}` });
  }
  function explore(name: string, category: string) {
    setChoice(name);
    if (slug === "kovo") setProjectType(category);
    setSummary(null);
    document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById(`${slug}-choice`)?.focus({ preventScroll: true });
  }
  const heroCopy = <div className="concept-hero-copy">
    <p className="concept-kicker">{d.kicker}</p>
    <h1>{d.headline.map((line) => <span key={line}>{line}</span>)}</h1>
    <p className="concept-intro">{d.intro}</p>
    <div className="concept-actions">
      <a className="concept-primary" href={slug === "vanta" ? "#plan" : "#collection"}>{d.action}<ArrowUpRight size={17} /></a>
      <a className="concept-secondary" href="#detail">{d.secondary}<ArrowDown size={15} /></a>
    </div>
  </div>;
  return <main id="main-content" className={`concept-site concept-${slug}`}>
    <div className="concept-ribbon"><Link href="/websites"><ArrowLeft size={13} />{ui.back}</Link><span>{ui.concept} / {d.category}</span><span>{ui.independent}</span></div>
    <header className="concept-header">
      <a className="concept-logo" href="#concept-top">{slug === "aster" && <span className="aster-mark" aria-hidden="true">✳</span>}{d.wordmark}{slug === "vanta" && <small>MOTORS</small>}{slug === "kovo" && <small>STUDIO / ARCHITECTURE</small>}</a>
      <nav id="concept-navigation" className={menu ? "concept-nav is-open" : "concept-nav"} aria-label={`${d.name} navigation`}>
        {d.nav.map((label, index) => <a key={label} href={["#collection", "#detail", "#plan"][index]} onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
      <a className="concept-header-action" href="#plan">{ui.headerActions[slug]}<ArrowUpRight size={15} /></a>
      <button className="concept-menu" aria-label={menu ? ui.closeMenu : ui.menu} aria-expanded={menu} aria-controls="concept-navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <section id="concept-top" className="concept-hero" data-capture="home" aria-label={d.name}>
      {(slug === "solenne" || slug === "vanta") && <div className="concept-hero-background"><Image src={d.image} alt={d.imageAlt} fill sizes="100vw" priority /><div className="concept-hero-shade" /></div>}
      {heroCopy}
      {(slug === "aster" || slug === "kovo") && <div className="concept-hero-picture"><Image src={d.image} alt={d.imageAlt} fill sizes="(max-width:700px) 100vw, 70vw" priority /><span>{d.caption}<ArrowUpRight size={16} /></span></div>}
      {(slug === "solenne" || slug === "vanta") && <div className="concept-hero-caption"><span>{d.caption}</span><span>{slug === "vanta" ? "01 / GT" : "36° / THE SLOWER SIDE"}</span></div>}
    </section>

    <section id="collection" className="concept-collection concept-section" data-capture="inner" aria-labelledby="collection-title">
      <div className="concept-section-heading"><p className="concept-kicker">{ui.collectionLabel}</p><h2 id="collection-title">{d.collectionTitle}</h2><p>{d.collectionIntro}</p></div>
      <div className="concept-filters" role="group" aria-label={slug === "vanta" ? ui.modelLabel : ui.filterLabel}>
        {d.filters.map((label) => <button key={label} aria-pressed={filter === label} onClick={() => { setFilter(label); setSummary(null); }}>{label}{filter === label && <span aria-hidden="true">↗</span>}</button>)}
      </div>
      {slug === "vanta" ? <div className="vanta-config-preview">
        <div className="vanta-drawing"><CarDrawing color={ui.finishColors[ui.finishes.indexOf(finish as typeof ui.finishes[number])]} /><span>{model.name} / {finish}</span></div>
        <div className="vanta-model-copy"><p className="concept-kicker">{model.category}</p><h3>{model.name}</h3><p>{model.detail}</p><dl><div><dt>{ui.range}</dt><dd>{model.price}</dd></div><div><dt>{ui.acceleration}</dt><dd>{model.number}</dd></div><div><dt>{ui.power}</dt><dd>{model.icon}</dd></div></dl><a href="#plan" className="concept-primary">{d.action}<ArrowUpRight size={17} /></a></div>
      </div> : <div className="concept-item-grid">
        {filtered.map((item) => {
          const index = d.items.findIndex((entry) => entry.name === item.name);
          const Icon = item.icon === "heart" ? Heart : item.icon === "leaf" ? Leaf : item.icon === "waves" ? Waves : item.icon === "plus" ? Plus : Sun;
          return <article className="concept-item" key={item.name}>
            {slug === "solenne" ? <div className="room-plan"><RoomPlan variant={index} /><span>{item.number} / {item.category}</span></div> : slug === "kovo" ? <div className={`space-study space-study-${index}`}><SpaceStudy variant={index} /><span>{item.price}</span></div> : <div className="care-symbol"><Icon size={33} strokeWidth={1.3} /><span>{item.number}</span></div>}
            <div className="concept-item-copy"><p className="concept-kicker">{item.category}</p><h3>{item.name}</h3><p>{item.detail}</p><div><span>{item.price}</span><button onClick={() => explore(item.name, item.category)} aria-label={`${ui.select} ${item.name}`}><ArrowUpRight size={20} /></button></div></div>
          </article>;
        })}
      </div>}
    </section>

    <section id="detail" className="concept-feature concept-section" data-capture="feature" aria-labelledby="feature-title">
      <div className="concept-feature-art">{slug === "kovo" ? <FloorStudy /> : <Image src={d.image} alt={d.imageAlt} fill sizes="(max-width:700px) 100vw, 650px" />}<span>{d.caption}</span></div>
      <div className="concept-feature-copy"><p className="concept-kicker">{ui.featureLabel}</p><h2 id="feature-title">{d.featureTitle}</h2><p>{d.featureText}</p><ol>{d.featureList.map((feature, i) => <li key={feature}><span>0{i + 1}</span>{feature}<ArrowUpRight size={16} /></li>)}</ol><a className="concept-secondary" href="#plan">{ui.headerActions[slug]}<ArrowRight size={16} /></a></div>
    </section>

    <section id="plan" className="concept-planner concept-section" aria-labelledby="plan-title">
      <div><p className="concept-kicker">{ui.plannerLabel}</p><h2 id="plan-title">{d.formTitle}</h2><p>{d.formDescription}</p></div>
      <form onSubmit={submit} className="concept-plan-form">
        <div className="concept-form-fields">
          {slug === "solenne" && <>
            <label htmlFor="solenne-choice">{ui.stay}<select id="solenne-choice" value={choice} onChange={(e) => setChoice(e.target.value)}>{d.items.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label htmlFor="solenne-arrival">{ui.arrival}<input id="solenne-arrival" type="date" required min={today} value={arrival} onChange={(e) => { setArrival(e.target.value); setError(""); }} /></label>
            <label htmlFor="solenne-departure">{ui.departure}<input id="solenne-departure" type="date" required min={arrival || today} value={departure} onChange={(e) => { setDeparture(e.target.value); setError(""); }} /></label>
            <label htmlFor="solenne-guests">{ui.guests}<select id="solenne-guests" value={guests} onChange={(e) => setGuests(e.target.value)}>{ui.guestsOptions.map((guest) => <option key={guest}>{guest}</option>)}</select></label>
          </>}
          {slug === "aster" && <>
            <label htmlFor="aster-choice">{ui.service}<select id="aster-choice" value={choice} onChange={(e) => setChoice(e.target.value)}>{d.items.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label htmlFor="aster-date">{ui.date}<input id="aster-date" type="date" min={today} required value={date} onChange={(e) => { setDate(e.target.value); setError(""); }} /></label>
          </>}
          {slug === "vanta" && <>
            <label htmlFor="vanta-choice">{ui.modelLabel}<select id="vanta-choice" value={filter} onChange={(e) => { setFilter(e.target.value); setSummary(null); }}>{d.filters.map((name) => <option key={name}>{name}</option>)}</select></label>
            <fieldset className="vanta-finishes"><legend>{ui.finish}</legend>{ui.finishes.map((name, i) => <label key={name}><input type="radio" name="finish" value={name} checked={finish === name} onChange={() => { setFinish(name); setSummary(null); }} /><span className="finish-swatch" style={{ backgroundColor: ui.finishColors[i] }}>{finish === name && <Check size={14} />}</span><span>{name}</span></label>)}</fieldset>
          </>}
          {slug === "kovo" && <label htmlFor="kovo-choice">{ui.projectType}<select id="kovo-choice" value={projectType} onChange={(e) => { setProjectType(e.target.value); setSummary(null); }}>{d.filters.slice(1).map((name) => <option key={name}>{name}</option>)}</select></label>}
        </div>
        {error && <p className="concept-form-error" role="alert">{error}</p>}
        <button className="concept-primary" type="submit">{slug === "solenne" ? ui.planStay : slug === "aster" ? ui.planVisit : slug === "vanta" ? ui.configure : ui.planBrief}<ArrowUpRight size={17} /></button>
        {summary && <div className="concept-summary" role="status"><span className="concept-kicker">{ui.demo}</span><p>{summary.text}</p><strong>{summary.details}</strong><button type="button" onClick={() => setSummary(null)}>{ui.reset}<ArrowRight size={14} /></button></div>}
      </form>
    </section>
    <footer className="concept-footer"><div><a className="concept-logo" href="#concept-top">{d.wordmark}</a><p>{d.footer}</p></div><div><span>{ui.footer}</span><Link href="/websites">{ui.back}<ArrowUpRight size={16} /></Link></div></footer>
  </main>;
}

function RoomPlan({ variant }: { variant: number }) {
  return <svg viewBox="0 0 420 260" aria-hidden="true"><defs><pattern id={`room-grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".07" /></pattern></defs><rect width="420" height="260" fill={`url(#room-grid-${variant})`} /><g fill="none" stroke="currentColor" strokeWidth="1.4"><path d={variant === 2 ? "M70 40h280v170H70zM240 40v170M70 130h170M155 40v90" : "M90 42h240v176H90zM250 42v176M90 155h160"} /><rect x="117" y="67" width="80" height="65" rx="3" /><path d="M117 82h80M157 67v65M105 200h115M112 184v16m100-16v16M277 76h30v80h-30z" /><circle cx="285" cy="185" r="15" /><path d="M330 55h25v150h-25" strokeDasharray="4 4" /></g><g fill="currentColor" opacity=".18"><circle cx="357" cy="68" r="12" /><circle cx="357" cy="188" r="12" /></g></svg>;
}

function CarDrawing({ color }: { color: string }) {
  return <svg viewBox="0 0 700 330" aria-hidden="true"><defs><linearGradient id="car-paint" x2=".4" y2="1"><stop stopColor={color} /><stop offset="1" stopColor={artColors.tone42} /></linearGradient></defs><path d="M60 245h580M95 257h510" stroke={artColors.tone43} strokeOpacity=".2" /><path d="m78 220 20-45 109-20 92-66h163l105 66 59 20 28 45-35 18H99z" fill="url(#car-paint)" stroke={artColors.tone44} strokeWidth="1.5" /><path d="m229 153 75-51h145l84 51z" fill={artColors.tone45} stroke={artColors.tone46} /><path d="M370 104v49M102 186h71m378-13h58M204 169h325M408 168v60" fill="none" stroke={artColors.tone47} strokeWidth="1.5" /><path d="m83 208 32-3m480-4 43 8" stroke={artColors.tone48} strokeWidth="4" /><g fill={artColors.tone49} stroke={artColors.tone50} strokeWidth="2"><circle cx="187" cy="232" r="39" /><circle cx="535" cy="232" r="39" /></g><g fill="none" stroke={artColors.tone51} strokeWidth="2"><circle cx="187" cy="232" r="24" /><circle cx="535" cy="232" r="24" /><path d="m164 232 46 0m-23-23v46m325-23h46m-23-23v46" /></g></svg>;
}

function SpaceStudy({ variant }: { variant: number }) {
  return <svg viewBox="0 0 420 280" aria-hidden="true"><path d="m40 225 153-80 190 75-149 49z" fill={artColors.tone52} /><path d="m70 121 130-57 143 48-130 62z" fill={variant === 1 ? artColors.tone53 : artColors.tone54} /><path d="m70 121 143 53v68L70 188z" fill={artColors.tone55} /><path d="m213 174 130-62v69l-130 61z" fill={artColors.tone56} /><path d="m98 114 104-42 109 37-103 48z" fill={artColors.tone57} /><path d="m96 142 96 36v45l-96-36zM232 183l88-42v34l-88 43z" fill={artColors.tone58} /><path d="m246 188 58-28M245 198l58-28" stroke={artColors.tone59} /><circle cx="143" cy="163" r={variant === 2 ? "19" : "13"} fill={artColors.tone60} /><path d="M355 190v-52m-12 23 12-30 14 30z" fill={artColors.tone61} stroke={artColors.tone61} /></svg>;
}

function FloorStudy() {
  return <svg viewBox="0 0 550 500" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M70 70h410v350H70zM70 270h245V70M315 270h165M200 270v150M315 330v90" strokeWidth="3" /><path d="M103 103h165v110H103zM348 103h92v90h-92zM348 304h92v80h-92zM101 315h63v65h-63zM228 314h60v65h-60z" strokeWidth="1.3" /><circle cx="202" cy="200" r="55" strokeWidth="1" /><path d="M45 70v350m0-350h-12m12 350h-12M70 446h410m-410 0v13m410-13v13M189 270a55 55 0 0 1 55 55M315 216a54 54 0 0 1 54 54" strokeOpacity=".6" /><path d="M70 250h65m152-180v90m28 235h55" strokeWidth="6" /></g></svg>;
}
``````

## components/consent-provider.tsx

``````tsx
"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ShieldCheck, X } from "lucide-react";
import { consentContent as copy } from "@/data/privacy";
import { parseConsent, type ConsentRecord } from "@/lib/consent";
import { useModal } from "@/hooks/use-modal";

type ConsentContextValue = {
  external: boolean;
  ready: boolean;
  allowExternal: () => void;
  openSettings: () => void;
};
const ConsentContext = createContext<ConsentContextValue>({
  external: false,
  ready: false,
  allowExternal: () => {},
  openSettings: () => {},
});
export const useConsent = () => useContext(ConsentContext);

function Preferences({
  external,
  save,
  close,
}: {
  external: boolean;
  save: (value: boolean) => void;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trap = useModal(dialog);
  const [selected, setSelected] = useState(external);
  return (
    <dialog
      ref={dialog}
      className="privacy-dialog"
      aria-labelledby="privacy-dialog-title"
      aria-describedby="privacy-dialog-description"
      onKeyDown={trap}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="privacy-dialog-head">
        <ShieldCheck size={25} aria-hidden="true" />
        <button
          type="button"
          className="icon-button"
          onClick={close}
          aria-label={copy.close}
        >
          <X size={20} />
        </button>
      </div>
      <h2 id="privacy-dialog-title">{copy.dialogTitle}</h2>
      <p id="privacy-dialog-description">{copy.dialogDescription}</p>
      <label className="privacy-option">
        <span>
          <strong>{copy.essential}</strong>
          <small>{copy.essentialNote}</small>
        </span>
        <input type="checkbox" checked disabled aria-label={copy.essential} />
      </label>
      <label className="privacy-option">
        <span>
          <strong>{copy.external}</strong>
          <small>{copy.externalNote}</small>
        </span>
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => setSelected(event.target.checked)}
        />
      </label>
      <p className="privacy-withdrawal">{copy.withdrawal}</p>
      <div className="consent-actions">
        <button type="button" onClick={() => save(true)}>
          {copy.accept}
        </button>
        <button type="button" onClick={() => save(false)}>
          {copy.reject}
        </button>
        <button type="button" onClick={() => save(selected)}>
          {copy.save}
        </button>
      </div>
      <div className="privacy-links">
        <Link href="/cookies" onClick={close}>
          {copy.policy}
        </Link>
        <Link href="/privacy" onClick={close}>
          {copy.privacy}
        </Link>
      </div>
    </dialog>
  );
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const read = () => {
      let current: ConsentRecord | null = null;
      try {
        current = parseConsent(localStorage.getItem(copy.key));
      } catch {
        document.documentElement.dataset.consentChoice = "needed";
        setRecord(null);
        setReady(true);
        return;
      }
      document.documentElement.dataset.consentChoice = current ? "saved" : "needed";
      setRecord(current);
      setReady(true);
    };
    read();
    const changed = (event: StorageEvent) => {
      if (event.key === copy.key || event.key === null) read();
    };
    const visible = () => {
      if (document.visibilityState === "visible") read();
    };
    window.addEventListener("storage", changed);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.removeEventListener("storage", changed);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  const save = useCallback((external: boolean) => {
    const next = { version: copy.version, external, updatedAt: Date.now() };
    document.documentElement.dataset.consentChoice = "saved";
    setRecord(next);
    setSettings(false);
    setReady(true);
    try {
      localStorage.setItem(copy.key, JSON.stringify(next));
      setStatus(copy.saved);
    } catch {
      setStatus(copy.notSaved);
    }
  }, []);
  return (
    <ConsentContext.Provider
      value={{
        external: ready && Boolean(record?.external),
        ready,
        allowExternal: () => save(true),
        openSettings: () => setSettings(true),
      }}
    >
      {children}
      {!record && !settings && (
        <aside className="consent-banner" aria-labelledby="consent-title">
          <div className="consent-symbol">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <div className="consent-copy">
            <h2 id="consent-title">{copy.title}</h2>
            <p>
              {copy.description} <Link href="/cookies">{copy.policy}</Link>
            </p>
          </div>
          <div className="consent-actions">
            <button type="button" onClick={() => save(true)}>
              {copy.accept}
            </button>
            <button type="button" onClick={() => save(false)}>
              {copy.reject}
            </button>
            <button type="button" onClick={() => setSettings(true)}>
              {copy.manage}
            </button>
          </div>
        </aside>
      )}
      {settings && (
        <Preferences
          external={Boolean(record?.external)}
          save={save}
          close={() => setSettings(false)}
        />
      )}
      <span className="sr-only" role="status">
        {status}
      </span>
    </ConsentContext.Provider>
  );
}
export function CookieSettingsButton() {
  const { openSettings } = useConsent();
  return (
    <button
      type="button"
      className="cookie-settings-link"
      onClick={openSettings}
    >
      {copy.settings}
    </button>
  );
}
``````

## components/contact-form.tsx

``````tsx
"use client";

import Link from "next/link";
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

const empty: ContactFields = {
  name: "",
  email: "",
  message: "",
  company: "",
  service: "",
};
export function ContactForm() {
  const [values, setValues] = useState<ContactFields>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [success, setSuccess] = useState(copy.success as string);
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
          ? (data as {
              ok?: boolean;
              error?: unknown;
              fields?: unknown;
              acceptance?: string;
            })
          : null;
      if (response.status === 202 && payload?.ok === true) {
        setSuccess(
          payload.acceptance === "stored"
            ? "Your inquiry has been saved. Thank you for getting in touch."
            : copy.success,
        );
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
      <div className="form-pair">
        <div className="form-field">
          <label htmlFor="contact-company">Company (optional)</label>
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            maxLength={150}
            disabled={sending}
            value={values.company || ""}
            onChange={(e) => updateField("company", e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="contact-service">Service (optional)</label>
          <select
            id="contact-service"
            name="service"
            disabled={sending}
            value={values.service || ""}
            onChange={(e) => updateField("service", e.target.value)}
          >
            <option value="">Let&apos;s discuss it</option>
            <option value="web">Website design & development</option>
            <option value="chat">AI chatbot development</option>
            <option value="automation">AI automation & integrations</option>
            <option value="seo">SEO & optimization</option>
          </select>
        </div>
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
      <p className="contact-privacy">
        {copy.privacy} <Link href="/privacy">{copy.privacyLink}</Link>
      </p>
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
            {success}
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
import { ArrowUpRight } from "lucide-react";
import { contactContent as copy } from "@/data/contact";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";
import { SocialLinks } from "./social-links";
import { TextReveal } from "./text-reveal";

export function Contact({ email }: { email: string }) {
  return (
    <section
      id="contact"
      className="container editorial-contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-paper">
        <div className="contact-editorial-copy">
          <div>
            <Reveal>
              <p className="eyebrow">{copy.eyebrow}</p>
            </Reveal>
            <TextReveal as="h1" id="contact-title" text={copy.title} />
            <Reveal>
              <p className="contact-invitation">{copy.description}</p>
            </Reveal>
          </div>
          <Reveal>
            <div className="contact-direct">
              <p>{copy.emailNote}</p>
              <a className="contact-address" href={`mailto:${email}`}>
                {email}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
              <SocialLinks iconsOnly />
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.08} className="contact-form-wrap">
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

import artColors from "@/data/project-art-colors.json";
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
        <Link href="/websites">
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
        <Link href="/websites">
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
          <stop stopColor={artColors.tone01} />
          <stop offset="1" stopColor={artColors.tone02} />
        </linearGradient>
        <linearGradient id="arch-glass" x2="1" y2="1">
          <stop stopColor={artColors.tone03} />
          <stop offset=".5" stopColor={artColors.tone04} />
          <stop offset="1" stopColor={artColors.tone05} />
        </linearGradient>
        <linearGradient id="arch-floor">
          <stop stopColor={artColors.tone06} />
          <stop offset="1" stopColor={artColors.tone07} />
        </linearGradient>
      </defs>
      <path fill="url(#arch-sky)" d="M0 0h900v700H0z" />
      <circle cx="720" cy="150" r="82" fill={artColors.tone08} opacity=".7" />
      <path d="M0 440 250 365 900 420v280H0" fill={artColors.tone09} />
      <path fill="url(#arch-floor)" d="m0 510 700-80 200 85v185H0" />
      <path d="M130 270h630v260H130z" fill={artColors.tone10} />
      <path d="m130 270 120-75h630l-120 75" fill={artColors.tone11} />
      <path d="m760 270 120-75v250l-120 85" fill={artColors.tone12} />
      <path d="M175 310h540v175H175z" fill="url(#arch-glass)" />
      <path
        d="M260 310v175m110-175v175m110-175v175m110-175v175"
        stroke={artColors.tone13}
        strokeWidth="9"
      />
      <path d="M115 492h660v30H115z" fill={artColors.tone14} />
      <path d="m60 610 500-40 225 62-520 55" fill={artColors.tone15} />
      <path d="m80 613 480-32 190 49-490 42" fill={artColors.tone16} />
      <path
        d="M48 260q80-90 120-225M65 235q-5-95-50-145M80 210q95-45 185-17M105 160q-60-110-110-120"
        stroke={artColors.tone17}
        strokeWidth="22"
        fill="none"
      />
      <path d="M50 490 76 190" stroke={artColors.tone18} strokeWidth="13" />
      <path d="m790 560 35-135 40 135" fill={artColors.tone19} />
      <ellipse cx="815" cy="565" rx="75" ry="16" fill={artColors.tone20} opacity=".4" />
      <path d="m0 700 900-80v80" fill={artColors.tone21} opacity=".2" />
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
              variant === 0 ? artColors.tone22 : variant === 1 ? artColors.tone23 : artColors.tone24
            }
          />
          <stop
            offset=".45"
            stopColor={
              variant === 0 ? artColors.tone25 : variant === 1 ? artColors.tone26 : artColors.tone27
            }
          />
          <stop
            offset="1"
            stopColor={
              variant === 0 ? artColors.tone28 : variant === 1 ? artColors.tone29 : artColors.tone30
            }
          />
        </linearGradient>
      </defs>
      <ellipse
        cx="250"
        cy="603"
        rx="160"
        ry="19"
        fill={artColors.tone31}
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
            fill={variant === 0 ? artColors.tone32 : artColors.tone33}
          />
          <path
            d="M250 250v330"
            stroke={variant === 0 ? artColors.tone34 : artColors.tone35}
            strokeWidth="2"
          />
          <path d="m160 393 60 5m65 0 55-5" stroke={artColors.tone36} strokeWidth="3" />
          {[320, 370, 420].map((y) => (
            <circle key={y} cx="265" cy={y} r="4" fill={artColors.tone37} />
          ))}
          <path
            d="m150 255 20 130m180-130-20 130"
            stroke={artColors.tone38}
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
            stroke={artColors.tone39}
            strokeOpacity=".22"
            strokeWidth="2"
          />
          <path
            d="m155 150 47 0-38 65m181-65h-47l44 65"
            fill="none"
            stroke={artColors.tone40}
            strokeWidth="2"
          />
        </>
      )}
      <path
        d="M190 106q60-35 120 0"
        fill="none"
        stroke={artColors.tone41}
        strokeWidth="3"
        opacity=".3"
      />
    </svg>
  );
}
``````

## components/demo-window.tsx

``````tsx
"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, Maximize2, Minimize2, PanelTop } from "lucide-react";
import { concepts } from "@/data/concepts";

/** Real interactive pages inside a desktop window, rather than an image/iframe. */
export function DemoWindow({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [maximized, setMaximized] = useState(false);
  return (
    <div className="demo-desktop">
      <header className="demo-desktop-menu">
        <Link href="/websites">Elvora Studio</Link>
        <span>Website concepts</span>
        <span>Interactive preview</span>
      </header>
      <section
        className={`demo-window${maximized ? " is-maximized" : ""}`}
        aria-label={`${title} preview window`}
        onKeyDown={(event) => {
          if (event.key === "Escape") setMaximized(false);
        }}
      >
        <div className="demo-window-toolbar">
          <span className="demo-window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="demo-window-breadcrumb">
            Elvora <span aria-hidden="true">/</span> <strong>{title}</strong>
          </span>
          <div className="demo-window-actions">
            <button
              type="button"
              onClick={() => setMaximized(!maximized)}
              aria-label={
                maximized ? "Restore preview window" : "Maximize preview window"
              }
              aria-pressed={maximized}
            >
              {maximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <Link href="/websites">
              <ArrowLeft size={14} />
              <span>Back to website</span>
            </Link>
          </div>
        </div>
        <div
          className="demo-window-content"
          data-native-scroll
          tabIndex={0}
          role="region"
          aria-label={`${title} website content`}
        >
          {children}
        </div>
      </section>
      <nav className="demo-desktop-dock" aria-label="Explore website concepts">
        {Object.entries(concepts).map(([slug, concept]) => (
          <Link
            key={slug}
            href={`/demo/${slug}`}
            aria-current={concept.name === title ? "page" : undefined}
          >
            <span aria-hidden="true">
              {concept.wordmark.slice(0, 1).toUpperCase()}
            </span>
            <small>{concept.name}</small>
          </Link>
        ))}
        <Link href="/websites">
          <span aria-hidden="true">
            <PanelTop size={21} />
          </span>
          <small>All work</small>
        </Link>
      </nav>
    </div>
  );
}
``````

## components/design-study.tsx

``````tsx
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  Command,
  Grid2X2,
  Layers3,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import { studyContent as copy, type Study } from "@/data/studies";

function Graph({ variant = 0 }: { variant?: number }) {
  return (
    <svg
      className="study-chart"
      viewBox="0 0 600 180"
      role="img"
      aria-label={copy.chartLabel}
    >
      <defs>
        <linearGradient
          id={`chart-fill-${variant}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity=".28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[35, 80, 125, 170].map((y) => (
        <path
          key={y}
          d={`M0 ${y}H600`}
          stroke="currentColor"
          strokeOpacity=".1"
        />
      ))}
      <path
        d="M0 150 C35 150 35 130 70 133 S120 102 160 114 S220 131 250 95 S310 70 350 83 S395 35 430 50 S490 80 520 44 S565 28 600 15 V180 H0Z"
        fill={`url(#chart-fill-${variant})`}
      />
      <path
        d="M0 150 C35 150 35 130 70 133 S120 102 160 114 S220 131 250 95 S310 70 350 83 S395 35 430 50 S490 80 520 44 S565 28 600 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
function Dashboard({ study }: { study: Study }) {
  const ai = study.kind === "analytics",
    d = study.details;
  return (
    <div className="study-dashboard">
      <aside className="study-sidebar">
        <div className="study-logo">
          {ai ? <Command size={22} /> : <CircleDot size={25} />} {study.name}
        </div>
        <small>{copy.sidebarLabel}</small>
        <nav aria-label={`${study.name} sections`}>
          {study.labels.map((label, i) => (
            <a
              key={label}
              href={i === 0 ? "#study-main" : "#study-details"}
              className={i === 0 ? "selected" : ""}
            >
              <Grid2X2 size={15} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
        <div className="study-user">
          <span>E</span>
          <div>
            {copy.role}
            <small>{copy.metricNote}</small>
          </div>
        </div>
      </aside>
      <div className="study-dashboard-main">
        <header>
          <p>{study.eyebrow}</p>
          <div>
            <Search size={18} aria-hidden="true" />
            <span className="study-avatar">E</span>
          </div>
        </header>
        <div className="study-dashboard-greeting">
          <h1>{study.headline}</h1>
          <p>{study.description}</p>
        </div>
        <div className="study-metrics">
          <div>
            <small>{d[0]}</small>
            <strong>{d[1]}</strong>
            <span>{copy.metricNote}</span>
          </div>
          <div>
            <small>{ai ? d[2] : d[3]}</small>
            <strong>{ai ? d[3] : d[4]}</strong>
            <span>{copy.metricNote}</span>
          </div>
          <div>
            <small>{ai ? d[4] : d[5]}</small>
            <strong>{ai ? d[5] : d[6]}</strong>
            <span>{copy.metricNote}</span>
          </div>
        </div>
        <div className="study-dashboard-panels">
          <section className="study-graph-panel">
            <div>
              <h2>{ai ? d[8] : d[2]}</h2>
              <span>{copy.metricNote}</span>
            </div>
            <Graph variant={ai ? 1 : 0} />
            <div className="study-week">
              {copy.stats.map((day, i) => (
                <span key={`${day}-${i}`}>{day}</span>
              ))}
            </div>
          </section>
          {ai ? (
            <section className="study-network">
              <div className="network-globe">
                <i />
                <i />
                <i />
                <span>
                  <Sparkles size={30} />
                </span>
              </div>
              <h2>{d[6]}</h2>
              <p>{d[7]}</p>
            </section>
          ) : (
            <section className="study-bank-card">
              <Wallet size={24} aria-hidden="true" />
              <p>{study.name}</p>
              <strong>•••• &nbsp; •••• &nbsp; 0284</strong>
              <small>{copy.role}</small>
              <span className="bank-card-orb" />
            </section>
          )}
        </div>
        <div className="study-activity">
          <h2>{ai ? d[8] : d[7]}</h2>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <span className="activity-symbol">
                {i === 0 ? <Layers3 size={17} /> : <ArrowUpRight size={17} />}
              </span>
              <span>{ai ? study.labels[i + 1] : d[i + 8]}</span>
              <small>{copy.metricNote}</small>
              <span className="activity-bars">
                <i style={{ width: `${35 + i * 20}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Editorial({ study }: { study: Study }) {
  const d = study.details;
  return (
    <div className={`study-editorial study-editorial-${study.kind}`}>
      <header className="study-editorial-header">
        <span className="study-logo">{study.name}</span>
        <nav aria-label={`${study.name} sections`}>
          {study.labels.map((label) => (
            <a href="#study-details" key={label}>
              {label}
            </a>
          ))}
        </nav>
        <a className="study-header-action" href="#study-details">
          <ArrowUpRight size={20} aria-label={copy.details} />
        </a>
      </header>
      <div className="study-editorial-hero">
        <div className="study-editorial-copy">
          <p>{study.eyebrow}</p>
          <h1>{study.headline}</h1>
          <div>
            <span>{study.description}</span>
            <a href="#study-details">
              {study.action}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="study-editorial-art" aria-hidden="true">
          {study.kind === "travel" ? (
            <>
              <Image
                src="/concepts/solenne-hero.webp"
                alt=""
                fill
                sizes="100vw"
                priority
              />
              <span className="travel-coordinates">
                A SLOWER PERSPECTIVE / 01
              </span>
            </>
          ) : study.kind === "fitness" ? (
            <>
              <div className="fitness-ring ring-a" />
              <div className="fitness-ring ring-b" />
              <div className="fitness-ring ring-c" />
              <span className="fitness-art-type">F/</span>
            </>
          ) : study.kind === "creative" ? (
            <>
              <div className="creative-poster">
                <span>{d[3]}</span>
                <i />
                <strong>{d[4]}</strong>
              </div>
              <div className="creative-poster-small">
                <i />
                <span>{study.name}</span>
              </div>
            </>
          ) : (
            <>
              <div className="beauty-disc" />
              <div className="beauty-bottle">
                <div />
                <span>{d[1]}</span>
                <small>{d[2]}</small>
                <i>01</i>
              </div>
              <div className="beauty-box">
                <span>{d[1]}</span>
                <small>{d[0]}</small>
              </div>
              <span className="beauty-art-caption">{d[3]}</span>
            </>
          )}
        </div>
      </div>
      <div className="study-editorial-bottom">
        <span>{d[0]}</span>
        <span>{d[1]}</span>
        <span>{d[2]}</span>
        <ArrowDownRight size={24} aria-hidden="true" />
      </div>
    </div>
  );
}
export function DesignStudy({ study }: { study: Study }) {
  return (
    <div
      className={`study-surface study-${study.kind}`}
      style={{ "--study-accent": study.accent } as React.CSSProperties}
    >
      <div className="study-notice">
        <Link href="/bunch-of-work">{copy.back}</Link>
        <span>{copy.label}</span>
        <span>{study.industry}</span>
      </div>
      <main id="main-content">
        <div id="study-main">
          {study.kind === "finance" || study.kind === "analytics" ? (
            <Dashboard study={study} />
          ) : (
            <Editorial study={study} />
          )}
        </div>
        <section id="study-details" className="study-details">
          <div>
            <p>{copy.collection}</p>
            <h2>
              {study.name} / {study.industry}
            </h2>
            <p>{copy.note}</p>
          </div>
          <Link href="/bunch-of-work">
            {copy.back}
            <ChevronRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <footer className="study-footer">
        {copy.framework}
        <span>© {new Date().getFullYear()} Elvora</span>
      </footer>
    </div>
  );
}
``````

## components/editorial-effects.tsx

``````tsx
"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./motion-preference";

/** Optional desktop enhancements; touch and reduced motion keep native scrolling. */
export function EditorialEffects() {
  const { reduced } = useMotionPreference();
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cleanup: (() => void) | undefined;
    const enable = () => {
      cleanup?.();
      if (!media.matches) return;
      let cancelled = false;
      let scroll: { destroy: () => void } | undefined;
      void import("lenis")
        .then(({ default: Lenis }) => {
          if (cancelled) return;
          scroll = new Lenis({
            autoRaf: true,
            smoothWheel: true,
            syncTouch: false,
            duration: 0.65,
            easing: (value: number) =>
              Math.min(1, 1.001 - Math.pow(2, -10 * value)),
            anchors: true,
            prevent: (node) =>
              Boolean(
                node.closest("dialog, .mobile-nav, [data-native-scroll]"),
              ),
          });
        })
        .catch(() => {
          /* Native scrolling remains available if the enhancement cannot load. */
        });
      let frame = 0;
      let magnetic: HTMLElement | null = null;
      const clear = () => {
        if (cursor.current) cursor.current.style.opacity = "0";
        magnetic?.style.removeProperty("translate");
        magnetic = null;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const target = event.target instanceof Element ? event.target : null;
          const view = target?.closest(
            ".project-card, .interface-study-card, .dome-tile, .dome-index a",
          );
          const button =
            target?.closest<HTMLElement>(
              ".hero-actions .button, .footer-brief-link",
            ) || null;
          if (magnetic !== button) {
            magnetic?.style.removeProperty("translate");
            magnetic = button;
          }
          if (button) {
            const rect = button.getBoundingClientRect();
            button.style.translate = `${(event.clientX - rect.left - rect.width / 2) * 0.06}px ${(event.clientY - rect.top - rect.height / 2) * 0.06}px`;
          }
          if (cursor.current) {
            cursor.current.style.opacity = view ? "1" : "0";
            cursor.current.style.transform = `translate3d(${event.clientX + 16}px, ${event.clientY + 16}px, 0)`;
          }
        });
      };
      document.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", clear);
      window.addEventListener("blur", clear);
      cleanup = () => {
        cancelled = true;
        scroll?.destroy();
        cancelAnimationFrame(frame);
        clear();
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", clear);
        window.removeEventListener("blur", clear);
      };
    };
    enable();
    media.addEventListener("change", enable);
    return () => {
      cleanup?.();
      media.removeEventListener("change", enable);
    };
  }, [reduced]);
  return (
    <div ref={cursor} className="project-view-cursor" aria-hidden="true">
      View ↗
    </div>
  );
}
``````

## components/experience.tsx

``````tsx
import {
  Blocks,
  Braces,
  Database,
  ShieldCheck,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import { experience as copy } from "@/data/experience";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { SocialLinks } from "./social-links";
import { site } from "@/data/site";
import { ReadingText } from "./reading-text";
const fundamentalsIcons = {
  frontend: Blocks,
  backend: Braces,
  database: Database,
  deployment: ShieldCheck,
  ai: Bot,
};
export function Experience() {
  return (
    <section
      id="experience"
      className="container experience-section reference-about"
      aria-labelledby="experience-title"
    >
      <div className="experience-intro">
        <Reveal>
          <figure className="about-portrait">
            <div
              className="about-portrait-image about-brand-poster"
              aria-label="Elvora: code, context, craft"
            >
              <span className="eyebrow">INDEPENDENT BY DESIGN</span>
              <span className="poster-emblem" aria-hidden="true">
                E<span>.</span>
              </span>
              <strong>
                Code.
                <br />
                Context.
                <br />
                Craft.
              </strong>
              <span>DESIGN + WEB DEVELOPMENT</span>
            </div>
            <figcaption>
              <div>
                <span className="eyebrow">{site.brand}</span>
                <strong>{site.name}</strong>
              </div>
              <span className="about-signature" aria-hidden="true">
                E.
              </span>
            </figcaption>
          </figure>
        </Reveal>
        <div className="about-story">
          <Reveal>
            <p className="eyebrow">{copy.eyebrow}</p>
          </Reveal>
          <TextReveal as="h1" id="experience-title" text={copy.title} />
          <Reveal>
            <ReadingText className="experience-lead" text={copy.lead} />
            {copy.paragraphs.map((paragraph) => (
              <ReadingText key={paragraph} text={paragraph} />
            ))}
            <SocialLinks />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TechnicalDomains() {
  return (
    <section
      id="fundamentals"
      className="container fundamentals-section domains-section"
      aria-labelledby="fundamentals-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.fundamentals.eyebrow}</p>
      </Reveal>
      <TextReveal
        as="h2"
        id="fundamentals-title"
        text={copy.fundamentals.title}
      />
      <Reveal>
        <p className="section-intro">{copy.fundamentals.description}</p>
      </Reveal>
      <div className="domains-bento">
        {copy.fundamentals.blocks.map((block, index) => {
          const Icon = fundamentalsIcons[block.id];
          return (
            <Reveal key={block.id} delay={index * 0.05}>
              <article className={`domain-card domain-${block.id}`}>
                <div className="domain-heading">
                  <span className="domain-icon">
                    <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <h3>{block.title}</h3>
                  <span className="domain-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <p>{block.description}</p>
                <ul
                  className="domain-tags"
                  aria-label={`${block.title} technologies`}
                >
                  {block.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {block.id === "ai" && (
                  <a href="/ai-bots" className="domain-demo-link">
                    Explore the AI demos
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal>
        <p className="fundamentals-closing">{copy.fundamentals.closing}</p>
      </Reveal>
    </section>
  );
}
``````

## components/faq-enhancement.tsx

``````tsx
"use client";
import { useEffect } from "react";
import { enhanceFaq } from "@/lib/faq-animation";
import { useMotionPreference } from "./motion-preference";

/** Native FAQ content and its small enhancement are both ready on page load. */
export function FaqEnhancement() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const root = document.getElementById("faq");
    if (root && !reduced) return enhanceFaq(root);
  }, [reduced]);
  return null;
}
``````

## components/faq-section.tsx

``````tsx
import type { Faq } from "@/data/agency";
import { TextReveal } from "./text-reveal";
import { FaqEnhancement } from "./faq-enhancement";
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section
      id="faq"
      className="container studio-section agency-faq"
      aria-labelledby="faq-title"
    >
      <FaqEnhancement />
      <div>
        <p className="eyebrow">BEFORE WE BUILD</p>
        <TextReveal id="faq-title" text={"Good questions.\nClear answers."} />
        <p className="section-intro">
          A few things to know before starting a project together.
        </p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={faq.id}>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {faq.question}
            </summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
``````

## components/footer.tsx

``````tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";
import { studio } from "@/data/studio";
import { SocialLinks } from "./social-links";
import { CookieSettingsButton } from "./consent-provider";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

export function Footer({
  brand,
  email = site.email,
}: {
  brand: string;
  email?: string;
}) {
  return (
    <footer className="editorial-footer">
      <div className="container footer-top-grid">
        <div className="footer-editorial-invitation">
          <Reveal>
            <p className="eyebrow">{studio.ending.eyebrow}</p>
          </Reveal>
          <TextReveal text={studio.ending.title} />
          <Reveal>
            <p>{studio.ending.description}</p>
          </Reveal>
        </div>
        <Reveal>
          <nav aria-label="Footer navigation" className="footer-quick-links">
            <h3>{studio.ending.navigation}</h3>
            <div>
              {studio.ending.navLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="footer-contact-column">
            <h3>{studio.ending.connect}</h3>
            <a href={`mailto:${email}`} className="footer-contact-address">
              {email}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link href="/contact" className="footer-brief-link">
              {studio.ending.action}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="footer-wordmark-window" aria-hidden="true">
        <span>{brand}</span>
        <i />
      </div>
      <div className="footer-signoff">
        <div className="footer-waves" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
            <path d="M0 75C200 75 280 0 480 24S780 128 1000 52S1240 0 1440 46V110H0Z" />
            <path d="M0 55C260 120 370 5 650 43S990 102 1180 34S1350 15 1440 25V110H0Z" />
            <path d="M0 90C250 50 390 105 610 66S990 0 1160 65S1350 100 1440 60V110H0Z" />
          </svg>
        </div>
        <div className="container">
          <Reveal>
            <Link
              className="footer-emblem"
              href="/#top"
              aria-label={`${brand} — Home`}
            >
              <span>
                <Image
                  loading="eager"
                  fetchPriority="low"
                  src={site.logo.src}
                  alt=""
                  width={64}
                  height={64}
                  aria-hidden="true"
                />
              </span>
              <strong>{brand}</strong>
            </Link>
            <p className="footer-signature">{studio.ending.signature}</p>
            <div className="footer-social-row">
              <SocialLinks iconsOnly />
              <a className="footer-email-icon" href={`mailto:${email}`}>
                Let’s connect
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
          <div className="footer-editorial-colophon">
            <p>
              © {new Date().getFullYear()} {brand}. {studio.ending.copyright}
            </p>
            <nav aria-label="Legal information">
              {studio.ending.legalLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <CookieSettingsButton />
            </nav>
            <Link
              className="footer-top-link"
              href="#top"
              aria-label={site.ui.back}
            >
              ↑
            </Link>
          </div>
          <p className="footer-editorial-credit">{studio.ending.credit}</p>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
``````

## components/forte-preview.tsx

``````tsx
import { ArrowUpRight, ChevronLeft, MoreHorizontal, Paperclip, Smile, Mic, X } from "lucide-react";
import { botContent } from "@/data/bots";

export function FortePreview({ name }: { name: string }) {
  const copy = botContent.preview;
  return <div className="forte-preview" aria-hidden="true">
    <div className="forte-preview-header"><ChevronLeft size={15} /><span className="forte-preview-mark">{copy.mark}</span><div><strong>{name}</strong><span>{copy.subtitle}</span></div><MoreHorizontal size={18} /><X size={17} /></div>
    <div className="forte-preview-body"><span className="forte-preview-label">{copy.label}</span><strong>{copy.heading}</strong><p>{copy.description}</p><span className="forte-preview-invitation">{copy.invitation}<ArrowUpRight size={16} /></span></div>
    <div className="forte-preview-composer"><span>{copy.placeholder}</span><div><Paperclip size={14} /><Smile size={14} /><Mic size={14} /></div></div>
    <div className="forte-preview-powered">{copy.powered}</div>
  </div>;
}
``````

## components/hero-emblem.tsx

``````tsx
import Image from "next/image";
import { site } from "@/data/site";
import { LogoMotion } from "./logo-motion";
export function HeroEmblem() {
  return (
    <div
      className="hero-emblem"
      data-parallax="hero"
      aria-label={`${site.brand}: websites and digital experiences`}
      role="img"
    >
      <div className="emblem-grid" aria-hidden="true" />
      <div className="emblem-ring emblem-ring-one" aria-hidden="true" />
      <div className="emblem-ring emblem-ring-two" aria-hidden="true" />
      <div className="emblem-plinth" aria-hidden="true" />
      <LogoMotion />
      <div className="emblem-object" data-logo-flip aria-hidden="true">
        <div className="emblem-face emblem-face-front">
          <Image src={site.logo.src} alt="" width={240} height={240} priority />
          <span className="emblem-shine" />
        </div>
        <div className="emblem-face emblem-face-back">
          <Image src={site.logo.src} alt="" width={240} height={240} />
          <span className="emblem-shine" />
        </div>
      </div>
      <span className="emblem-label">
        {site.brand.toUpperCase()}
        <small>{site.hero.floatingLabel}</small>
      </span>
      <span className="emblem-coordinate" aria-hidden="true">
        E / DESIGN + CODE
      </span>
      <span className="emblem-orbit-dot" aria-hidden="true" />
    </div>
  );
}
``````

## components/hero.tsx

``````tsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { TextReveal } from "./text-reveal";
import { HeroEmblem } from "./hero-emblem";
import { ReadingText } from "./reading-text";

export function Hero() {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div>
          <p className="eyebrow">
            <span className="tiny-line" />
            {site.hero.eyebrow}
          </p>
          <TextReveal
            as="h1"
            id="hero-title"
            className="hero-title-reveal"
            text={site.hero.heading.join("\n")}
          />
        </div>
        <div>
          <ReadingText className="hero-intro" text={site.hero.intro} />
          <p className="hero-tagline">{site.hero.tagline}</p>
          <div className="hero-actions">
            <a href="/websites" className="button button-gold">
              {site.hero.primary}
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a href="/contact" className="button button-outline">
              {site.hero.secondary}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-note">{site.hero.note}</p>
        </div>
      </div>
      <div className="hero-visual">
        <HeroEmblem />
      </div>
      <div className="hero-bottom">
        <div
          className="expertise-marquee"
          role="group"
          aria-label={site.expertise.join(", ")}
        >
          <div
            className="expertise-marquee-track"
            data-velocity-marquee
            aria-hidden="true"
          >
            {[0, 1].map((copy) => (
              <div className="expertise-list" key={copy}>
                {site.expertise.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <a
          href="/websites"
          className="scroll-link"
          aria-label={site.hero.primary}
        >
          <span aria-hidden="true">EXPLORE THE WEBSITES</span>
          <ArrowDownRight size={18} />
        </a>
      </div>
    </section>
  );
}
``````

## components/home-directory.tsx

``````tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { studies } from "@/data/studies";
import { imagePreview } from "@/lib/image-preview";
import { ReadingText } from "./reading-text";
import { TextReveal } from "./text-reveal";

export function HomeDirectory({ projects }: { projects: ProjectView[] }) {
  const website = projects[0]?.screenshots[0];
  const collection = [
    ...projects.slice(0, 3).map((project) => ({
      src: project.screenshots[0].src,
      title: project.title,
    })),
    ...studies
      .slice(0, 3)
      .map((study) => ({ src: study.screenshot, title: study.name })),
  ];
  return (
    <section
      id="explore"
      className="home-directory home-overview"
      aria-labelledby="directory-title"
    >
      <div className="container home-purpose">
        <p className="eyebrow">THE PURPOSE BEHIND ELVORA</p>
        <TextReveal
          id="directory-title"
          text={"Human ideas.\nUseful digital experiences."}
        />
        <ReadingText text="This is a place to explore what I create and how I create it: websites with their own identity, useful integrations and the thoughtful decisions behind them. AI assistants are an optional part of that work. See the work in action, follow the process, or start a conversation about your own idea." />
      </div>
      <nav
        className="container home-feature-grid"
        aria-label="Explore Elvora's work"
      >
        <Link className="home-feature home-feature-websites" href="/websites">
          <div className="home-feature-copy">
            <p className="eyebrow">WEBSITES</p>
            <h3>Made with a point of view.</h3>
            <p>
              Original website concepts, built around an idea. Explore the
              interfaces and the creative process behind them.
            </p>
            <span>
              Explore websites <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="home-feature-media home-website-preview">
            <Image
              loading="eager"
              fetchPriority="low"
              src={website?.src || "/videos/work-showcase-poster.webp"}
              {...imagePreview(website?.src || "")}
              alt={website?.alt || "A preview of Elvora's website concepts"}
              width={1600}
              height={1000}
              sizes="(max-width: 767px) 90vw, 1000px"
            />
          </div>
        </Link>
        <Link className="home-feature home-feature-bots" href="/ai-bots">
          <div className="home-feature-copy">
            <p className="eyebrow">AI BOTS</p>
            <h3>A question. A useful answer.</h3>
            <p>
              Meet the assistants, try the demos, and see how I build, ground
              and embed a bot into a website.
            </p>
            <span>
              Explore AI bots <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="home-feature-media home-bot-preview">
            <Image
              loading="eager"
              fetchPriority="low"
              src="/videos/ai-bot-poster.webp"
              alt="A preview of a customer conversation with an AI assistant"
              width={1600}
              height={900}
              sizes="(max-width: 767px) 90vw, 580px"
            />
          </div>
        </Link>
        <Link
          className="home-feature home-feature-collection"
          href="/bunch-of-work"
        >
          <div className="home-feature-copy">
            <p className="eyebrow">BUNCH OF WORK</p>
            <h3>Different worlds. One eye for detail.</h3>
            <p>
              A closer look at websites, dashboards and interface experiments.
              Discover the full visual collection.
            </p>
            <span>
              See the collection <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <div
            className="home-feature-media home-collection-preview"
            aria-hidden="true"
          >
            {collection.map((shot) => (
              <div key={shot.src}>
                <Image
                  loading="eager"
                  fetchPriority="low"
                  src={shot.src}
                  {...imagePreview(shot.src)}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 30vw, 190px"
                />
              </div>
            ))}
          </div>
        </Link>
      </nav>
      <div className="container home-more">
        <div>
          <p className="eyebrow">KEEP EXPLORING</p>
          <h2>The person. The perspective. The next idea.</h2>
        </div>
        <nav aria-label="More about Elvora">
          {[
            {
              href: "/about",
              title: "About Me",
              text: "My journey, technical foundations and the tools I work with.",
            },
            {
              href: "/testimonials",
              title: "Testimonials",
              text: "Perspectives on working together, all in one place.",
            },
            {
              href: "/contact",
              title: "Let’s talk",
              text: "Tell me what you have in mind. Let’s find a thoughtful way forward.",
            },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <h3>
                {item.title}
                <ArrowUpRight size={18} aria-hidden="true" />
              </h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
``````

## components/legacy-section-redirect.tsx

``````tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { legacySections } from "@/data/navigation";

/** Keep saved links to the former one-page portfolio useful. */
export function LegacySectionRedirect() {
  const router = useRouter();
  useEffect(() => {
    const sync = () => {
      const destination = legacySections[window.location.hash];
      if (destination) router.replace(destination);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [router]);
  return null;
}
``````

## components/legal-page.tsx

``````tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { legal } from "@/data/privacy";
import { site } from "@/data/site";
import { BrandMark } from "./brand-mark";
import { Footer } from "./footer";
import { CookieSettingsButton } from "./consent-provider";
export function LegalPage({ page }: { page: keyof typeof legal.pages }) {
  const copy = legal.pages[page];
  return (
    <div id="top">
      <header className="container legal-header">
        <Link href="/" className="wordmark">
          <BrandMark brand={site.brand} />
        </Link>
        <Link href="/" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          {legal.back}
        </Link>
      </header>
      <main id="main-content" className="container legal-main">
        <p className="eyebrow">
          {legal.updatedLabel} · {legal.updated}
        </p>
        <h1>{copy.title}</h1>
        <p className="legal-intro">{copy.intro}</p>
        <nav className="legal-tabs" aria-label="Policies">
          {Object.entries(legal.pages).map(([id, item]) => (
            <Link
              key={id}
              href={`/${id}`}
              aria-current={id === page ? "page" : undefined}
            >
              {item.title}
            </Link>
          ))}
          <CookieSettingsButton />
        </nav>
        {copy.sections.map((section, index) => (
          <section key={section.title} className="legal-section">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
        <div className="legal-contact">
          <p>{legal.contact}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </main>
      <Footer brand={site.brand} />
    </div>
  );
}
``````

## components/logo-motion.tsx

``````tsx
"use client";
import { useEffect } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

/** Scroll-scrubbed flip, including touch; the shared stream adds no extra scroll listener. */
export function LogoMotion() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const logo = document.querySelector<HTMLElement>("[data-logo-flip]");
    if (!logo || reduced) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      logo.dataset.logoVisible = String(entry.isIntersecting);
    });
    observer.observe(logo);
    const unsubscribe = subscribeScroll(({ y, viewport }) => {
      if (!visible) return;
      const scene = logo.closest<HTMLElement>(".hero-emblem")!;
      const start = Math.max(
        0,
        scene.getBoundingClientRect().top +
          y +
          logo.offsetTop -
          viewport * 0.65,
      );
      const progress = Math.max(
        0,
        Math.min(1, (y - start) / (viewport * 0.72)),
      );
      logo.style.setProperty("--logo-turn", `${progress * 360}deg`);
      logo.style.setProperty("--logo-lift", `${progress * -18}px`);
    });
    return () => {
      unsubscribe();
      observer.disconnect();
      logo.style.removeProperty("--logo-turn");
      logo.style.removeProperty("--logo-lift");
      delete logo.dataset.logoVisible;
    };
  }, [reduced]);
  return null;
}
``````

## components/motion-preference.tsx

``````tsx
"use client";

import { createContext, useContext } from "react";

export type MotionPreference = "full" | "reduced";
export const MotionPreferenceContext = createContext<{
  preference: MotionPreference;
  reduced: boolean;
  setPreference: (value: MotionPreference) => void;
}>({ preference: "full", reduced: false, setPreference: () => {} });

export const useMotionPreference = () => useContext(MotionPreferenceContext);

export function MotionControl() {
  const { preference, setPreference } = useMotionPreference();
  return (
    <label className="motion-control">
      <span>Motion</span>
      <select
        aria-label="Animation preference"
        value={preference}
        onChange={(event) =>
          setPreference(event.target.value as MotionPreference)
        }
      >
        <option value="full">On</option>
        <option value="reduced">Off</option>
      </select>
    </label>
  );
}
``````

## components/motion-provider.tsx

``````tsx
"use client";

import { RevealObserver } from "./reveal-observer";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MotionPreferenceContext,
  type MotionPreference,
} from "./motion-preference";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<MotionPreference>("full");
  useEffect(() => {
    const saved = document.documentElement.dataset.motion;
    if (saved === "full" || saved === "reduced") setPreference(saved);
  }, []);
  const reduced = preference === "reduced";
  function updatePreference(value: MotionPreference) {
    setPreference(value);
    document.documentElement.dataset.motion = value;
    try {
      localStorage.setItem("elvora-motion", value);
    } catch {
      /* Optional persistence. */
    }
  }
  return (
    <MotionPreferenceContext.Provider
      value={{ preference, reduced, setPreference: updatePreference }}
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reduced ? "always" : "never"}>
          <RevealObserver />
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionPreferenceContext.Provider>
  );
}
``````

## components/navbar.tsx

``````tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { site } from "@/data/site";
import { aboutPages, portfolioPages } from "@/data/navigation";
import { BrandMark } from "./brand-mark";
import { MotionControl } from "./motion-preference";

export function Navbar({
  identity,
}: {
  identity: { brand: string };
  rootLinks?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const menuButton = useRef<HTMLButtonElement>(null);
  const aboutButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const aboutMenu = useRef<HTMLDivElement>(null);
  const inAbout = aboutPages.some((id) => portfolioPages[id].href === pathname);
  const current = (href: string) =>
    href === "/about"
      ? inAbout
      : href === "/ai-bots"
        ? pathname.startsWith("/ai-bots")
        : pathname === href;
  const close = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
    setTheme(document.documentElement.dataset.theme || "dark");
  }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1200px)");
    const changed = () => {
      setOpen(false);
      setAboutOpen(false);
    };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (!open && !aboutOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setAboutOpen(false);
      (open ? menuButton : aboutButton).current?.focus();
    };
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !menu.current?.contains(target) &&
        !menuButton.current?.contains(target)
      )
        setOpen(false);
      if (!aboutMenu.current?.contains(target)) setAboutOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open, aboutOpen]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Optional persistence. */
    }
  }
  return (
    <header className="site-header portfolio-header">
      <nav className="container nav-row" aria-label="Main navigation">
        <Link
          href="/"
          className="wordmark"
          aria-label={`${identity.brand} — Home`}
          onClick={close}
        >
          <BrandMark brand={identity.brand} />
        </Link>
        <div className="desktop-nav">
          {site.nav.map((item) =>
            item.href === "/about" ? (
              <div
                key={item.href}
                className="nav-about-group"
                ref={aboutMenu}
                onBlur={(event) => {
                  if (
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  )
                    setAboutOpen(false);
                }}
              >
                <Link
                  href={item.href}
                  data-active={inAbout || undefined}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
                <button
                  ref={aboutButton}
                  className="nav-about-toggle"
                  aria-label="Explore About Me"
                  aria-expanded={aboutOpen}
                  aria-controls="about-navigation"
                  onClick={() => setAboutOpen(!aboutOpen)}
                >
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                <div
                  id="about-navigation"
                  className="about-navigation"
                  hidden={!aboutOpen}
                >
                  <p>THE PERSON & THE PROCESS</p>
                  {aboutPages.map((id) => (
                    <Link
                      key={id}
                      href={portfolioPages[id].href}
                      aria-current={
                        pathname === portfolioPages[id].href
                          ? "page"
                          : undefined
                      }
                      onClick={close}
                    >
                      {portfolioPages[id].label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-active={current(item.href) || undefined}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
        <div className="nav-actions">
          <MotionControl />
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
            {open ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
        <div
          id="mobile-navigation"
          className="mobile-nav"
          ref={menu}
          hidden={!open}
          data-native-scroll
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node) &&
              event.relatedTarget !== menuButton.current
            )
              setOpen(false);
          }}
        >
          <p className="mobile-nav-label">EXPLORE</p>
          {site.nav.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <p className="mobile-nav-label">ABOUT & PROCESS</p>
          {aboutPages.map((id) => (
            <Link
              key={id}
              href={portfolioPages[id].href}
              aria-current={
                pathname === portfolioPages[id].href ? "page" : undefined
              }
              onClick={close}
            >
              {portfolioPages[id].label}
            </Link>
          ))}
          <p className="mobile-nav-label">LET’S CONNECT</p>
          {["testimonials", "services", "contact"].map((id) => {
            const item =
              portfolioPages[id as "testimonials" | "services" | "contact"];
            return (
              <Link
                key={id}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
``````

## components/page-tabs.tsx

``````tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  aboutPages,
  portfolioPages,
  type PortfolioPage,
} from "@/data/navigation";

const subjectSections = {
  websites: [
    { id: "work", label: "Website concepts" },
    { id: "workflow", label: "How I Build Websites" },
    { id: "fundamentals", label: "Technical Domains" },
  ],
  bots: [
    { id: "ai-bots", label: "AI Bots" },
    { id: "bot-build", label: "How I Build Bots" },
    { id: "embed-methods", label: "How I Embed Bots" },
  ],
};
export function PageTabs({ page }: { page: PortfolioPage }) {
  const row = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const sections =
    page === "websites" || page === "bots" ? subjectSections[page] : null;
  const profile = aboutPages.some((id) => id === page);
  useEffect(() => {
    if (!sections) {
      const selected = row.current?.querySelector<HTMLElement>(
        '[aria-current="page"]',
      );
      if (selected && row.current)
        row.current.scrollLeft =
          selected.offsetLeft -
          row.current.offsetLeft -
          (row.current.clientWidth - selected.offsetWidth) / 2;
      return;
    }
    setActive(sections[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-10% 0px -55% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [page, sections]);
  if (!sections && !profile) return null;
  return (
    <nav
      className="page-tabs"
      aria-label={
        profile
          ? "About Me pages"
          : `${page === "bots" ? "AI Bots" : "Websites"} sections`
      }
    >
      <div className="container page-tabs-inner" ref={row}>
        {sections
          ? sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? "location" : undefined}
              >
                {section.label}
              </a>
            ))
          : aboutPages.map((id) => (
              <Link
                key={id}
                href={portfolioPages[id].href}
                aria-current={id === page ? "page" : undefined}
              >
                {portfolioPages[id].label}
              </Link>
            ))}
      </div>
    </nav>
  );
}
``````

## components/project-card.tsx

``````tsx
"use client";
import { useMotionPreference } from "./motion-preference";
import Image from "next/image";
import Link from "next/link";
import { imagePreview } from "@/lib/image-preview";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { subscribeScroll } from "@/lib/scroll";
import { projectPresentation } from "@/data/project-presentation";
export function ProjectCard({ project }: { project: ProjectView }) {
  const { reduced } = useMotionPreference();
  const card = useRef<HTMLAnchorElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 110, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 110, damping: 22 });
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const element = card.current;
    if (!element || reduced) {
      x.set(0);
      y.set(0);
      return;
    }
    let visible = false;
    const update = (viewport: number) => {
      if (!visible || finePointer) return;
      const rect = element.getBoundingClientRect();
      const position = Math.max(
        -1,
        Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / viewport),
      );
      x.set(position * -5);
      y.set(position * 7);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        element.dataset.deviceVisible = String(visible);
        update(window.innerHeight);
      },
      { rootMargin: "60px" },
    );
    observer.observe(element);
    const unsubscribe = finePointer
      ? undefined
      : subscribeScroll(({ viewport }) => update(viewport));
    return () => {
      observer.disconnect();
      unsubscribe?.();
      delete element.dataset.deviceVisible;
      x.set(0);
      y.set(0);
    };
  }, [reduced, finePointer, x, y]);
  const tilt = finePointer && !reduced;
  const presentation = projectPresentation(project.id);
  const mobile = project.screenshots[2] || project.screenshots[0];
  return (
    <Link
      ref={card}
      className={`project-card device-project curated-project${presentation.artwork ? " artwork-project" : ""}`}
      href={project.demoUrl || `/work/${project.id}`}
      aria-label={`Explore website: ${project.title}`}
      onPointerMove={(event) => {
        if (!tilt) return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--pointer-x",
          `${((event.clientX - rect.left) / rect.width) * 100}%`,
        );
        event.currentTarget.style.setProperty(
          "--pointer-y",
          `${((event.clientY - rect.top) / rect.height) * 100}%`,
        );
        x.set(
          (-(event.clientY - rect.top - rect.height / 2) / rect.height) * 10,
        );
        y.set(((event.clientX - rect.left - rect.width / 2) / rect.width) * 12);
      }}
      onPointerLeave={() => {
        if (!tilt) return;
        x.set(0);
        y.set(0);
      }}
    >
      <div
        className="device-stage"
        data-parallax="image"
        style={{ "--project-accent": project.accent } as React.CSSProperties}
      >
        {presentation.artwork ? (
          <m.div className="artwork-composition" style={{ rotateX, rotateY }}>
            <Image
              loading="eager"
              fetchPriority="low"
              src={project.screenshots[0].src}
              {...imagePreview(project.screenshots[0].src)}
              alt={project.screenshots[0].alt}
              fill
              sizes="(max-width:767px) 90vw, (max-width:1439px) 55vw, 740px"
            />
            <span className="artwork-light" aria-hidden="true" />
          </m.div>
        ) : (
          <>
            <div className="device-floor" />
            <div className="device-float">
              <m.div
                className="device-composition"
                style={{ rotateX, rotateY }}
              >
                <div className="device-laptop">
                  <div className="device-laptop-lid">
                    <span className="device-camera" />
                    <div className="device-screen">
                      <Image
                        loading="eager"
                        fetchPriority="low"
                        src={project.screenshots[0].src}
                        {...imagePreview(project.screenshots[0].src)}
                        alt={project.screenshots[0].alt}
                        fill
                        sizes="(max-width:767px) 80vw, (max-width:1439px) 45vw, 610px"
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
                      loading="eager"
                      fetchPriority="low"
                      src={mobile.src}
                      {...imagePreview(mobile.src)}
                      alt={mobile.alt}
                      fill
                      sizes="(max-width:767px) 23vw, (max-width:1439px) 13vw, 180px"
                    />
                    <span className="device-reflection" />
                  </div>
                  <span className="device-phone-notch" />
                </div>
              </m.div>
            </div>
          </>
        )}
      </div>
      <div className="project-title-row">
        <h3>{project.title}</h3>
        <span>
          Explore <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
``````

## components/project-gallery.tsx

``````tsx
"use client";

import Image from "next/image";
import { imagePreview } from "@/lib/image-preview";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, X } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { projectPresentation } from "@/data/project-presentation";

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
  const presentation = projectPresentation(project.id);

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
              {presentation.label} · {project.industry}
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
              {...imagePreview(image.src)}
              alt={image.alt}
              fill
              sizes="(max-width: 700px) 100vw, 1200px"
              className={loaded ? "loaded" : ""}
              loading="eager"
              onLoad={() => setLoaded(true)}
              onError={() => {
                setFailed(true);
                setLoaded(true);
              }}
            />
          )}
          <button
            className="gallery-arrow gallery-prev"
            hidden={count < 2}
            onClick={() => go(index - 1)}
            aria-label={site.ui.previous}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="gallery-arrow gallery-next"
            hidden={count < 2}
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
          hidden={count < 2}
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
              <Image
                src={screenshot.src}
                {...imagePreview(screenshot.src)}
                alt=""
                fill
                sizes="100px"
              />
              <span>{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="gallery-details">
          <div>
            <Link className="gallery-demo-link" href={`/work/${project.id}`}>
              Read project notes
            </Link>
            <p id="gallery-description">{project.description}</p>
            {project.demoUrl && (
              <Link
                className="gallery-demo-link"
                href={project.demoUrl}
                target={
                  project.demoUrl.startsWith("https://") ? "_blank" : undefined
                }
                rel={
                  project.demoUrl.startsWith("https://")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {presentation.visitLabel} ↗
              </Link>
            )}
          </div>
          {project.stack.length > 0 && (
            <div>
              <span className="eyebrow">{site.ui.stack}</span>
              <ul>
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="gallery-highlights">
          <span className="eyebrow">{site.ui.highlights}</span>
          <ul>
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <p className="gallery-help">
          {presentation.visualNote}
          <br />
          {count > 1 ? site.ui.galleryHelp : site.ui.gallerySingleHelp}
        </p>
      </div>
    </dialog>
  );
}
``````

## components/reading-effects.tsx

``````tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

export function ReadingEffects() {
  const { reduced } = useMotionPreference();
  const pathname = usePathname();
  useEffect(() => {
    if (reduced) return;
    const paragraphs = [
      ...document.querySelectorAll<HTMLElement>("[data-reading-text]"),
    ];
    const records = new Map(
      paragraphs.map((element) => [
        element,
        {
          words: [...element.querySelectorAll<HTMLElement>(".reading-word")],
          count: 0,
        },
      ]),
    );
    const visible = new Set<HTMLElement>();
    const update = (viewport: number) => {
      const changes = [...visible].map((element) => {
        const rect = element.getBoundingClientRect();
        const record = records.get(element)!;
        const progress = Math.max(
          0,
          Math.min(1, (viewport * 0.65 - rect.top) / Math.max(1, rect.height)),
        );
        return {
          element,
          record,
          count: Math.round(progress * record.words.length),
        };
      });
      for (const { record, count } of changes) {
        for (
          let index = Math.min(record.count, count);
          index < Math.max(record.count, count);
          index++
        )
          record.words[index].classList.toggle("is-read", index < count);
        record.count = count;
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        }
        update(window.innerHeight);
      },
      { rootMargin: "15% 0px" },
    );
    for (const element of paragraphs) {
      element.dataset.readingActive = "true";
      observer.observe(element);
    }
    const unsubscribe = subscribeScroll(({ viewport }) => update(viewport));
    return () => {
      unsubscribe();
      observer.disconnect();
      for (const [element, record] of records) {
        delete element.dataset.readingActive;
        for (const word of record.words) word.classList.remove("is-read");
      }
    };
  }, [reduced, pathname]);
  return null;
}
``````

## components/reading-text.tsx

``````tsx
/** The base words stay readable; an ink layer adds emphasis without changing text widths. */
export function ReadingText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={`reading-text ${className}`} data-reading-text>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/\s+/).map((word, index) => (
          <span
            key={index}
            className="reading-word reading-base"
            data-word={word}
          >
            {word}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
``````

## components/reveal-observer.tsx

``````tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMotionPreference } from "./motion-preference";

/** Page content is present and readable immediately, never gated by scrolling. */
export function RevealObserver() {
  const { reduced } = useMotionPreference();
  const pathname = usePathname();
  useEffect(() => {
    if (reduced) delete document.documentElement.dataset.motionReveals;
    else document.documentElement.dataset.motionReveals = "enabled";
    for (const element of document.querySelectorAll("[data-reveal]"))
      element.classList.add("is-revealed");
  }, [reduced, pathname]);
  return null;
}
``````

## components/reveal.tsx

``````tsx
import type { CSSProperties, ReactNode } from "react";
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal="block"
      className={`motion-reveal ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
``````

## components/scroll-ambience.tsx

``````tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

export function ScrollAmbience() {
  const wash = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  const pathname = usePathname();
  useEffect(() => {
    if (reduced) return;
    const scene = wash.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const animations = [
      ...document.querySelectorAll<HTMLElement>("[data-velocity-marquee]"),
    ].flatMap((element) => element.getAnimations());
    const marquees = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          (entry.target as HTMLElement).dataset.scrollVisible = String(
            entry.isIntersecting,
          );
      },
      { rootMargin: "120px" },
    );
    for (const element of document.querySelectorAll("[data-velocity-marquee]"))
      marquees.observe(element);
    const visible = new Set<HTMLElement>();
    const watched = new Set<HTMLElement>();
    const images = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        }
      },
      { rootMargin: "80px" },
    );
    const scan = () => {
      for (const element of watched)
        if (!element.isConnected) {
          images.unobserve(element);
          watched.delete(element);
          visible.delete(element);
        }
      for (const element of document.querySelectorAll<HTMLElement>(
        "[data-parallax]",
      )) {
        if (!watched.has(element)) {
          watched.add(element);
          images.observe(element);
        }
      }
    };
    scan();
    let reset: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeScroll(({ viewport, velocity }) => {
      const moves: [HTMLElement, number][] = [];
      if (fine.matches)
        for (const element of visible) {
          if (!element.isConnected) {
            visible.delete(element);
            continue;
          }
          const rect = element.getBoundingClientRect();
          const distance = Math.max(
            -1,
            Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / viewport),
          );
          moves.push([element, distance * Math.min(28, rect.height * 0.035)]);
        }
      for (const [element, distance] of moves)
        element.style.setProperty("--image-drift", `${distance}px`);
      const rate = 1 + Math.min(1.2, Math.abs(velocity) * 0.3);
      for (const animation of animations) animation.updatePlaybackRate(rate);
      clearTimeout(reset);
      reset = setTimeout(() => {
        for (const animation of animations) animation.updatePlaybackRate(1);
      }, 180);
    });
    const scenes = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting && scene)
            scene.style.opacity = ["work", "work-bunch", "contact"].includes(
              entry.target.id,
            )
              ? ".12"
              : ".035";
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );
    for (const element of document.querySelectorAll("main > section[id]"))
      scenes.observe(element);
    return () => {
      unsubscribe();
      images.disconnect();
      marquees.disconnect();
      for (const element of document.querySelectorAll<HTMLElement>(
        "[data-scroll-visible]",
      ))
        delete element.dataset.scrollVisible;
      scenes.disconnect();
      clearTimeout(reset);
      for (const element of watched)
        element.style.removeProperty("--image-drift");
      for (const animation of animations) animation.updatePlaybackRate(1);
      if (scene) scene.style.opacity = "0";
    };
  }, [reduced, pathname]);
  return <div ref={wash} className="scene-wash" aria-hidden="true" />;
}
``````

## components/scroll-progress.tsx

``````tsx
"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

export function ScrollProgress() {
  const progress = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const journey = document.querySelector<HTMLElement>(
      ".journey-editorial-list",
    );
    return subscribeScroll(({ y, height, viewport }) => {
      const amount = Math.min(
        1,
        Math.max(0, y / Math.max(1, height - viewport)),
      );
      const rect = journey?.getBoundingClientRect();
      const journeyAmount = rect
        ? Math.min(1, Math.max(0, (viewport * 0.7 - rect.top) / rect.height))
        : 0;
      if (progress.current)
        progress.current.style.transform = `scaleX(${amount})`;
      journey?.style.setProperty(
        "--journey-progress",
        String(reduced ? 1 : journeyAmount),
      );
    });
  }, [reduced]);
  return <div ref={progress} className="scroll-progress" aria-hidden="true" />;
}
``````

## components/site-shell.tsx

``````tsx
import type { ReactNode } from "react";
import { getIdentity } from "@/lib/content-loader";
import type { PortfolioPage } from "@/data/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { PageTabs } from "./page-tabs";
import { ScrollProgress } from "./scroll-progress";
import { EditorialEffects } from "./editorial-effects";
import { ScrollAmbience } from "./scroll-ambience";
import { ReadingEffects } from "./reading-effects";

export async function SiteShell({
  children,
  page,
}: {
  children: ReactNode;
  page?: PortfolioPage;
}) {
  const identity = await getIdentity();
  return (
    <div
      id="top"
      className={`portfolio-shell${page ? ` route-page route-${page}` : " route-home"}`}
    >
      <ScrollProgress />
      <EditorialEffects />
      <ScrollAmbience />
      <ReadingEffects />
      <Navbar identity={identity} />
      {page && <PageTabs page={page} />}
      <main id="main-content">{children}</main>
      <Footer brand={identity.brand} email={identity.email} />
    </div>
  );
}
``````

## components/skills.tsx

``````tsx
import { skillContent as copy, type Skill } from "@/data/skills";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { ToolMark } from "./tool-mark";
import { studio } from "@/data/studio";
import {
  Braces,
  CheckCheck,
  Database,
  GitBranch,
  Mic,
  Waypoints,
} from "lucide-react";

const categoryIcons = [Waypoints, CheckCheck, Braces, Database, Mic, GitBranch];

export function Skills({ skills }: { skills: Skill[] }) {
  const purpose = new Map<string, string>(
    studio.tools.items.map((tool) => [tool.name, tool.purpose]),
  );
  return (
    <section
      id="skills"
      className="container skills-section toolkit-section"
      aria-labelledby="skills-title"
    >
      <span id="creative-toolkit" className="section-anchor" />
      <div className="toolkit-heading">
        <div>
          <Reveal>
            <p className="eyebrow">{copy.eyebrow}</p>
          </Reveal>
          <TextReveal as="h1" id="skills-title" text={copy.title} />
        </div>
        <Reveal>
          <p>
            {copy.description}
            <br />
            {studio.tools.intro}
          </p>
        </Reveal>
      </div>
      <div className="toolkit-rows">
        {copy.categories.map((category, index) => {
          const Icon = categoryIcons[index];
          const label =
            copy.categoryLabels[category as keyof typeof copy.categoryLabels] ||
            category;
          return (
            <Reveal key={category}>
              <div className="toolkit-row">
                <h3>
                  <span className="toolkit-index">0{index + 1}</span>
                  {label}
                </h3>
                <ul aria-label={label}>
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
                        {category === "AI tools" ||
                        category === "Web interfaces" ||
                        category === "Development tools" ? (
                          <ToolMark name={skill.name} />
                        ) : (
                          <span
                            className="toolkit-topic-icon"
                            aria-hidden="true"
                          >
                            <Icon size={23} strokeWidth={1.3} />
                          </span>
                        )}
                        <span>
                          {skill.name}
                          {purpose.has(skill.name) && (
                            <small className="tool-purpose">
                              {purpose.get(skill.name)}
                            </small>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="tool-marquee" aria-hidden="true">
        <div data-velocity-marquee>
          {[0, 1].map((duplicate) => (
            <span key={duplicate}>
              {studio.tools.items.map((tool) => (
                <span key={tool.name}>
                  {tool.name}
                  <i>✳</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <p className="skills-note">{copy.note}</p>
      <p className="studio-note">
        {studio.tools.note} The tools are powerful. The decisions are human.
      </p>
    </section>
  );
}
``````

## components/social-links.tsx

``````tsx
import { ArrowUpRight, Github, Instagram } from "lucide-react";
import { studio } from "@/data/studio";
export function SocialLinks({ iconsOnly = false }: { iconsOnly?: boolean }) {
  return (
    <ul className={`social-links${iconsOnly ? " social-icons" : ""}`}>
      {studio.socials.map((social) => {
        const Icon = social.icon === "github" ? Github : Instagram;
        return (
          <li key={social.name}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                iconsOnly ? `${social.name} (opens in a new tab)` : undefined
              }
            >
              <Icon size={18} aria-hidden="true" />
              {!iconsOnly && (
                <>
                  {social.name}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
``````

## components/studio-sections.tsx

``````tsx
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Braces,
  Check,
  CheckCheck,
  Layers3,
  Search,
  Sparkles,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { studio } from "@/data/studio";
import type { Service } from "@/data/agency";
export { WorkBunch } from "./work-bunch";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { ToolMark } from "./tool-mark";
import { ReadingText } from "./reading-text";
const serviceIcons = [Braces, Bot, WorkflowIcon, Search];

export function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      className="container studio-section services-section reference-services"
      aria-labelledby="services-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">01 / {studio.services.eyebrow}</p>
        </Reveal>
        <TextReveal as="h1" id="services-title" text={studio.services.title} />
        <Reveal>
          <ReadingText text={studio.services.intro} />
        </Reveal>
      </div>
      <div className="studio-services">
        {services.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];
          return (
            <Reveal key={service.id} delay={(index % 2) * 0.08}>
              <article className={`studio-service service-${service.id}`}>
                <span className="reference-service-icon">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <p className="service-detail">{service.detail}</p>
                <a
                  className="service-learn"
                  href={`/services/${service.id}`}
                  aria-label={`Service details: ${service.title}`}
                >
                  Service details
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
export function Workflow() {
  const icons = [Search, Layers3, Braces, CheckCheck, Sparkles];
  return (
    <section
      id="workflow"
      className="container studio-section reference-workflow website-workflow"
      aria-labelledby="workflow-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">{studio.workflow.eyebrow}</p>
        </Reveal>
        <TextReveal as="h2" id="workflow-title" text={studio.workflow.title} />
        <Reveal>
          <ReadingText text={studio.workflow.intro} />
        </Reveal>
      </div>
      <div className="workflow-cards">
        {studio.workflow.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <Reveal key={step.title} delay={index * 0.07}>
              <article className="workflow-step">
                <span className="workflow-number">{index + 1}</span>
                <Icon
                  size={18}
                  className="workflow-card-icon"
                  aria-hidden="true"
                />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <small>
                  <ArrowDownRight size={13} aria-hidden="true" />
                  {step.note}
                </small>
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal>
        <p className="workflow-caption">{studio.workflow.label}</p>
      </Reveal>
    </section>
  );
}
export function Journey() {
  return (
    <section
      id="journey"
      className="container studio-section editorial-journey"
      aria-labelledby="journey-title"
    >
      <div className="journey-editorial-heading">
        <Reveal>
          <p className="eyebrow">{studio.journey.eyebrow}</p>
        </Reveal>
        <TextReveal
          as="h1"
          id="journey-title"
          className="split-display"
          text={studio.journey.displayTitle}
        />
        <Reveal className="journey-story-intro">
          <h3>{studio.journey.title.replaceAll("\n", " ")}</h3>
          <p>{studio.journey.intro}</p>
        </Reveal>
      </div>
      <div className="journey-editorial-list">
        {studio.journey.chapters.map((chapter, index) => (
          <Reveal key={chapter.title} delay={0.03}>
            <article className="journey-editorial-entry">
              <span className="journey-entry-index" aria-hidden="true">
                0{index + 1}
              </span>
              <header>
                <div>
                  <span className="journey-entry-label">{chapter.label}</span>
                  <h3>{chapter.title}</h3>
                </div>
                <span className="journey-entry-phase">
                  {chapter.phase}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </header>
              <p>{chapter.description}</p>
              <ul>
                {chapter.points.map((point) => (
                  <li key={point}>
                    <Check size={14} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="journey-signature">
          {studio.journey.note}
          <span aria-hidden="true">
            <ArrowUpRight size={28} strokeWidth={1.4} />
          </span>
        </p>
      </Reveal>
    </section>
  );
}

export function ToolOrbit() {
  return (
    <section
      id="creative-toolkit"
      className="container studio-section premium-tool-section"
      aria-labelledby="tool-title"
    >
      <div className="premium-tool-heading">
        <div>
          <Reveal>
            <p className="eyebrow">{studio.tools.eyebrow}</p>
          </Reveal>
          <TextReveal
            id="tool-title"
            className="split-display"
            text={studio.tools.title}
          />
        </div>
        <Reveal>
          <p className="premium-tool-intro">
            {studio.tools.intro}
            <span>
              The tools are powerful.
              <br />
              The decisions are human.
            </span>
          </p>
        </Reveal>
      </div>
      <div className="premium-tool-grid">
        {studio.tools.items.map((tool, index) => (
          <Reveal key={tool.name} delay={(index % 2) * 0.06}>
            <article className="premium-tool-item">
              <span className="premium-tool-logo">
                <ToolMark name={tool.name} />
              </span>
              <div>
                <h3>{tool.name}</h3>
                <p>{tool.purpose}</p>
              </div>
              <span className="premium-tool-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="studio-note">{studio.tools.note}</p>
    </section>
  );
}
``````

## components/testimonial-scene.tsx

``````tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Pause, Play } from "lucide-react";
import { useMotionPreference } from "./motion-preference";

const stars = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 37 + 7) % 100}%`,
  top: `${(index * 23 + 4) % 100}%`,
  duration: `${11 + (index % 7)}s`,
  delay: `${-index * 1.7}s`,
  size: `${index % 4 === 0 ? 3 : 2}px`,
}));

export function TestimonialScene({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  const scene = useRef<HTMLElement>(null);
  const { reduced } = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "60px" },
    );
    observer.observe(element);
    const changed = () => setForeground(!document.hidden);
    changed();
    document.addEventListener("visibilitychange", changed);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", changed);
    };
  }, []);
  return (
    <section
      ref={scene}
      id="testimonials"
      className="container testimonials-section testimonials-page testimonial-scene"
      aria-labelledby="testimonials-title"
      data-testimonials-active={visible && foreground && !reduced && !paused}
    >
      <div className="testimonial-atmosphere" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            className="testimonial-star"
            key={index}
            style={
              {
                left: star.left,
                top: star.top,
                "--star-duration": star.duration,
                "--star-delay": star.delay,
                "--star-size": star.size,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {heading}
      <div className="testimonial-motion-toolbar">
        <button
          type="button"
          className="testimonial-motion-toggle"
          disabled={reduced}
          aria-label={
            paused
              ? "Resume testimonial animations"
              : "Pause testimonial animations"
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused || reduced ? (
            <Play size={13} aria-hidden="true" />
          ) : (
            <Pause size={13} aria-hidden="true" />
          )}
          {reduced
            ? "Motion off"
            : paused
              ? "Resume animation"
              : "Pause animation"}
        </button>
      </div>
      {children}
    </section>
  );
}
``````

## components/testimonials.tsx

``````tsx
import Image from "next/image";
import { UserRound } from "lucide-react";
import type { CSSProperties } from "react";
import type { Testimonial } from "@/data/agency";
import { testimonialSamples } from "@/data/testimonial-samples";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { TestimonialScene } from "./testimonial-scene";

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const preview = testimonials.length === 0;
  const reviews = preview ? testimonialSamples : testimonials;
  return (
    <TestimonialScene
      heading={
        <Reveal>
          <div className="testimonials-heading">
            <p className="eyebrow">PEOPLE / PROJECTS / PERSPECTIVE</p>
            <TextReveal as="h1" id="testimonials-title" text="Testimonials." />
            <p className="testimonials-subtitle">
              What people say about working with me.
            </p>
            {preview && (
              <p className="testimonial-sample-note">
                Design preview: fictional profiles and illustrative reviews, not
                client endorsements.
              </p>
            )}
          </div>
        </Reveal>
      }
    >
      <div className="testimonials-grid">
        {reviews.map((review, index) => (
          <Reveal key={review.id} delay={(index % 4) * 0.07}>
            <div
              className="testimonial-float"
              style={
                {
                  "--review-duration": `${13 + (index % 4) * 2}s`,
                  "--review-delay": `${-index * 2.3}s`,
                  "--review-angle": `${index % 2 ? 0.65 : -0.65}deg`,
                } as CSSProperties
              }
            >
              <figure
                className="testimonial-card"
                data-sample={review.placeholder ? "true" : undefined}
              >
                <span className="testimonial-quote-mark" aria-hidden="true">
                  “
                </span>
                {review.placeholder && (
                  <span className="testimonial-sample-label">
                    FICTIONAL EXAMPLE
                  </span>
                )}
                <blockquote>{review.quote}</blockquote>
                <figcaption>
                  <span className="testimonial-avatar">
                    {review.portrait ? (
                      <Image
                        loading="eager"
                        fetchPriority="low"
                        src={review.portrait}
                        alt=""
                        width={44}
                        height={44}
                      />
                    ) : (
                      <UserRound
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span>
                    <strong>{review.name}</strong>
                    <small>{review.role}</small>
                  </span>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        ))}
      </div>
    </TestimonialScene>
  );
}
``````

## components/text-reveal.tsx

``````tsx
import type { CSSProperties } from "react";
export function TextReveal({
  text,
  as = "h2",
  id,
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}) {
  const Heading = as;
  let wordIndex = 0;
  return (
    <Heading
      id={id}
      className={`text-reveal ${className}`}
      aria-label={text.replaceAll("\n", " ")}
      data-reveal={as === "h1" ? undefined : "words"}
    >
      {text.split("\n").map((line, lineIndex) => (
        <span className="text-reveal-line" aria-hidden="true" key={lineIndex}>
          {line.split(" ").map((word, index) => (
            <span className="word-mask" key={index}>
              <span
                className="motion-word"
                style={
                  { "--word-delay": `${wordIndex++ * 0.035}s` } as CSSProperties
                }
              >
                {word}
              </span>
              {index < line.split(" ").length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </Heading>
  );
}
``````

## components/tool-mark.tsx

``````tsx
import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { toolMarks } from "@/data/tool-marks";

export function ToolMark({ name }: { name: string }) {
  const mark = toolMarks[name];
  return (
    <span
      className={`tool-brand-mark${mark?.icon ? " has-brand-icon" : ""}`}
      aria-hidden="true"
      style={
        {
          ...(mark?.icon
            ? { "--mark-image": `url('/tool-marks/${mark.icon}.svg')` }
            : {}),
        } as CSSProperties
      }
    >
      {mark?.icon ? (
        <i />
      ) : mark?.text ? (
        <b>{mark.text}</b>
      ) : (
        <Sparkles size={23} strokeWidth={1.4} />
      )}
    </span>
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

## components/work-bunch.tsx

``````tsx
"use client";

import Image from "next/image";
import { imagePreview } from "@/lib/image-preview";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { studio } from "@/data/studio";
import { studies } from "@/data/studies";
import type { ProjectView } from "@/data/projects";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

export function WorkBunch({
  projects,
  standalone = false,
}: {
  projects: ProjectView[];
  standalone?: boolean;
}) {
  const gallery = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  const selected = projects.slice(0, 4);
  const previews = [
    ...selected.flatMap((project) =>
      project.screenshots
        .filter((_, index) => index !== 2)
        .map((shot, index) => ({
          id: `${project.id}-${index}`,
          title: project.title,
          image: shot.src,
          href: project.demoUrl,
        })),
    ),
    ...studies.map((study) => ({
      id: study.id,
      title: study.name,
      image: study.screenshot,
      href: `/studies/${study.id}`,
    })),
  ];
  const links = [
    ...selected.map((project) => ({
      id: project.id,
      title: project.title,
      href: project.demoUrl,
    })),
    ...studies.map((study) => ({
      id: study.id,
      title: study.name,
      href: `/studies/${study.id}`,
    })),
  ];
  useEffect(() => {
    const element = gallery.current;
    if (!element) return;
    const cylinder = element.querySelector<HTMLElement>(".dome-cylinder");
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.visible = String(entry.isIntersecting);
      },
      { rootMargin: "80px" },
    );
    observer.observe(element);
    const unsubscribe = reduced
      ? undefined
      : subscribeScroll(({ viewport }) => {
          if (element.dataset.visible !== "true") return;
          const rect = element.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > viewport) return;
          const amount =
            (viewport / 2 - (rect.top + rect.height / 2)) / viewport;
          // Move one composited surface; an inherited variable invalidated all 54 tiles.
          if (cylinder)
            cylinder.style.transform = `translateZ(calc(-1 * var(--dome-radius))) rotateZ(-4deg) translateY(${Math.max(-20, Math.min(20, amount * 24))}px)`;
        });
    return () => {
      observer.disconnect();
      unsubscribe?.();
      cylinder?.style.removeProperty("transform");
    };
  }, [reduced]);

  return (
    <section
      id="work-bunch"
      className={`studio-section dome-showcase${standalone ? " collection-page" : ""}`}
      aria-labelledby="bunch-title"
    >
      <div className="container dome-heading">
        <div>
          <Reveal>
            <p className="eyebrow">{studio.bunch.eyebrow}</p>
          </Reveal>
          <TextReveal
            as={standalone ? "h1" : "h2"}
            id="bunch-title"
            text={studio.bunch.title}
          />
          <Reveal>
            <p className="dome-intro">{studio.bunch.intro}</p>
          </Reveal>
        </div>
        <a href="/websites" className="dome-view-all">
          Explore the work <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
      {/* Repeated views create the visual surface. The index below exposes every unique destination once. */}
      <div
        ref={gallery}
        className="dome-gallery"
        data-still={reduced}
        aria-hidden="true"
      >
        <div className="dome-cylinder">
          {Array.from({ length: 9 }, (_, column) => (
            <div
              className="dome-column"
              key={column}
              style={
                {
                  "--column-angle": `${(column - 4) * 13}deg`,
                  "--column-offset": `${[0, -44, 20, -30, 10, -55, 22, -35, 0][column]}px`,
                  "--column-duration": `${26 + (column % 3) * 5}s`,
                  "--column-direction":
                    column % 2 ? "alternate-reverse" : "alternate",
                } as CSSProperties
              }
            >
              <div className="dome-stack">
                <div className="dome-strip">
                  {Array.from({ length: 6 }, (_, row) => {
                    const item =
                      previews[(column * 5 + row * 3) % previews.length];
                    return (
                      <a
                        href={item.href}
                        key={`${item.id}-${row}`}
                        className="dome-tile"
                        tabIndex={-1}
                      >
                        <Image
                          loading="eager"
                          fetchPriority="low"
                          src={item.image}
                          {...imagePreview(item.image)}
                          alt=""
                          fill
                          sizes="(max-width: 600px) 112px, (max-width: 1100px) 180px, 260px"
                        />
                        <span>
                          {item.title}
                          <ArrowUpRight size={12} />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="dome-vignette" />
        <span className="dome-signature">
          DIFFERENT WORLDS. ONE POINT OF VIEW.
        </span>
      </div>
      <div className="container dome-bottom">
        <div className="dome-bottom-heading">
          <p className="eyebrow">
            THE COLLECTION / {String(links.length).padStart(2, "0")} PROJECTS &
            STUDIES
          </p>
          <span>Choose a world to explore.</span>
        </div>
        <nav className="dome-index" aria-label="Explore the showcase projects">
          {links.map((link, index) => (
            <a key={link.id} href={link.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {link.title}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <p className="studio-note">{studio.bunch.note}</p>
      </div>
    </section>
  );
}
``````

## components/work.tsx

``````tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getImageProps } from "next/image";
import { concepts } from "@/data/concepts";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";
import { TextReveal } from "./text-reveal";
import { WorkShowcaseVideo } from "./WorkShowcaseVideo";
import Gallery from "./project-gallery";

export function Work({ projects }: { projects: ProjectView[] }) {
  const router = useRouter();
  useEffect(() => {
    for (const item of projects) {
      if (!item.demoUrl.startsWith("/demo/")) continue;
      router.prefetch(item.demoUrl);
      const slug = item.demoUrl.slice("/demo/".length) as keyof typeof concepts;
      if (!Object.hasOwn(concepts, slug)) continue;
      const { props } = getImageProps({
        src: concepts[slug].image,
        alt: "",
        fill: true,
        sizes: ["solenne", "vanta"].includes(slug)
          ? "100vw"
          : "(max-width:700px) 100vw, 70vw",
      });
      const image = new window.Image();
      image.fetchPriority = "low";
      image.decoding = "async";
      image.sizes = props.sizes || "100vw";
      image.srcset = props.srcSet || "";
      image.src = props.src;
    }
  }, [projects, router]);
  const [project, setProject] = useState<ProjectView | null>(null);
  return (
    <section
      id="work"
      className="container work-section"
      aria-labelledby="work-title"
    >
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / SELECTED EXPLORATIONS</p>
            <TextReveal as="h1" id="work-title" text={site.work.title} />
          </div>
          <p>{site.work.description}</p>
        </div>
      </Reveal>
      <WorkShowcaseVideo />
      <div className="projects-grid curated-projects-grid">
        {projects.map((item) => (
          <Reveal key={item.id}>
            <ProjectCard project={item} />
            <button
              className="project-screenshots-link"
              aria-haspopup="dialog"
              aria-label={`View screenshots: ${item.title}`}
              onClick={() => setProject(item)}
            >
              View screenshots <ArrowUpRight size={13} aria-hidden="true" />
            </button>
          </Reveal>
        ))}
      </div>
      <p className="work-disclaimer">
        {site.work.disclaimer}
        <br />
        <span>{site.work.screenshotNote}</span>
      </p>
      {project && (
        <Gallery project={project} onClose={() => setProject(null)} />
      )}
    </section>
  );
}
``````
