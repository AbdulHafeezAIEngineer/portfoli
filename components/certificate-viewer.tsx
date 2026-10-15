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
