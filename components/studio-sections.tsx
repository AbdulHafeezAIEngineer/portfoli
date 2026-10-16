"use client";
import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Braces,
  Check,
  CheckCheck,
  Layers3,
  Search,
  Sparkles,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { studio } from "@/data/studio";
import { studies } from "@/data/studies";
import type { ProjectView } from "@/data/projects";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
const serviceIcons = [Braces, Bot, WorkflowIcon, Search];

export function Services() {
  return (
    <section
      id="services"
      className="container studio-section services-section reference-services"
      aria-labelledby="services-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">{studio.services.eyebrow}</p>
        </Reveal>
        <TextReveal id="services-title" text={studio.services.title} />
        <Reveal>
          <p>{studio.services.intro}</p>
        </Reveal>
      </div>
      <div className="studio-services">
        {studio.services.items.map((service, index) => {
          const Icon = serviceIcons[index];
          return (
            <Reveal key={service.id} delay={(index % 2) * 0.08}>
              <article className={`studio-service service-${service.id}`}>
                <span className="reference-service-icon">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <p className="service-detail">{service.detail}</p>
                <a
                  className="service-learn"
                  href="#contact"
                  aria-label={`${studio.services.action}: ${service.title}`}
                >
                  {studio.services.more}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
export function Workflow() {
  const icons = [Search, Layers3, Braces, CheckCheck, Sparkles];
  return (
    <section
      id="workflow"
      className="container studio-section reference-workflow"
      aria-labelledby="workflow-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">{studio.workflow.eyebrow}</p>
        </Reveal>
        <TextReveal id="workflow-title" text={studio.workflow.title} />
        <Reveal>
          <p>{studio.workflow.intro}</p>
        </Reveal>
      </div>
      <div className="workflow-cards">
        {studio.workflow.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <Reveal key={step.title} delay={index * 0.07}>
              <article className="workflow-step">
                <span className="workflow-number">{index + 1}</span>
                <Icon
                  size={18}
                  className="workflow-card-icon"
                  aria-hidden="true"
                />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <small>
                  <ArrowDownRight size={13} aria-hidden="true" />
                  {step.note}
                </small>
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal>
        <p className="workflow-caption">{studio.workflow.label}</p>
      </Reveal>
    </section>
  );
}
export function Journey() {
  return (
    <section
      id="journey"
      className="container studio-section journey-section reference-journey"
      aria-labelledby="journey-title"
    >
      <div className="reference-heading">
        <Reveal>
          <p className="eyebrow">{studio.journey.eyebrow}</p>
        </Reveal>
        <TextReveal id="journey-title" text={studio.journey.title} />
        <Reveal>
          <p>{studio.journey.intro}</p>
        </Reveal>
      </div>
      <div className="journey-chapters">
        {studio.journey.chapters.map((chapter, index) => (
          <Reveal key={chapter.title} delay={0.03}>
            <article className="journey-chapter">
              <span className="timeline-dot" aria-hidden="true" />
              <header>
                <div>
                  <span className="journey-mini-index">
                    0{index + 1} / {chapter.label}
                  </span>
                  <h3>{chapter.title}</h3>
                </div>
                <span className="journey-phase">{chapter.phase}</span>
              </header>
              <p>{chapter.description}</p>
              <ul>
                {chapter.points.map((point) => (
                  <li key={point}>
                    <Check size={14} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="journey-signature">
          {studio.journey.note}
          <span aria-hidden="true">↗</span>
        </p>
      </Reveal>
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
            <TextReveal id="tool-title" text={studio.tools.title} />
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
  const drift = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const items = [
    ...projects
      .slice(0, 4)
      .map((project) => ({
        id: project.id,
        title: project.title,
        image: project.screenshots[0].src,
        alt: project.screenshots[0].alt,
        href: project.demoUrl,
        category: studio.bunch.websiteLabel,
      })),
    ...studies.map((study) => ({
      id: study.id,
      title: study.name,
      image: study.screenshot,
      alt: `${study.name}: original ${study.industry.toLowerCase()} interface concept, captured from its implemented design study`,
      href: `/studies/${study.id}`,
      category: study.industry,
    })),
  ];
  return (
    <section
      ref={ref}
      id="work-bunch"
      className="bunch-section studio-section reference-bunch"
      aria-labelledby="bunch-title"
    >
      <div className="container reference-heading">
        <Reveal>
          <p className="eyebrow">{studio.bunch.eyebrow}</p>
        </Reveal>
        <TextReveal id="bunch-title" text={studio.bunch.title} />
        <Reveal>
          <p>{studio.bunch.intro}</p>
        </Reveal>
      </div>
      <div className="bunch-window">
        <m.div
          className="bunch-grid"
          style={reduced ? undefined : { y: drift }}
        >
          {items.map((item, index) => (
            <a
              className={`bunch-piece bunch-piece-${index}`}
              href={item.href}
              key={item.id}
              aria-label={`${studio.bunch.explore}: ${item.title}`}
            >
              <div className="bunch-browser" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>
                  {item.title.toLowerCase().replaceAll(" ", "-")}.concept
                </span>
              </div>
              <div className="bunch-image">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width:650px) 70vw,(max-width:1000px) 35vw,400px"
                />
              </div>
              <div className="bunch-caption">
                <span>{item.title}</span>
                <small>{item.category}</small>
                <ArrowUpRight size={15} aria-hidden="true" />
              </div>
            </a>
          ))}
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
