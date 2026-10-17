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
