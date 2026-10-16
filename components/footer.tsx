import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";
import { studio } from "@/data/studio";
import { BrandMark } from "./brand-mark";
import { SocialLinks } from "./social-links";
import { CookieSettingsButton } from "./consent-provider";
import { Reveal } from "./reveal";

export function Footer({
  brand,
  email = site.email,
}: {
  brand: string;
  email?: string;
}) {
  return (
    <footer className="studio-footer">
      <div className="container">
        <Reveal>
          <div className="footer-invitation">
            <p className="eyebrow">{studio.ending.eyebrow}</p>
            <h2>{studio.ending.title}</h2>
            <div>
              <p>{studio.ending.description}</p>
              <a href={`mailto:${email}`} className="button button-gold">
                {studio.ending.action}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
        <div className="footer-directory">
          <div className="footer-identity">
            <a href="/#top" className="wordmark" aria-label={`${brand} — Home`}>
              <BrandMark brand={brand} />
            </a>
            <p>{studio.ending.signature}</p>
            <a className="footer-email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
          <nav aria-label="Footer navigation">
            <h3>{studio.ending.navigation}</h3>
            {studio.ending.navLinks.map((item) => (
              <a key={item.href} href={`/${item.href}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <div>
            <h3>{studio.ending.connect}</h3>
            <SocialLinks />
          </div>
          <nav aria-label="Legal information">
            <h3>{studio.ending.legal}</h3>
            {studio.ending.legalLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <CookieSettingsButton />
          </nav>
        </div>
        <div className="footer-colophon">
          <p>
            © {new Date().getFullYear()} {brand}. {studio.ending.copyright}
          </p>
          <p>{studio.ending.credit}</p>
          <a href="/#top">{site.ui.back} ↑</a>
        </div>
        <div className="footer-art" aria-hidden="true">
          <span>{brand}</span>
          <i />
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
