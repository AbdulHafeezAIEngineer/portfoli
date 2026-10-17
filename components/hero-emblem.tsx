import Image from "next/image";
import { site } from "@/data/site";
import { LogoMotion } from "./logo-motion";
export function HeroEmblem() {
  return (
    <div
      className="hero-emblem"
      data-parallax="hero"
      aria-label={`${site.brand}: websites and AI experiences`}
      role="img"
    >
      <div className="emblem-grid" aria-hidden="true" />
      <div className="emblem-ring emblem-ring-one" aria-hidden="true" />
      <div className="emblem-ring emblem-ring-two" aria-hidden="true" />
      <div className="emblem-plinth" aria-hidden="true" />
      <LogoMotion />
      <div className="emblem-object" data-logo-flip aria-hidden="true">
        <div className="emblem-face emblem-face-front">
          <Image src={site.logo.src} alt="" width={240} height={240} priority />
          <span className="emblem-shine" />
        </div>
        <div className="emblem-face emblem-face-back">
          <Image src={site.logo.src} alt="" width={240} height={240} />
          <span className="emblem-shine" />
        </div>
      </div>
      <span className="emblem-label">
        {site.brand.toUpperCase()}
        <small>{site.hero.floatingLabel}</small>
      </span>
      <span className="emblem-coordinate" aria-hidden="true">
        E / AI + WEB
      </span>
      <span className="emblem-orbit-dot" aria-hidden="true" />
    </div>
  );
}
