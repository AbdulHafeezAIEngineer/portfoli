"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Braces,
  CheckCheck,
  Layers3,
  Search,
  Sparkles,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { studio } from "@/data/studio";
import type { ProjectView } from "@/data/projects";
import { Reveal } from "./reveal";
const serviceIcons = [Braces, Bot, WorkflowIcon, Search];

export function Services() {
  return (
    <section
      id="services"
      className="container studio-section services-section"
      aria-labelledby="services-title"
    >
      <Reveal>
        <p className="eyebrow">{studio.services.eyebrow}</p>
        <div className="studio-heading">
          <h2 id="services-title">{studio.services.title}</h2>
          <p>{studio.services.intro}</p>
        </div>
      </Reveal>
      <div className="studio-services">
        {studio.services.items.map((service, index) => {
          const Icon = serviceIcons[index];
          return (
            <Reveal key={service.id} delay={index * 0.05}>
              <article className={`studio-service service-${service.id}`}>
                <div className="service-top">
                  <span className="studio-index">0{index + 1} / SERVICE</span>
                  <Icon size={28} strokeWidth={1.3} aria-hidden="true" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="service-bottom">
                  <small>{service.detail}</small>
                  <a
                    href="#contact"
                    aria-label={`${studio.services.action}: ${service.title}`}
                  >
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </a>
                </div>
                <span className="service-orbit" aria-hidden="true" />
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function WorkflowStep({
  step,
  index,
}: {
  step: (typeof studio.workflow.steps)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start .9", "start .35"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const icons = [Search, Layers3, Braces, CheckCheck, Sparkles];
  const Icon = icons[index];
  return (
    <m.article
      ref={ref}
      className="workflow-step"
      style={reduced ? undefined : { y }}
    >
      <span className="workflow-node" aria-hidden="true" />
      <div className="workflow-step-label">
        <span>0{index + 1}</span>
        <Icon size={24} strokeWidth={1.3} aria-hidden="true" />
      </div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <small>
        <ArrowDownRight size={14} aria-hidden="true" />
        {step.note}
      </small>
    </m.article>
  );
}
export function Workflow() {
  return (
    <section
      id="workflow"
      className="container studio-section workflow-section"
      aria-labelledby="workflow-title"
    >
      <div className="workflow-intro">
        <Reveal>
          <p className="eyebrow">{studio.workflow.eyebrow}</p>
          <h2 id="workflow-title">{studio.workflow.title}</h2>
          <p>{studio.workflow.intro}</p>
          <div className="workflow-art" aria-hidden="true">
            <span className="workflow-art-ring" />
            <span className="workflow-art-ring" />
            <span className="workflow-art-core">
              <WorkflowIcon size={42} strokeWidth={1} />
            </span>
            <i>IDEA</i>
            <i>DESIGN</i>
            <i>BUILD</i>
          </div>
          <small>{studio.workflow.label}</small>
        </Reveal>
      </div>
      <div className="workflow-steps">
        {studio.workflow.steps.map((step, index) => (
          <WorkflowStep key={step.title} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section
      id="journey"
      className="container studio-section journey-section"
      aria-labelledby="journey-title"
    >
      <Reveal>
        <p className="eyebrow">{studio.journey.eyebrow}</p>
        <div className="studio-heading">
          <h2 id="journey-title">{studio.journey.title}</h2>
          <p>{studio.journey.intro}</p>
        </div>
      </Reveal>
      <div className="journey-chapters">
        {studio.journey.chapters.map((chapter, index) => (
          <Reveal key={chapter.title} delay={index * 0.04}>
            <article className="journey-chapter">
              <div className="journey-chapter-number" aria-hidden="true">
                0{index + 1}
                <span />
              </div>
              <div>
                <p className="eyebrow">{chapter.label}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.description}</p>
              </div>
              <ArrowUpRight size={28} strokeWidth={1} aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
      <p className="journey-signature">
        {studio.journey.note}
        <span aria-hidden="true">↗</span>
      </p>
    </section>
  );
}

export function ToolOrbit() {
  return (
    <section
      className="container studio-section tool-section"
      aria-labelledby="tool-title"
    >
      <Reveal>
        <div className="tool-board">
          <div className="tool-copy">
            <p className="eyebrow">{studio.tools.eyebrow}</p>
            <h2 id="tool-title">{studio.tools.title}</h2>
            <p>{studio.tools.intro}</p>
            <span className="tool-handwriting" aria-hidden="true">
              a little help, a lot of intention ↗
            </span>
          </div>
          <div className="tool-tiles">
            {studio.tools.items.map((tool, index) => (
              <div className={`tool-tile tool-tile-${index}`} key={tool.name}>
                <span
                  className="tool-mark"
                  style={{ color: tool.color }}
                  aria-hidden="true"
                >
                  {tool.mark}
                </span>
                <strong>{tool.name}</strong>
                <small>{tool.purpose}</small>
              </div>
            ))}
          </div>
          <div className="tool-board-grid" aria-hidden="true" />
        </div>
        <p className="studio-note">{studio.tools.note}</p>
      </Reveal>
    </section>
  );
}

export function WorkBunch({ projects }: { projects: ProjectView[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const items = projects.slice(0, 4);
  return (
    <section
      ref={ref}
      id="work-bunch"
      className="bunch-section studio-section"
      aria-labelledby="bunch-title"
    >
      <div className="container">
        <Reveal>
          <p className="eyebrow">{studio.bunch.eyebrow}</p>
          <div className="studio-heading">
            <h2 id="bunch-title">{studio.bunch.title}</h2>
            <p>{studio.bunch.intro}</p>
          </div>
        </Reveal>
      </div>
      <div className="bunch-window">
        <m.div
          className="bunch-grid"
          style={reduced ? undefined : { y: drift }}
        >
          {items.flatMap((project, index) =>
            [0, 1].map((view) => {
              const screenshot =
                project.screenshots[view === 0 ? 0 : 3] ||
                project.screenshots[0];
              return (
                <a
                  className={`bunch-piece bunch-piece-${index * 2 + view}`}
                  href={project.demoUrl}
                  key={`${project.id}-${view}`}
                  aria-label={`${studio.bunch.explore}: ${project.title}, ${studio.bunch.views[view]}`}
                >
                  <div className="bunch-browser" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>
                      {project.title.toLowerCase().replaceAll(" ", "-")}.concept
                    </span>
                  </div>
                  <div className="bunch-image">
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      fill
                      sizes="(max-width:700px) 75vw, 430px"
                    />
                  </div>
                  <div className="bunch-caption">
                    <span>{project.title}</span>
                    <small>{studio.bunch.views[view]}</small>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </div>
                </a>
              );
            }),
          )}
        </m.div>
      </div>
      <div className="container bunch-after">
        <p className="studio-note">{studio.bunch.note}</p>
        <a href="#work" className="text-link">
          {studio.bunch.view}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
