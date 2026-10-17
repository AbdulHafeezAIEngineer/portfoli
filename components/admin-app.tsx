"use client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
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
export function AdminApp({ section }: { section: string }) {
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
  if (section === "login") return <AdminLogin />;
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
