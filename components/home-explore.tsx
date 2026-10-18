"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionPreference } from "./motion-preference";

export function HomeExplore({ children }: { children: ReactNode }) {
  const region = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    const element = region.current;
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
    <div
      ref={region}
      className="home-more home-band-light"
      data-explore-active={visible && foreground && !reduced}
    >
      {children}
    </div>
  );
}
