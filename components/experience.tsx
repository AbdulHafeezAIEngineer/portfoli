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
import Image from "next/image";
import { site } from "@/data/site";
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
            <div className="about-portrait-image">
              <Image
                src={site.hero.portrait}
                alt={site.hero.portraitAlt}
                fill
                sizes="(max-width:700px) 85vw,480px"
              />
              {site.hero.portraitStatus && (
                <span className="about-portrait-status">
                  {site.hero.portraitStatus}
                </span>
              )}
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
          <TextReveal id="experience-title" text={copy.title} />
          <Reveal>
            <p className="experience-lead">{copy.lead}</p>
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <SocialLinks />
          </Reveal>
        </div>
      </div>
      <div
        className="fundamentals-section domains-section"
        aria-labelledby="fundamentals-title"
      >
        <Reveal>
          <p className="eyebrow">{copy.fundamentals.eyebrow}</p>
        </Reveal>
        <TextReveal id="fundamentals-title" text={copy.fundamentals.title} />
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
                    <a href="#ai-bots" className="domain-demo-link">
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
      </div>
    </section>
  );
}
