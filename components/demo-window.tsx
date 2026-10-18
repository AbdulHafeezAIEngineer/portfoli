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
        <Link href="/ai-websites">Elvora Studio</Link>
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
            <Link href="/ai-websites">
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
        <Link href="/ai-websites">
          <span aria-hidden="true">
            <PanelTop size={21} />
          </span>
          <small>All work</small>
        </Link>
      </nav>
    </div>
  );
}
