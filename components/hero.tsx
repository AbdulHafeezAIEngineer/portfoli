import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { HeroEmblem } from "./hero-emblem";

export function Hero() {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div>
          <p className="eyebrow">
            <span className="tiny-line" />
            {site.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            {site.hero.heading[0]}
            <br />
            <span className="gold-text">{site.hero.heading[1]}</span>
            <br />
            {site.hero.heading[2]}
          </h1>
        </div>
        <div>
          <p className="hero-intro">{site.hero.intro}</p>
          <p className="hero-tagline">{site.hero.tagline}</p>
          <div className="hero-actions">
            <a href="#work" className="button button-gold">
              {site.hero.primary}
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a href="#contact" className="button button-outline">
              {site.hero.secondary}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-note">{site.hero.note}</p>
        </div>
      </div>
      <div className="hero-visual">
        <HeroEmblem />
      </div>
      <div className="hero-bottom">
        <div className="expertise-list">
          {site.expertise.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <a href="#work" className="scroll-link" aria-label={site.hero.primary}>
          <span aria-hidden="true">SCROLL TO EXPLORE</span>
          <ArrowDownRight size={18} />
        </a>
      </div>
    </section>
  );
}
