"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Bot, Code2 } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { ProjectCard } from "./project-card";

import type { Bot as BotData } from "@/data/bots";

const BotServices = dynamic(
  () => import("./bot-services").then((module) => module.BotServices),
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

  useEffect(() => {
    const sync = () => {
      if (["#ai-bots", "#embed-methods"].includes(window.location.hash)) {
        setTab(1);
        setBotsVisited(true);
      } else if (window.location.hash === "#work") setTab(0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (
      tab !== 1 ||
      !["#ai-bots", "#embed-methods"].includes(window.location.hash)
    )
      return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [tab]);
  function selectTab(next: number) {
    setTab(next);
    if (next === 1) setBotsVisited(true);
    if (
      next === 0 &&
      ["#ai-bots", "#embed-methods"].includes(window.location.hash)
    )
      window.history.replaceState(null, "", "#work");
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
            <p className="eyebrow">{site.work.eyebrow}</p>
            <h2 id="work-title">{site.work.title}</h2>
          </div>
          <p>{site.work.description}</p>
        </div>
        <div
          className="service-tabs"
          role="tablist"
          aria-label="Portfolio categories"
        >
          {site.work.tabs.map((item, index) => (
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
                  event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - tab;
                selectTab(next);
                tabs.current[next]?.focus();
              }}
            >
              <span className="tab-icon">
                {index === 0 ? <Code2 size={21} /> : <Bot size={21} />}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
              <span className="tab-count">04</span>
            </button>
          ))}
        </div>
      </Reveal>
      <div
        role="tabpanel"
        id="panel-web"
        aria-labelledby="tab-web"
        hidden={tab !== 0}
        tabIndex={0}
      >
        <div className="projects-grid">
          {projects.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.06}>
              <ProjectCard
                project={item}
                index={index}
                total={projects.length}
                onOpen={() => setProject(item)}
              />
            </Reveal>
          ))}
        </div>
        <p className="work-disclaimer">
          {site.work.disclaimer}
          <br />
          <span>{site.work.screenshotNote}</span>
        </p>
      </div>
      <div
        role="tabpanel"
        id="panel-bots"
        aria-labelledby="tab-bots"
        hidden={tab !== 1}
        tabIndex={0}
      >
        {botsVisited && <BotServices bots={bots} />}
      </div>
      {project && (
        <Gallery project={project} onClose={() => setProject(null)} />
      )}
    </section>
  );
}
