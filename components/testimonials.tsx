import Image from "next/image";
import { UserRound } from "lucide-react";
import type { CSSProperties } from "react";
import type { Testimonial } from "@/data/agency";
import { testimonialSamples } from "@/data/testimonial-samples";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { TestimonialScene } from "./testimonial-scene";

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const preview = testimonials.length === 0;
  const reviews = preview ? testimonialSamples : testimonials;
  return (
    <TestimonialScene
      heading={
        <Reveal>
          <div className="testimonials-heading">
            <p className="eyebrow">PEOPLE / PROJECTS / PERSPECTIVE</p>
            <TextReveal as="h1" id="testimonials-title" text="Testimonials." />
            <p className="testimonials-subtitle">
              What people say about working with me.
            </p>
            {preview && (
              <p className="testimonial-sample-note">
                Design preview: fictional profiles and illustrative reviews, not
                client endorsements.
              </p>
            )}
          </div>
        </Reveal>
      }
    >
      <div className="testimonials-grid">
        {reviews.map((review, index) => (
          <Reveal key={review.id} delay={(index % 4) * 0.07}>
            <div
              className="testimonial-float"
              style={
                {
                  "--review-duration": `${13 + (index % 4) * 2}s`,
                  "--review-delay": `${-index * 2.3}s`,
                  "--review-angle": `${index % 2 ? 0.65 : -0.65}deg`,
                } as CSSProperties
              }
            >
              <figure
                className="testimonial-card"
                data-sample={review.placeholder ? "true" : undefined}
              >
                <span className="testimonial-quote-mark" aria-hidden="true">
                  “
                </span>
                {review.placeholder && (
                  <span className="testimonial-sample-label">
                    FICTIONAL EXAMPLE
                  </span>
                )}
                <blockquote>{review.quote}</blockquote>
                <figcaption>
                  <span className="testimonial-avatar">
                    {review.portrait ? (
                      <Image
                        loading="eager"
                        fetchPriority="low"
                        src={review.portrait}
                        alt=""
                        width={44}
                        height={44}
                      />
                    ) : (
                      <UserRound
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span>
                    <strong>{review.name}</strong>
                    <small>{review.role}</small>
                  </span>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        ))}
      </div>
    </TestimonialScene>
  );
}
