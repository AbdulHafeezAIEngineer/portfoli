import {
  ArrowDownRight,
  Blocks,
  Braces,
  Database,
  ShieldCheck,
} from "lucide-react";
import { experience as copy } from "@/data/experience";
import { Reveal } from "./reveal";
import Image from "next/image";
import { site } from "@/data/site";

const fundamentalsIcons = {
  frontend: Blocks,
  backend: Braces,
  database: Database,
  deployment: ShieldCheck,
};

export function Experience() {
  return (
    <section
      id="experience"
      className="container experience-section"
      aria-labelledby="experience-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="experience-intro">
          <div>
            <h2 id="experience-title">{copy.title}</h2>
            <p className="experience-lead">{copy.lead}</p>
            <figure className="about-portrait">
              <div className="about-portrait-image">
                <Image src={site.hero.portrait} alt={site.hero.portraitAlt} fill sizes="(max-width:700px) 85vw, 360px" />
                {site.hero.portraitStatus && <span className="about-portrait-status">{site.hero.portraitStatus}</span>}
              </div>
              <figcaption>
                <div><span className="eyebrow">{site.brand}</span><strong>{site.name}</strong></div>
                <span className="about-signature" aria-hidden="true">{site.brand.slice(0, 1)}.</span>
              </figcaption>
            </figure>
          </div>
          <div className="about-story">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="process-grid">
        {copy.process.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.04}>
            <article className="process-card glass">
              <span>0{index + 1}</span>
              <ArrowDownRight size={17} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <aside className="experience-facts">
          <div>
            <p className="eyebrow">{copy.factsLabel}</p>
            <p>{copy.factsNote}</p>
          </div>
          <dl>
            {copy.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Reveal>
      <div className="fundamentals-section">
        <Reveal>
          <p className="eyebrow">{copy.fundamentals.eyebrow}</p>
          <h2 id="fundamentals-title">{copy.fundamentals.title}</h2>
          <p className="section-intro">{copy.fundamentals.description}</p>
        </Reveal>
        <div className="fundamentals-grid">
          {copy.fundamentals.blocks.map((block, index) => {
            const Icon = fundamentalsIcons[block.id];
            return (
              <Reveal key={block.id} delay={index * 0.04}>
                <article className="fundamental-card">
                  <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                  <h3>{block.title}</h3>
                  {block.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="fundamentals-closing">{copy.fundamentals.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
