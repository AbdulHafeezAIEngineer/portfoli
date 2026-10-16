import { ArrowUpRight, Mail } from "lucide-react";
import { contactContent as copy } from "@/data/contact";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";
import { SocialLinks } from "./social-links";

export function Contact({ email }: { email: string }) {
  return (
    <section
      id="contact"
      className="container elvora-contact"
      aria-labelledby="contact-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="contact-title">{copy.title}</h2>
        <p className="section-intro">{copy.description}</p>
      </Reveal>
      <div className="contact-grid">
        <Reveal>
          <div className="email-card">
            <Mail size={28} strokeWidth={1.3} aria-hidden="true" />
            <p className="eyebrow">{copy.emailLabel}</p>
            <p>{copy.emailNote}</p>
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <small>{copy.emailCta}</small>
            <SocialLinks />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
