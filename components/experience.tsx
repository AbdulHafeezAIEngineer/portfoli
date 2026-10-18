import Image from "next/image";
import {
  Blocks,
  Braces,
  Database,
  ShieldCheck,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import { experience as copy } from "@/data/experience";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { SocialLinks } from "./social-links";
import { site } from "@/data/site";
import { ReadingText } from "./reading-text";
const fundamentalsIcons = {
  frontend: Blocks,
  backend: Braces,
  database: Database,
  deployment: ShieldCheck,
  ai: Bot,
};
export function Experience() {
  return (
    <section
      id="experience"
      className="container experience-section reference-about"
      aria-labelledby="experience-title"
    >
      <div className="experience-intro">
        <Reveal>
          <figure className="about-portrait">
            <div className="about-portrait-image about-owner-photo">
              <Image
                src="/abdul-hafeez.webp"
                alt={site.name}
                className="about-owner-image"
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 42vw, 480px"
              />
              <span className="about-photo-label">INDEPENDENT BY DESIGN</span>
              <span className="about-photo-caption">
                DESIGN + WEB DEVELOPMENT
              </span>
            </div>
            <figcaption>
              <div>
                <span className="eyebrow">{site.brand}</span>
                <strong>{site.name}</strong>
              </div>
              <span className="about-signature" aria-hidden="true">
                E.
              </span>
            </figcaption>
          </figure>
        </Reveal>
        <div className="about-story">
          <Reveal>
            <p className="eyebrow">{copy.eyebrow}</p>
          </Reveal>
          <TextReveal as="h1" id="experience-title" text={copy.title} />
          <Reveal>
            <ReadingText className="experience-lead" text={copy.lead} />
            {copy.paragraphs.map((paragraph) => (
              <ReadingText key={paragraph} text={paragraph} />
            ))}
            <SocialLinks />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TechnicalDomains() {
  return (
    <section
      id="fundamentals"
      className="container fundamentals-section domains-section"
      aria-labelledby="fundamentals-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.fundamentals.eyebrow}</p>
      </Reveal>
      <TextReveal
        as="h2"
        id="fundamentals-title"
        text={copy.fundamentals.title}
      />
      <Reveal>
        <p className="section-intro">{copy.fundamentals.description}</p>
      </Reveal>
      <div className="domains-bento">
        {copy.fundamentals.blocks.map((block, index) => {
          const Icon = fundamentalsIcons[block.id];
          return (
            <Reveal key={block.id} delay={index * 0.05}>
              <article className={`domain-card domain-${block.id}`}>
                <div className="domain-heading">
                  <span className="domain-icon">
                    <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <h3>{block.title}</h3>
                  <span className="domain-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <p>{block.description}</p>
                <ul
                  className="domain-tags"
                  aria-label={`${block.title} technologies`}
                >
                  {block.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {block.id === "ai" && (
                  <a href="/ai-bots" className="domain-demo-link">
                    Explore the AI demos
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal>
        <p className="fundamentals-closing">{copy.fundamentals.closing}</p>
      </Reveal>
    </section>
  );
}
