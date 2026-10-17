"use client";
import { useEffect } from "react";
import { useMotionPreference } from "./motion-preference";

/** Page content is present and readable immediately, never gated by scrolling. */
export function RevealObserver() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    if (reduced) delete document.documentElement.dataset.motionReveals;
    else document.documentElement.dataset.motionReveals = "enabled";
    for (const element of document.querySelectorAll("[data-reveal]"))
      element.classList.add("is-revealed");
  }, [reduced]);
  return null;
}
