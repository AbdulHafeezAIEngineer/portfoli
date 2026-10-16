import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { legal } from "@/data/privacy";
import { site } from "@/data/site";
import { BrandMark } from "./brand-mark";
import { Footer } from "./footer";
import { CookieSettingsButton } from "./consent-provider";
export function LegalPage({ page }: { page: keyof typeof legal.pages }) {
  const copy = legal.pages[page];
  return (
    <div id="top">
      <header className="container legal-header">
        <Link href="/" className="wordmark">
          <BrandMark brand={site.brand} />
        </Link>
        <Link href="/" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          {legal.back}
        </Link>
      </header>
      <main id="main-content" className="container legal-main">
        <p className="eyebrow">
          {legal.updatedLabel} · {legal.updated}
        </p>
        <h1>{copy.title}</h1>
        <p className="legal-intro">{copy.intro}</p>
        <nav className="legal-tabs" aria-label="Policies">
          {Object.entries(legal.pages).map(([id, item]) => (
            <Link
              key={id}
              href={`/${id}`}
              aria-current={id === page ? "page" : undefined}
            >
              {item.title}
            </Link>
          ))}
          <CookieSettingsButton />
        </nav>
        {copy.sections.map((section, index) => (
          <section key={section.title} className="legal-section">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </section>
        ))}
        <div className="legal-contact">
          <p>{legal.contact}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </main>
      <Footer brand={site.brand} />
    </div>
  );
}
