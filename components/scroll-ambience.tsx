"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

export function ScrollAmbience() {
  const wash = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  const pathname = usePathname();
  useEffect(() => {
    if (reduced) return;
    const scene = wash.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const animations = [
      ...document.querySelectorAll<HTMLElement>("[data-velocity-marquee]"),
    ].flatMap((element) => element.getAnimations());
    const marquees = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          (entry.target as HTMLElement).dataset.scrollVisible = String(
            entry.isIntersecting,
          );
      },
      { rootMargin: "120px" },
    );
    for (const element of document.querySelectorAll("[data-velocity-marquee]"))
      marquees.observe(element);
    const visible = new Set<HTMLElement>();
    const watched = new Set<HTMLElement>();
    const images = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        }
      },
      { rootMargin: "80px" },
    );
    const scan = () => {
      for (const element of watched)
        if (!element.isConnected) {
          images.unobserve(element);
          watched.delete(element);
          visible.delete(element);
        }
      for (const element of document.querySelectorAll<HTMLElement>(
        "[data-parallax]",
      )) {
        if (!watched.has(element)) {
          watched.add(element);
          images.observe(element);
        }
      }
    };
    scan();
    let reset: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeScroll(({ viewport, velocity }) => {
      const moves: [HTMLElement, number][] = [];
      if (fine.matches)
        for (const element of visible) {
          if (!element.isConnected) {
            visible.delete(element);
            continue;
          }
          const rect = element.getBoundingClientRect();
          const distance = Math.max(
            -1,
            Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / viewport),
          );
          moves.push([element, distance * Math.min(28, rect.height * 0.035)]);
        }
      for (const [element, distance] of moves)
        element.style.setProperty("--image-drift", `${distance}px`);
      const rate = 1 + Math.min(1.2, Math.abs(velocity) * 0.3);
      for (const animation of animations) animation.updatePlaybackRate(rate);
      clearTimeout(reset);
      reset = setTimeout(() => {
        for (const animation of animations) animation.updatePlaybackRate(1);
      }, 180);
    });
    const scenes = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting && scene)
            scene.style.opacity = ["work", "work-bunch", "contact"].includes(
              entry.target.id,
            )
              ? ".12"
              : ".035";
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );
    for (const element of document.querySelectorAll("main > section[id]"))
      scenes.observe(element);
    return () => {
      unsubscribe();
      images.disconnect();
      marquees.disconnect();
      for (const element of document.querySelectorAll<HTMLElement>(
        "[data-scroll-visible]",
      ))
        delete element.dataset.scrollVisible;
      scenes.disconnect();
      clearTimeout(reset);
      for (const element of watched)
        element.style.removeProperty("--image-drift");
      for (const animation of animations) animation.updatePlaybackRate(1);
      if (scene) scene.style.opacity = "0";
    };
  }, [reduced, pathname]);
  return <div ref={wash} className="scene-wash" aria-hidden="true" />;
}
