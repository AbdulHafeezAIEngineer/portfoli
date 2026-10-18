"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Pause, Play } from "lucide-react";
import { useMotionPreference } from "./motion-preference";

const stars = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 37 + 7) % 100}%`,
  top: `${(index * 23 + 4) % 100}%`,
  duration: `${11 + (index % 7)}s`,
  delay: `${-index * 1.7}s`,
  size: `${index % 4 === 0 ? 3 : 2}px`,
}));

export function TestimonialScene({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  const scene = useRef<HTMLElement>(null);
  const { reduced } = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "60px" },
    );
    observer.observe(element);
    const changed = () => setForeground(!document.hidden);
    changed();
    document.addEventListener("visibilitychange", changed);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", changed);
    };
  }, []);
  return (
    <section
      ref={scene}
      id="testimonials"
      className="container testimonials-section testimonials-page testimonial-scene"
      aria-labelledby="testimonials-title"
      data-testimonials-active={visible && foreground && !reduced && !paused}
    >
      <div className="testimonial-atmosphere" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            className="testimonial-star"
            key={index}
            style={
              {
                left: star.left,
                top: star.top,
                "--star-duration": star.duration,
                "--star-delay": star.delay,
                "--star-size": star.size,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {heading}
      <div className="testimonial-motion-toolbar">
        <button
          type="button"
          className="testimonial-motion-toggle"
          disabled={reduced}
          aria-label={
            paused
              ? "Resume testimonial animations"
              : "Pause testimonial animations"
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused || reduced ? (
            <Play size={13} aria-hidden="true" />
          ) : (
            <Pause size={13} aria-hidden="true" />
          )}
          {reduced
            ? "Motion off"
            : paused
              ? "Resume animation"
              : "Pause animation"}
        </button>
      </div>
      {children}
    </section>
  );
}
