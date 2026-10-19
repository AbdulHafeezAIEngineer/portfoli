import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="container field-hero" aria-labelledby="hero-title">
      <div className="field-hero-heading">
        <p className="eyebrow">ABDUL HAFEEZ / INDEPENDENT DEVELOPER</p>
        <h1 id="hero-title">
          I build websites.
          <br />
          <em>And chatbots that answer from your documents.</em>
        </h1>
      </div>
      <div className="field-hero-brief">
        <p>
          I design and build websites, then connect the forms, data and services
          behind them. For website chatbots, I use your product documents and
          policies as the source material.
        </p>
        <Link className="button button-gold" href="/contact">
          Tell me what you need <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <a className="field-text-link" href="#selected-work">
          See the builds below ↓
        </a>
      </div>
      <figure className="field-hero-proof">
        <Link
          href="/demo/kovo"
          aria-label="Open Kovo architecture website concept"
        >
          <Image
            src="/projects/kovo-1.webp"
            alt="Browser capture of Kovo, my architecture website concept"
            width={1440}
            height={1000}
            sizes="(max-width: 760px) 100vw, 68vw"
            priority
          />
        </Link>
        <figcaption>
          <span>KOVO / ARCHITECTURE CONCEPT</span>
          <span>Open the site. Draft a sample project brief.</span>
        </figcaption>
      </figure>
      <aside className="field-margin-note">
        <span className="eyebrow">A SMALL TEST</span>
        <p>
          Ask Veldt:
          <br />
          <q>Is shipping free on a $70 order?</q>
        </p>
        <p className="field-note-answer">
          Its sample policy says free shipping starts at $75. The bot should
          explain the difference.
        </p>
        <Link href="/ai-bots#meet-assistants">
          Try that question <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <small>Fictional store. Real AI response.</small>
      </aside>
      <p className="field-byline">
        {site.name} builds the work shown here. Concept brands are labelled;
        they are not client commissions.
      </p>
    </section>
  );
}
