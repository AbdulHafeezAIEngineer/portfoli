"use client";

import { useEffect } from "react";
import { useMotionPreference } from "./motion-preference";

/** Native details render on the server; animation code arrives only near the FAQ. */
export function FaqEnhancement() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const root = document.getElementById("faq");
    if (!root || reduced) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void import("@/lib/faq-animation")
          .then((module) => {
            if (!cancelled) cleanup = module.enhanceFaq(root);
          })
          .catch(() => {
            /* Native disclosure remains functional. */
          });
      },
      { rootMargin: "300px" },
    );
    observer.observe(root);
    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [reduced]);
  return null;
}
