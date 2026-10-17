"use client";
import { useEffect } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

/** Scroll-scrubbed flip, including touch; the shared stream adds no extra scroll listener. */
export function LogoMotion() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const logo = document.querySelector<HTMLElement>("[data-logo-flip]");
    if (!logo || reduced) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      logo.dataset.logoVisible = String(entry.isIntersecting);
    });
    observer.observe(logo);
    const unsubscribe = subscribeScroll(({ y, viewport }) => {
      if (!visible) return;
      const scene = logo.closest<HTMLElement>(".hero-emblem")!;
      const start = Math.max(
        0,
        scene.getBoundingClientRect().top +
          y +
          logo.offsetTop -
          viewport * 0.65,
      );
      const progress = Math.max(
        0,
        Math.min(1, (y - start) / (viewport * 0.72)),
      );
      logo.style.setProperty("--logo-turn", `${progress * 360}deg`);
      logo.style.setProperty("--logo-lift", `${progress * -18}px`);
    });
    return () => {
      unsubscribe();
      observer.disconnect();
      logo.style.removeProperty("--logo-turn");
      logo.style.removeProperty("--logo-lift");
      delete logo.dataset.logoVisible;
    };
  }, [reduced]);
  return null;
}
