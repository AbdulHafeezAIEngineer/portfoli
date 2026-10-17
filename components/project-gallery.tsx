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
