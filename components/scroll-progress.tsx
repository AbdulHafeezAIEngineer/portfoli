"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

export function ScrollProgress() {
  const progress = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const journey = document.querySelector<HTMLElement>(
      ".journey-editorial-list",
    );
    return subscribeScroll(({ y, height, viewport }) => {
      const amount = Math.min(
        1,
        Math.max(0, y / Math.max(1, height - viewport)),
      );
      const rect = journey?.getBoundingClientRect();
      const journeyAmount = rect
        ? Math.min(1, Math.max(0, (viewport * 0.7 - rect.top) / rect.height))
        : 0;
      if (progress.current)
        progress.current.style.transform = `scaleX(${amount})`;
      journey?.style.setProperty(
        "--journey-progress",
        String(reduced ? 1 : journeyAmount),
      );
    });
  }, [reduced]);
  return <div ref={progress} className="scroll-progress" aria-hidden="true" />;
}
