import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "./reveal";

export function Footer() {
  return (
    <>
      <div className="container future-sections" aria-label="Sections planned for later parts">
        {site.future.map((section) => <section id={section.id} key={section.id} className="future-row" aria-labelledby={`${section.id}-title`}><span>{section.number}</span><h2 id={`${section.id}-title`}>{section.title}</h2><p>{site.futureNote}</p></section>)}
      </div>
      <section id="contact" className="container contact-section" aria-labelledby="contact-title">
        <Reveal><p className="eyebrow">{site.contact.eyebrow}</p><h2 id="contact-title">{site.contact.heading}</h2><p>{site.contact.description}</p>{site.email ? <a className="button button-gold" href={`mailto:${site.email}`}>{site.contact.action}<ArrowUpRight size={18} /></a> : <span className="contact-pending">{site.contact.placeholder}</span>}</Reveal>
      </section>
      <footer className="container footer"><a href="#top" className="wordmark" aria-label={site.ui.home}>{site.initials}<span>.</span></a><p>© {new Date().getFullYear()} {site.name}</p><p>{site.footer}</p></footer>
    </>
  );
}
