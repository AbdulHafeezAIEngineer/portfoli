"use client";
import { useEffect } from "react";
import { useMotionPreference } from "./motion-preference";
export function RevealObserver() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    let observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    const scan = (root: Element) => {
      const elements = [
        ...root.querySelectorAll("[data-reveal]"),
        ...(root.matches("[data-reveal]") ? [root] : []),
      ];
      for (const element of elements)
        if (!observed.has(element)) {
          observed.add(element);
          observer.observe(element);
        }
    };
    const change = () => {
      observer.disconnect();
      if (reduced) {
        delete document.documentElement.dataset.motionReveals;
        return;
      }
      document.documentElement.dataset.motionReveals = "enabled";
      observed = new WeakSet<Element>();
      scan(document.body);
    };
    change();
    const mutation = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes)
          if (!reduced && node instanceof Element) scan(node);
    });
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [reduced]);
  return null;
}
