import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BackToTop } from "./back-to-top";
import { site } from "@/data/site";
import { studio } from "@/data/studio";
import { SocialLinks } from "./social-links";
import { CookieSettingsButton } from "./consent-provider";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { FooterMotion } from "./footer-motion";

export function Footer({
  brand,
  email = site.email,
}: {
  brand: string;
  email?: string;
}) {
  return (
    <FooterMotion>
      <div className="container footer-top-grid">
        <div className="footer-editorial-invitation">
          <Reveal>
            <p className="eyebrow">{studio.ending.eyebrow}</p>
          </Reveal>
          <TextReveal text={studio.ending.title} />
          <Reveal>
            <p>{studio.ending.description}</p>
          </Reveal>
        </div>
        <Reveal>
          <nav aria-label="Footer navigation" className="footer-quick-links">
            <h3>{studio.ending.navigation}</h3>
            <div>
              {studio.ending.navLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="footer-contact-column">
            <h3>{studio.ending.connect}</h3>
            <a href={`mailto:${email}`} className="footer-contact-address">
              {email}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link href="/contact" className="footer-brief-link">
              {studio.ending.action}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="footer-wordmark-window" aria-hidden="true">
        <span>{brand}</span>
        <i />
      </div>
      <div className="footer-signoff">
        <div className="footer-waves" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
            <path d="M0 75C200 75 280 0 480 24S780 128 1000 52S1240 0 1440 46V110H0Z" />
            <path d="M0 55C260 120 370 5 650 43S990 102 1180 34S1350 15 1440 25V110H0Z" />
            <path d="M0 90C250 50 390 105 610 66S990 0 1160 65S1350 100 1440 60V110H0Z" />
          </svg>
        </div>
        <div className="container">
          <Reveal>
            <Link
              className="footer-emblem"
              href="/#top"
              aria-label={`${brand} — Home`}
            >
              <span>
                <Image
                  loading="eager"
                  fetchPriority="low"
                  src={site.logo.src}
                  alt=""
                  width={64}
                  height={64}
                  aria-hidden="true"
                />
              </span>
              <strong>{brand}</strong>
            </Link>
            <p className="footer-signature">{studio.ending.signature}</p>
            <div className="footer-social-row">
              <SocialLinks iconsOnly />
              <a className="footer-email-icon" href={`mailto:${email}`}>
                Let’s connect
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
          <div className="footer-editorial-colophon">
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
            <Link
              className="footer-top-link"
              href="#top"
              aria-label={site.ui.back}
            >
              ↑
            </Link>
          </div>
          <p className="footer-editorial-credit">{studio.ending.credit}</p>
        </div>
      </div>
      <BackToTop />
    </FooterMotion>
  );
}
