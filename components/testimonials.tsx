import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Testimonial } from "@/data/agency";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

/** Explicit layout samples, never attributed to real customers or used as endorsements. */
const samples: Testimonial[] = [
  {
    id: "sample-design",
    quote:
      "Sample testimonial about a website's design, clarity and attention to detail. This card previews the space for a client's own words.",
    name: "Sample client",
    role: "Website design · layout preview",
    portrait: "",
    placeholder: true,
  },
  {
    id: "sample-build",
    quote:
      "Sample testimonial about development, responsive layouts and the small interactions that make a website feel considered.",
    name: "Sample client",
    role: "Development · layout preview",
    portrait: "",
    placeholder: true,
  },
  {
    id: "sample-ai",
    quote:
      "Sample testimonial about a useful AI integration and how it fits into a real business workflow. Genuine feedback can replace this sample.",
    name: "Sample client",
    role: "AI integration · layout preview",
    portrait: "",
    placeholder: true,
  },
  {
    id: "sample-process",
    quote:
      "Sample testimonial about communication, collaboration and the experience of bringing a project from its first idea to launch.",
    name: "Sample client",
    role: "Collaboration · layout preview",
    portrait: "",
    placeholder: true,
  },
];

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const preview = testimonials.length === 0;
  const reviews = preview ? samples : testimonials;
  return (
    <section
      id="testimonials"
      className="container testimonials-section"
      aria-labelledby="testimonials-title"
    >
      <Reveal>
        <div className="testimonials-heading">
          <TextReveal id="testimonials-title" text="Testimonials" />
          {preview && (
            <p className="testimonial-sample-note">
              Design preview — sample content, not client endorsements.
            </p>
          )}
        </div>
      </Reveal>
      <div className="testimonials-grid">
        {reviews.map((review, index) => (
          <Reveal key={review.id} delay={(index % 4) * 0.07}>
            <figure
              className="testimonial-card"
              data-sample={review.placeholder ? "true" : undefined}
            >
              {review.placeholder && (
                <span className="testimonial-sample-label">SAMPLE REVIEW</span>
              )}
              <blockquote>{review.quote}</blockquote>
              <figcaption>
                <span className="testimonial-avatar">
                  {review.portrait && !review.placeholder ? (
                    <Image
                      src={review.portrait}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <UserRound size={20} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </span>
                <span>
                  <strong>{review.name}</strong>
                  <small>{review.role}</small>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
