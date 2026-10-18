"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionPreference } from "./motion-preference";

/** Pause the original decorative loops without changing or restarting them. */
export function FooterMotion({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);
  const { reduced } = useMotionPreference();
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    const element = footer.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
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
    <footer
      ref={footer}
      className="editorial-footer"
      data-footer-active={visible && foreground && !reduced}
    >
      {children}
    </footer>
  );
}
