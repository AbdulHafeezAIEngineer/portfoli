"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import type { Bot as BotData } from "@/data/bots";
import { studies } from "@/data/studies";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";
import { TextReveal } from "./text-reveal";

const BotServices = dynamic(
  () => import("./bot-services").then((m) => m.BotServices),
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
const categories = [
  { id: "all", title: "All" },
  { id: "web", title: "Website concepts" },
  { id: "studies", title: "UI / interface studies" },
  { id: "bots", title: "AI chatbots & demos" },
];

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
  const counts = [
    projects.length + studies.length + bots.length,
    projects.length,
    studies.length,
    bots.length,
  ];
  useEffect(() => {
    const sync = () => {
      if (["#ai-bots", "#embed-methods"].includes(location.hash)) {
        setTab(3);
        setBotsVisited(true);
      } else if (location.hash === "#work") setTab(0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (tab !== 3 || !["#ai-bots", "#embed-methods"].includes(location.hash))
      return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(location.hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [tab]);
  function selectTab(next: number) {
    setTab(next);
    if (next === 3) setBotsVisited(true);
    else if (["#ai-bots", "#embed-methods"].includes(location.hash))
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
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 3
                      : (tab + (event.key === "ArrowRight" ? 1 : 3)) % 4;
                selectTab(next);
                tabs.current[next]?.focus();
              }}
            >
              {item.title}
              <span>{String(counts[index]).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </Reveal>
      {/* Hidden panels remain valid ARIA targets; only the active panel renders expensive content. */}
      {categories.map((category, index) => (
        <div
          key={category.id}
          role="tabpanel"
          id={`panel-${category.id}`}
          aria-labelledby={`tab-${category.id}`}
          hidden={tab !== index}
          tabIndex={0}
          className="work-panel"
        >
          {tab === index && (
            <>
              {(index === 0 || index === 1) && (
                <div className="projects-grid work-filter-enter">
                  {projects.map((item, number) => (
                    <Reveal key={item.id} delay={(number % 2) * 0.06}>
                      <ProjectCard
                        project={item}
                        index={number}
                        total={projects.length}
                        onOpen={() => setProject(item)}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
              {(index === 0 || index === 2) && (
                <div className="interface-study-section work-filter-enter">
                  <p className="eyebrow">
                    INTERFACE STUDIES / SIX DIFFERENT DIRECTIONS
                  </p>
                  <div className="interface-studies-grid">
                    {studies.map((study, number) => (
                      <Reveal key={study.id} delay={(number % 2) * 0.05}>
                        <a
                          className="interface-study-card"
                          href={`/studies/${study.id}`}
                        >
                          <div className="interface-study-image">
                            <Image
                              src={study.screenshot}
                              alt={`${study.name}: ${study.industry.toLowerCase()} interface concept`}
                              fill
                              sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 560px"
                            />
                          </div>
                          <div>
                            <span>
                              <small>{study.industry}</small>
                              <strong>{study.name}</strong>
                            </span>
                            <ArrowUpRight size={22} aria-hidden="true" />
                          </div>
                        </a>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
              {index === 0 && (
                <div className="work-ai-invitation">
                  <div>
                    <p className="eyebrow">INTELLIGENCE / ON DEMAND</p>
                    <h3>Meet the other side of the work.</h3>
                    <p>
                      Explore the custom chatbot and AI demos, with voice and
                      consent-aware experiences.
                    </p>
                  </div>
                  <button
                    className="button button-outline"
                    onClick={() => {
                      selectTab(3);
                      tabs.current[3]?.focus();
                    }}
                  >
                    Explore AI demos{" "}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
              {index !== 3 && (
                <p className="work-disclaimer">
                  {site.work.disclaimer}
                  <br />
                  <span>{site.work.screenshotNote}</span>
                </p>
              )}
              {index === 3 && botsVisited && <BotServices bots={bots} />}
            </>
          )}
        </div>
      ))}
      {project && (
        <Gallery project={project} onClose={() => setProject(null)} />
      )}
    </section>
  );
}
