import type { Faq } from "@/data/agency";
import { TextReveal } from "./text-reveal";
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section
      id="faq"
      className="container studio-section agency-faq"
      aria-labelledby="faq-title"
    >
      <div>
        <p className="eyebrow">BEFORE WE BUILD</p>
        <TextReveal id="faq-title" text={"Good questions.\nClear answers."} />
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
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
