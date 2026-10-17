"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./motion-preference";

/** Optional desktop enhancements; touch and reduced motion keep native scrolling. */
export function EditorialEffects() {
  const { reduced } = useMotionPreference();
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cleanup: (() => void) | undefined;
    const enable = () => {
      cleanup?.();
      if (!media.matches) return;
      let cancelled = false;
      let scroll: { destroy: () => void } | undefined;
      void import("lenis")
        .then(({ default: Lenis }) => {
          if (cancelled) return;
          scroll = new Lenis({
            autoRaf: true,
            smoothWheel: true,
            syncTouch: false,
            duration: 1.15,
            easing: (value: number) =>
              Math.min(1, 1.001 - Math.pow(2, -10 * value)),
            anchors: true,
            prevent: (node) =>
              Boolean(
                node.closest("dialog, .mobile-nav, [data-native-scroll]"),
              ),
          });
        })
        .catch(() => {
          /* Native scrolling remains available if the enhancement cannot load. */
        });
      let frame = 0;
      let magnetic: HTMLElement | null = null;
      const clear = () => {
        if (cursor.current) cursor.current.style.opacity = "0";
        magnetic?.style.removeProperty("translate");
        magnetic = null;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const target = event.target instanceof Element ? event.target : null;
          const view = target?.closest(
            ".project-card, .interface-study-card, .dome-tile, .dome-index a",
          );
          const button =
            target?.closest<HTMLElement>(
              ".hero-actions .button, .footer-brief-link",
            ) || null;
          if (magnetic !== button) {
            magnetic?.style.removeProperty("translate");
            magnetic = button;
          }
          if (button) {
            const rect = button.getBoundingClientRect();
            button.style.translate = `${(event.clientX - rect.left - rect.width / 2) * 0.06}px ${(event.clientY - rect.top - rect.height / 2) * 0.06}px`;
          }
          if (cursor.current) {
            cursor.current.style.opacity = view ? "1" : "0";
            cursor.current.style.transform = `translate3d(${event.clientX + 16}px, ${event.clientY + 16}px, 0)`;
          }
        });
      };
      document.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", clear);
      window.addEventListener("blur", clear);
      cleanup = () => {
        cancelled = true;
        scroll?.destroy();
        cancelAnimationFrame(frame);
        clear();
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", clear);
        window.removeEventListener("blur", clear);
      };
    };
    enable();
    media.addEventListener("change", enable);
    return () => {
      cleanup?.();
      media.removeEventListener("change", enable);
    };
  }, [reduced]);
  return (
    <div ref={cursor} className="project-view-cursor" aria-hidden="true">
      View ↗
    </div>
  );
}
