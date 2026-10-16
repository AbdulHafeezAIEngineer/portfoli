import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";
import { studio } from "@/data/studio";
import { BrandMark } from "./brand-mark";
import { SocialLinks } from "./social-links";
import { CookieSettingsButton } from "./consent-provider";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
export function Footer({
  brand,
  email = site.email,
}: {
  brand: string;
  email?: string;
}) {
  return (
    <footer className="studio-footer reference-footer">
      <div className="container">
        <div className="footer-invitation">
          <Reveal>
            <p className="eyebrow">{studio.ending.eyebrow}</p>
          </Reveal>
          <TextReveal text={studio.ending.title} />
          <Reveal>
            <div>
              <p>{studio.ending.description}</p>
              <a href={`mailto:${email}`} className="button button-gold">
                {studio.ending.action}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
        <div className="footer-directory">
          <Reveal>
            <div className="footer-identity">
              <a
                href="/#top"
                className="wordmark"
                aria-label={`${brand} — Home`}
              >
                <BrandMark brand={brand} />
              </a>
              <p className="footer-role">{site.role}</p>
              <p>{studio.ending.signature}</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <nav aria-label="Footer navigation">
              <h3>{studio.ending.navigation}</h3>
              {studio.ending.navLinks.map((item) => (
                <a key={item.href} href={`/${item.href}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          </Reveal>
          <Reveal delay={0.12}>
            <div>
              <h3>{studio.ending.connect}</h3>
              <SocialLinks />
              <a className="footer-email" href={`mailto:${email}`}>
                <Mail size={15} aria-hidden="true" />
                {email}
              </a>
            </div>
          </Reveal>
        </div>
        <div className="footer-colophon">
          <p>
            © {new Date().getFullYear()} {brand}. {studio.ending.copyright}
          </p>
          <nav aria-label="Legal information">
            {studio.ending.legalLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <CookieSettingsButton />
          </nav>
          <a href="/#top" aria-label={site.ui.back}>
            ↑
          </a>
        </div>
        <p className="footer-credit">{studio.ending.credit}</p>
        <div className="footer-art" aria-hidden="true">
          <span>{brand}</span>
          <i />
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
