import Image from "next/image";
import { UserRound } from "lucide-react";
import type { CSSProperties } from "react";
import type { Testimonial } from "@/data/agency";
import { site } from "@/data/site";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { TestimonialScene } from "./testimonial-scene";

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const reviews = testimonials.filter((review) => !review.placeholder);
  return (
    <TestimonialScene
      heading={
        <Reveal>
          <div className="testimonials-heading">
            <p className="eyebrow">PEOPLE / PROJECTS / PERSPECTIVE</p>
            <TextReveal as="h1" id="testimonials-title" text="Testimonials." />
            <p className="testimonials-subtitle">
              {reviews.length ? "What people say about working with me." : "Worked together? I'd like to hear from you."}
            </p>
          </div>
        </Reveal>
      }
    >
      {reviews.length === 0 && (
        <Reveal>
          <div className="testimonial-feedback-invitation">
            <p className="eyebrow">YOUR EXPERIENCE</p>
            <h2>Share your feedback.</h2>
            <p>Tell me about the project, what worked and what I could improve.</p>
            <a className="button button-gold" href={`mailto:${site.email}?subject=Project%20feedback`}>
              Send your feedback
            </a>
          </div>
        </Reveal>
      )}
      <div className="testimonials-grid">
        {reviews.map((review, index) => (
          <Reveal key={review.id} delay={(index % 4) * 0.07}>
            <div
              className="testimonial-float"
              style={
                {
                  "--review-duration": `${19 + (index % 4) * 3}s`,
                  "--review-delay": `${-index * 4.7}s`,
                  "--review-angle": `${index % 2 ? 0.65 : -0.65}deg`,
                } as CSSProperties
              }
            >
              <figure className="testimonial-card">
                <span className="testimonial-quote-mark" aria-hidden="true">
                  “
                </span>
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
