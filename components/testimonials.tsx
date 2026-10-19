import Image from "next/image";
import Link from "next/link";
import type { Testimonial } from "@/data/agency";
export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const reviews = testimonials.filter((review) => !review.placeholder);
  return (
    <section
      className="container field-reviews"
      aria-labelledby="testimonials-title"
    >
      <p className="eyebrow">CLIENT FEEDBACK</p>
      <h1 id="testimonials-title">
        {reviews.length
          ? "Published reviews."
          : "No client reviews published yet."}
      </h1>
      {!reviews.length ? (
        <div className="field-review-empty">
          <p>
            The work shown here is concept work. I have no permission-approved
            client reviews to publish.
          </p>
          <p>
            You can test Kovo’s enquiry form, compare Solenne’s sample stays or
            ask Veldt a delivery question.
          </p>
          <Link href="/websites">Inspect the website concepts ↗</Link>
          <Link href="/ai-bots">Try the assistants ↗</Link>
        </div>
      ) : (
        <div className="field-review-list">
          {reviews.map((review) => (
            <figure key={review.id}>
              <blockquote>{review.quote}</blockquote>
              <figcaption>
                {review.portrait && (
                  <Image src={review.portrait} width={44} height={44} alt="" />
                )}
                <span>
                  <strong>{review.name}</strong>
                  <small>{review.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
