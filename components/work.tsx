"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, Code2 } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { BotServices } from "./bot-services";
import type { Bot as BotData } from "@/data/bots";

const Gallery = dynamic(() => import("./project-gallery"), { ssr: false });

export function Work({ projects, bots }: { projects: ProjectView[]; bots: BotData[] }) {
  const [tab, setTab] = useState(0);
  const [project, setProject] = useState<ProjectView | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const sync = () => {
      if (["#ai-bots", "#embed-methods"].includes(window.location.hash)) setTab(1);
      else if (window.location.hash === "#work") setTab(0);
    };
    sync(); window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (tab !== 1 || !["#ai-bots", "#embed-methods"].includes(window.location.hash)) return;
    const frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [tab]);
  function selectTab(next: number) {
    setTab(next);
    if (next === 0 && ["#ai-bots", "#embed-methods"].includes(window.location.hash)) window.history.replaceState(null, "", "#work");
  }

  return (
    <section id="work" className="container work-section" aria-labelledby="work-title">
      <Reveal>
        <div className="section-heading">
          <div><p className="eyebrow">{site.work.eyebrow}</p><h2 id="work-title">{site.work.title}</h2></div>
          <p>{site.work.description}</p>
        </div>
        <div className="service-tabs" role="tablist" aria-label="Portfolio categories">
          {site.work.tabs.map((item, index) => (
            <button key={item.id} ref={(node) => { tabs.current[index] = node; }} id={`tab-${item.id}`} role="tab" aria-selected={tab === index} aria-controls={`panel-${item.id}`} tabIndex={tab === index ? 0 : -1} onClick={() => selectTab(index)} onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - tab;
              selectTab(next); tabs.current[next]?.focus();
            }}>
              <span className="tab-icon">{index === 0 ? <Code2 size={21} /> : <Bot size={21} />}</span>
              <span><strong>{item.title}</strong><small>{item.detail}</small></span>
              <span className="tab-count">04</span>
            </button>
          ))}
        </div>
      </Reveal>
      <div role="tabpanel" id="panel-web" aria-labelledby="tab-web" hidden={tab !== 0} tabIndex={0}>
        <div className="projects-grid">
          {projects.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.06}>
              <button className="project-card" onClick={() => setProject(item)} aria-haspopup="dialog">
                <div className="browser-frame">
                  <div className="browser-bar" aria-hidden="true"><div className="browser-dots"><i /><i /><i /></div><span>{item.id}.concept</span><ArrowUpRight size={12} /></div>
                  <div className="project-image">
                    <Image src={item.screenshots[0].src} alt={item.screenshots[0].alt} fill sizes="(max-width: 700px) 92vw, (max-width: 1200px) 46vw, 565px" />
                    <span className="image-placeholder-label">{site.ui.placeholder}</span>
                    <span className="project-overlay"><span>{site.work.view}<ArrowUpRight size={19} /></span></span>
                  </div>
                </div>
                <div className="project-info"><div><span className="project-industry">{item.industry}</span><h3>{item.title}</h3><p>{item.subtitle}</p></div><ArrowUpRight className="project-arrow" size={23} aria-hidden="true" /></div>
                <div className="project-footer"><span><i style={{ background: item.accent }} />{site.work.concept}</span><span>0{index + 1} / 04</span></div>
              </button>
            </Reveal>
          ))}
        </div>
        <p className="work-disclaimer">{site.work.disclaimer}<br /><span>{site.work.screenshotNote}</span></p>
      </div>
      <div role="tabpanel" id="panel-bots" aria-labelledby="tab-bots" hidden={tab !== 1} tabIndex={0}>
        <BotServices bots={bots} />
      </div>
      {project && <Gallery project={project} onClose={() => setProject(null)} />}
    </section>
  );
}
