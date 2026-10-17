"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getImageProps } from "next/image";
import { concepts } from "@/data/concepts";
import type { ProjectView } from "@/data/projects";
import type { Bot as BotData } from "@/data/bots";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";
import { TextReveal } from "./text-reveal";
import { WorkShowcaseVideo } from "./WorkShowcaseVideo";
import { BotServices } from "./bot-services";
import Gallery from "./project-gallery";

const categories = [
  { id: "all", title: "All" },
  { id: "web", title: "Website concepts" },
  { id: "bots", title: "AI chatbots & demos" },
] as const;

export function Work({
  projects,
  bots,
}: {
  projects: ProjectView[];
  bots: BotData[];
}) {
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
  const [tab, setTab] = useState(0);
  const [project, setProject] = useState<ProjectView | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const counts = [projects.length + bots.length, projects.length, bots.length];
  useEffect(() => {
    const sync = () => {
      if (["#ai-bots", "#embed-methods"].includes(location.hash)) setTab(2);
      else if (location.hash === "#work") setTab(0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (tab !== 2 || !["#ai-bots", "#embed-methods"].includes(location.hash))
      return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(location.hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [tab]);
  function selectTab(next: number) {
    setTab(next);
    if (next !== 2 && ["#ai-bots", "#embed-methods"].includes(location.hash))
      history.replaceState(null, "", "#work");
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
            <p className="eyebrow">02 / SELECTED EXPLORATIONS</p>
            <TextReveal id="work-title" text={site.work.title} />
          </div>
          <p>{site.work.description}</p>
        </div>
      </Reveal>
      <WorkShowcaseVideo />
      <div
        className="work-filters"
        role="tablist"
        aria-label="Portfolio categories"
      >
        {categories.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            id={`tab-${item.id}`}
            role="tab"
            aria-selected={tab === index}
            aria-controls="work-results"
            tabIndex={tab === index ? 0 : -1}
            onClick={() => selectTab(index)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? categories.length - 1
                    : (tab +
                        (event.key === "ArrowRight"
                          ? 1
                          : categories.length - 1)) %
                      categories.length;
              selectTab(next);
              tabs.current[next]?.focus();
            }}
          >
            {item.title}
            <span>{String(counts[index]).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      {/* Content mounts once in the initial HTML. Filters change visibility only. */}
      <div
        role="tabpanel"
        id="work-results"
        aria-labelledby={`tab-${categories[tab].id}`}
        tabIndex={0}
        className="work-panel"
      >
        <div hidden={tab === 2}>
          <div className="work-collection-label">
            <span>THE WEBSITE EDIT</span>
            <span>
              {String(projects.length).padStart(2, "0")} / INDEPENDENT CONCEPTS
            </span>
          </div>
          <div className="projects-grid curated-projects-grid">
            {projects.map((item, number) => (
              <Reveal key={item.id}>
                <ProjectCard
                  project={item}
                  index={number}
                  total={projects.length}
                />
                <button
                  className="project-screenshots-link"
                  aria-haspopup="dialog"
                  aria-label={`View screenshots: ${item.title}`}
                  onClick={() => setProject(item)}
                >
                  View screenshots <span aria-hidden="true">↗</span>
                </button>
              </Reveal>
            ))}
          </div>
          <p className="work-disclaimer">
            {site.work.disclaimer}
            <br />
            <span>{site.work.screenshotNote}</span>
          </p>
        </div>
        <div hidden={tab === 1}>
          <BotServices bots={bots} />
        </div>
      </div>
      {project && (
        <Gallery project={project} onClose={() => setProject(null)} />
      )}
    </section>
  );
}
