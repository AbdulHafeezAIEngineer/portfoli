import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { studio } from "@/data/studio";
import { site } from "@/data/site";
import { SocialLinks } from "./social-links";
import { CookieSettingsButton } from "./consent-provider";
export function Footer({
  brand,
  email = site.email,
}: {
  brand: string;
  email?: string;
}) {
  return (
    <footer className="field-footer">
      <div className="container field-footer-grid">
        <div>
          <p className="eyebrow">{studio.ending.eyebrow}</p>
          <h2>
            What needs
            <br />
            to work better?
          </h2>
          <p>{studio.ending.description}</p>
          <a href={`mailto:${email}`} className="field-footer-email">
            {email} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <nav aria-label="Footer navigation">
          {studio.ending.navLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="field-footer-proof">
          <p>
            Kovo’s sample brief.
            <br />
            Veldt’s delivery policy.
            <br />
            Solenne’s stay planner.
          </p>
          <p>The examples are open to inspect.</p>
          <SocialLinks />
        </div>
      </div>
      <div className="container field-colophon">
        <span>
          © {new Date().getFullYear()} {brand} / Abdul Hafeez
        </span>
        <nav aria-label="Legal information">
          {studio.ending.legalLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <CookieSettingsButton />
        </nav>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
