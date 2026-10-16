"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Quote,
  UserRound,
} from "lucide-react";
import { studio, testimonials } from "@/data/studio";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";

export function WallOfLove() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(true);
  const review = testimonials[index];
  const autoplay = hydrated && playing && !reduced;
  const active = autoplay && !interacting && inView && visible;
  useEffect(() => {
    setHydrated(true);
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!active || testimonials.length < 2) return;
    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % testimonials.length),
      6500,
    );
    return () => window.clearTimeout(timer);
  }, [active, index]);
  function go(next: number) {
    setPlaying(false);
    setIndex((next + testimonials.length) % testimonials.length);
  }
  return (
    <section
      ref={ref}
      id="wall-of-love"
      className="container studio-section love-section"
      aria-labelledby="love-title"
    >
      <Reveal>
        <p className="eyebrow">{studio.love.eyebrow}</p>
        <div className="studio-heading reference-love-heading">
          <TextReveal id="love-title" text={studio.love.title} />
          <p>{studio.love.intro}</p>
        </div>
      </Reveal>
      <div
        className="love-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            setInteracting(false);
        }}
      >
        <div className="love-offset" aria-hidden="true" />
        <div className="love-offset" aria-hidden="true" />
        <div className="love-card">
          <div className="love-card-top">
            <Quote size={35} strokeWidth={1} aria-hidden="true" />
            <span className="eyebrow">
              {review.placeholder
                ? studio.love.previewLabel
                : studio.love.eyebrow}
            </span>
            <span className="love-count">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>
          <div
            className="love-slide-area"
            aria-live={autoplay ? "off" : "polite"}
            aria-atomic="true"
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={review.id}
                initial={
                  reduced ? false : { opacity: 0, y: 15, filter: "blur(3px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 0, y: -12, filter: "blur(3px)" }
                }
                transition={{ duration: reduced ? 0 : 0.4 }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Review ${index + 1} of ${testimonials.length}`}
              >
                <blockquote>{review.quote}</blockquote>
                <div className="review-person">
                  <div className="review-avatar">
                    {review.portrait && !review.placeholder ? (
                      <Image
                        src={review.portrait}
                        alt={review.name}
                        width={60}
                        height={60}
                      />
                    ) : (
                      <UserRound
                        size={27}
                        strokeWidth={1}
                        aria-label={studio.love.personPlaceholder}
                      />
                    )}
                  </div>
                  <div>
                    <strong>{review.name}</strong>
                    <small>{review.role}</small>
                  </div>
                </div>
              </m.div>
            </AnimatePresence>
          </div>
          <div className="love-controls">
            <div className="love-progress" aria-hidden="true">
              {testimonials.map((item, i) => (
                <span key={item.id} className={i === index ? "current" : ""} />
              ))}
            </div>
            <div>
              <button
                type="button"
                className="icon-button"
                onClick={() => go(index - 1)}
                aria-label={studio.love.previous}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="icon-button"
                disabled={hydrated && Boolean(reduced)}
                onClick={() => setPlaying((value) => !value)}
                aria-label={autoplay ? studio.love.pause : studio.love.play}
              >
                {autoplay ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => go(index + 1)}
                aria-label={studio.love.next}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {testimonials.some((item) => item.placeholder) && (
        <p className="studio-note love-disclosure">{studio.love.notice}</p>
      )}
    </section>
  );
}
