import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Code2 } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <Reveal>
          <p className="eyebrow"><span className="tiny-line" />{site.hero.eyebrow}</p>
          <h1 id="hero-title">{site.hero.heading[0]}<br /><span className="gold-text">{site.hero.heading[1]}</span><br />{site.hero.heading[2]}</h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="hero-intro">{site.hero.intro}</p>
          <p className="hero-tagline">{site.hero.tagline}</p>
          <div className="hero-actions">
            <a href="#work" className="button button-gold">{site.hero.primary}<ArrowDownRight size={18} aria-hidden="true" /></a>
            <a href="#contact" className="button button-outline">{site.hero.secondary}<ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <p className="hero-note">{site.hero.note}</p>
        </Reveal>
      </div>
      <Reveal className="hero-visual" delay={0.12}>
        <div className="portrait-orbit" aria-hidden="true" />
        <figure className="portrait-card">
          <div className="portrait-topline"><span>{site.initials} / 01</span><span className="status-dot" /></div>
          <div className="portrait-image">
            <Image src={site.hero.portrait} alt={site.hero.portraitAlt} fill sizes="(max-width: 700px) 85vw, 390px" priority />
            <span className="portrait-placeholder">{site.hero.portraitStatus}</span>
          </div>
          <figcaption>
            <span className="eyebrow">{site.hero.portraitLabel}</span>
            <strong>{site.name}</strong>
            <p>{site.hero.portraitCaption}</p>
          </figcaption>
        </figure>
        <div className="floating-note glass"><Code2 size={23} aria-hidden="true" /><span>{site.hero.floatingLabel}</span></div>
        <span className="visual-coordinates" aria-hidden="true">CREATIVE × TECHNICAL</span>
      </Reveal>
      <div className="hero-bottom">
        <div className="expertise-list">{site.expertise.map((item) => <span key={item}>{item}</span>)}</div>
        <a href="#work" className="scroll-link" aria-label={site.hero.primary}><span aria-hidden="true">SCROLL TO EXPLORE</span><ArrowDownRight size={18} /></a>
      </div>
    </section>
  );
}
