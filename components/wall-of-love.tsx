"use client";
import { useMotionPreference } from "./motion-preference";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  Quote,
  UserRound,
} from "lucide-react";
import { studio } from "@/data/studio";
import type { Testimonial } from "@/data/agency";
import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import type { CSSProperties } from "react";

export function WallOfLove({ testimonials }: { testimonials: Testimonial[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const { reduced } = useMotionPreference();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(true);
  const swipe = useRef<{ x: number; y: number; time: number } | null>(null);
  const remaining = useRef(6500);
  const review = testimonials[index];
  const autoplay = hydrated && playing && !reduced && testimonials.length > 1;
  const active = autoplay && !interacting && inView && visible;
  useEffect(() => {
    setHydrated(true);
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    remaining.current = 6500;
  }, [index, reduced]);
  useEffect(() => {
    if (!active || testimonials.length < 2) return;
    const started = performance.now();
    const timer = window.setTimeout(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % testimonials.length);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (performance.now() - started),
      );
    };
  }, [active, index, testimonials.length]);
  if (!testimonials.length)
    return (
      <section
        id="wall-of-love"
        className="container studio-section love-section editorial-love"
        aria-labelledby="love-title"
      >
        <Reveal>
          <p className="eyebrow">{studio.love.eyebrow}</p>
          <div className="studio-heading reference-love-heading">
            <TextReveal id="love-title" text={studio.love.title} />
          </div>
          <div className="love-empty">
            <span className="love-empty-mark" aria-hidden="true">
              “
            </span>
            <div>
              <p className="eyebrow">PEOPLE / PROJECTS / PERSPECTIVE</p>
              <h3>The next story could start here.</h3>
              <p>
                Client stories will appear here when shared with permission.
              </p>
              <a href="#contact" className="text-link">
                Start a conversation <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    );
  function go(next: number) {
    setPlaying(false);
    setDirection(next > index ? 1 : -1);
    setIndex((next + testimonials.length) % testimonials.length);
  }
  return (
    <section
      ref={ref}
      id="wall-of-love"
      className="container studio-section love-section editorial-love"
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
        data-rotation-active={active}
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            go(index + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            setInteracting(false);
        }}
        onPointerDown={(event) => {
          if (
            event.pointerType !== "touch" ||
            (event.target as Element).closest("button")
          )
            return;
          swipe.current = {
            x: event.clientX,
            y: event.clientY,
            time: performance.now(),
          };
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || performance.now() - start.time > 800) return;
          const x = event.clientX - start.x;
          const y = event.clientY - start.y;
          if (Math.abs(x) > 48 && Math.abs(x) > Math.abs(y) * 1.2)
            go(index + (x < 0 ? 1 : -1));
        }}
      >
        {testimonials.length > 1 &&
          [-1, 1].map((offset) => {
            const adjacent =
              testimonials[
                (index + offset + testimonials.length) % testimonials.length
              ];
            return (
              <m.div
                className={`love-preview-card ${offset < 0 ? "love-preview-left" : "love-preview-right"}`}
                key={`${offset}-${adjacent.id}`}
                aria-hidden="true"
                initial={
                  reduced
                    ? false
                    : { opacity: 0, x: offset * 18, rotate: offset * 5 }
                }
                animate={{ opacity: 0.5, x: 0, rotate: offset * 5 }}
                transition={{
                  duration: reduced ? 0 : 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Quote size={29} strokeWidth={1} />
                <p>{adjacent.quote}</p>
                <span className="love-preview-person">
                  <UserRound size={23} strokeWidth={1} />
                  <span>{adjacent.role}</span>
                </span>
              </m.div>
            );
          })}
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
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <m.div
                key={review.id}
                custom={direction}
                variants={{
                  enter: (travel: number) =>
                    reduced
                      ? { opacity: 1, x: 0 }
                      : {
                          opacity: 0,
                          x: travel * 28,
                          y: 8,
                          rotate: travel * 1.2,
                        },
                  center: { opacity: 1, x: 0, y: 0, rotate: 0 },
                  leave: (travel: number) =>
                    reduced
                      ? { opacity: 1, x: 0 }
                      : {
                          opacity: 0,
                          x: travel * -22,
                          y: -4,
                          rotate: travel * -0.6,
                        },
                }}
                initial="enter"
                animate="center"
                exit="leave"
                transition={{
                  duration: reduced ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Review ${index + 1} of ${testimonials.length}`}
              >
                <blockquote>
                  <span className="sr-only">{review.quote}</span>
                  <span aria-hidden="true">
                    {review.quote.split(/\s+/).map((word, number) => (
                      <span
                        className="review-word"
                        key={number}
                        style={
                          {
                            "--review-word-delay": `${Math.min(number, 35) * 0.022}s`,
                          } as CSSProperties
                        }
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </span>
                </blockquote>
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
            <div
              key={review.id}
              className="love-progress"
              aria-hidden="true"
              data-autoplay={hydrated && !reduced && testimonials.length > 1}
            >
              {testimonials.map((item, i) => (
                <span key={item.id} className={i === index ? "current" : ""} />
              ))}
            </div>
            <div>
              <button
                type="button"
                className="icon-button"
                onClick={() => go(index - 1)}
                disabled={testimonials.length < 2}
                aria-label={studio.love.previous}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="icon-button"
                disabled={
                  (hydrated && Boolean(reduced)) || testimonials.length < 2
                }
                onClick={() => setPlaying((value) => !value)}
                aria-label={autoplay ? studio.love.pause : studio.love.play}
              >
                {autoplay ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => go(index + 1)}
                disabled={testimonials.length < 2}
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
