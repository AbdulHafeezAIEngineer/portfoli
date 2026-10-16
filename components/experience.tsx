import { Blocks, Braces, Database, ShieldCheck } from "lucide-react";
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
      <div className="fundamentals-section">
        <Reveal>
          <p className="eyebrow">{copy.fundamentals.eyebrow}</p>
        </Reveal>
        <TextReveal id="fundamentals-title" text={copy.fundamentals.title} />
        <Reveal>
          <p className="section-intro">{copy.fundamentals.description}</p>
        </Reveal>
        <div className="fundamentals-grid">
          {copy.fundamentals.blocks.map((block, index) => {
            const Icon = fundamentalsIcons[block.id];
            return (
              <Reveal key={block.id} delay={index * 0.05}>
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
