import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function HomeDirectory() {
  return (
    <section
      id="selected-work"
      className="container field-directory"
      aria-labelledby="directory-title"
    >
      <header className="field-section-heading">
        <p className="eyebrow">SELECTED BUILDS / OPEN AND TRY THEM</p>
        <h2 id="directory-title">
          Try the stay planner.
          <br />
          Change a car’s finish.
        </h2>
        <p>
          These are working concepts with fictional brands. Use the filters,
          forms and chat demos to judge what I build.
        </p>
      </header>
      <div className="field-work-pair">
        <article className="field-work-primary">
          <Link href="/demo/solenne">
            <Image
              src="/projects/solenne-1.webp"
              alt="Actual browser screenshot of the Solenne hotel concept"
              width={1440}
              height={1000}
              sizes="(max-width:760px) 100vw, 58vw"
            />
            <span className="field-work-label">
              <span>01 / SOLENNE</span>
              <ArrowUpRight size={23} aria-hidden="true" />
            </span>
          </Link>
          <h3>A room shortlist before an enquiry.</h3>
          <p>
            Compare the fictional suites and villas, then try the sample stay
            planner. It creates no booking.
          </p>
        </article>
        <article className="field-work-secondary">
          <Link href="/demo/vanta">
            <Image
              src="/projects/vanta-1.webp"
              alt="Actual browser screenshot of the Vanta automotive concept"
              width={1440}
              height={1000}
              sizes="(max-width:760px) 100vw, 36vw"
            />
            <span className="field-work-label">
              <span>02 / VANTA</span>
              <ArrowUpRight size={23} aria-hidden="true" />
            </span>
          </Link>
          <h3>Choose a model. Change the finish.</h3>
          <p>
            An electric-car configurator with a local summary. The car and
            specifications are fictional.
          </p>
        </article>
      </div>
      <div className="field-index-links">
        <Link href="/websites">
          <span>All four website concepts</span>
          <ArrowUpRight size={20} />
        </Link>
        <Link href="/ai-bots">
          <span>Veldt, Northline and Solenne chat demos</span>
          <ArrowUpRight size={20} />
        </Link>
        <Link href="/bunch-of-work">
          <span>Six interface studies</span>
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </section>
  );
}
