import { ArrowUpRight } from "lucide-react";
import { contactContent as copy } from "@/data/contact";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";
import { SocialLinks } from "./social-links";
import { TextReveal } from "./text-reveal";

export function Contact({ email }: { email: string }) {
  return (
    <section
      id="contact"
      className="container editorial-contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-paper">
        <div className="contact-editorial-copy">
          <div>
            <Reveal>
              <p className="eyebrow">{copy.eyebrow}</p>
            </Reveal>
            <TextReveal as="h1" id="contact-title" text={copy.title} />
            <Reveal>
              <p className="contact-invitation">{copy.description}</p>
            </Reveal>
          </div>
          <Reveal>
            <div className="contact-direct">
              <p>{copy.emailNote}</p>
              <a className="contact-address" href={`mailto:${email}`}>
                {email}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
              <SocialLinks iconsOnly />
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.08} className="contact-form-wrap">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
