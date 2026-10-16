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
import { ToolMark } from "./tool-mark";
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
      className="container studio-section editorial-journey"
      aria-labelledby="journey-title"
    >
      <div className="journey-editorial-heading">
        <Reveal>
          <p className="eyebrow">{studio.journey.eyebrow}</p>
        </Reveal>
        <TextReveal
          id="journey-title"
          className="split-display"
          text={studio.journey.displayTitle}
        />
        <Reveal className="journey-story-intro">
          <h3>{studio.journey.title.replaceAll("\n", " ")}</h3>
          <p>{studio.journey.intro}</p>
        </Reveal>
      </div>
      <div className="journey-editorial-list">
        {studio.journey.chapters.map((chapter, index) => (
          <Reveal key={chapter.title} delay={0.03}>
            <article className="journey-editorial-entry">
              <span className="journey-entry-index" aria-hidden="true">
                0{index + 1}
              </span>
              <header>
                <div>
                  <span className="journey-entry-label">{chapter.label}</span>
                  <h3>{chapter.title}</h3>
                </div>
                <span className="journey-entry-phase">
                  {chapter.phase}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
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
          <span aria-hidden="true">
            <ArrowUpRight size={28} strokeWidth={1.4} />
          </span>
        </p>
      </Reveal>
    </section>
  );
}

export function ToolOrbit() {
  return (
    <section
      id="creative-toolkit"
      className="container studio-section premium-tool-section"
      aria-labelledby="tool-title"
    >
      <div className="premium-tool-heading">
        <div>
          <Reveal>
            <p className="eyebrow">{studio.tools.eyebrow}</p>
          </Reveal>
          <TextReveal
            id="tool-title"
            className="split-display"
            text={studio.tools.title}
          />
        </div>
        <Reveal>
          <p className="premium-tool-intro">
            {studio.tools.intro}
            <span>
              The tools are powerful.
              <br />
              The decisions are human.
            </span>
          </p>
        </Reveal>
      </div>
      <div className="premium-tool-grid">
        {studio.tools.items.map((tool, index) => (
          <Reveal key={tool.name} delay={(index % 2) * 0.06}>
            <article className="premium-tool-item">
              <span className="premium-tool-logo">
                <ToolMark name={tool.name} />
              </span>
              <div>
                <h3>{tool.name}</h3>
                <p>{tool.purpose}</p>
              </div>
              <span className="premium-tool-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="studio-note">{studio.tools.note}</p>
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
    ...projects.slice(0, 4).map((project) => ({
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
