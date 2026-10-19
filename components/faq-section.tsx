import type { Faq } from "@/data/agency";
import { TextReveal } from "./text-reveal";
import { FaqEnhancement } from "./faq-enhancement";
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section
      id="faq"
      className="container studio-section agency-faq"
      aria-labelledby="faq-title"
    >
      <FaqEnhancement />
      <div>
        <p className="eyebrow">BEFORE WE BUILD</p>
        <TextReveal id="faq-title" text="Before you commission a build." />
        <p className="section-intro">
          A few things to know before starting a project together.
        </p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={faq.id}>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {faq.question}
            </summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
