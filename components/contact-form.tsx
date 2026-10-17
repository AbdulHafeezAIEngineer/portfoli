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
