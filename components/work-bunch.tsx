"use client";
import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { studio } from "@/data/studio";
import { studies } from "@/data/studies";
import type { ProjectView } from "@/data/projects";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
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
