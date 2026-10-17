"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { studio } from "@/data/studio";
import { studies } from "@/data/studies";
import type { ProjectView } from "@/data/projects";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

export function WorkBunch({ projects }: { projects: ProjectView[] }) {
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
          const rect = element.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > viewport) return;
          const amount =
            (viewport / 2 - (rect.top + rect.height / 2)) / viewport;
          element.style.setProperty(
            "--wall-drift",
            `${Math.max(-20, Math.min(20, amount * 24))}px`,
          );
        });
    return () => {
      observer.disconnect();
      unsubscribe?.();
    };
  }, [reduced]);

  return (
    <section
      id="work-bunch"
      className="studio-section dome-showcase"
      aria-labelledby="bunch-title"
    >
      <div className="container dome-heading">
        <div>
          <Reveal>
            <p className="eyebrow">{studio.bunch.eyebrow}</p>
          </Reveal>
          <TextReveal id="bunch-title" text={studio.bunch.title} />
          <Reveal>
            <p className="dome-intro">{studio.bunch.intro}</p>
          </Reveal>
        </div>
        <a href="#work" className="dome-view-all">
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
                          src={item.image}
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
