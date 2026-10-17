"use client";
import { useEffect } from "react";
export function RevealObserver() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !window.IntersectionObserver) {
      delete document.documentElement.dataset.motionReveals;
      return;
    }
    const observed = new WeakSet<Element>();
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
    scan(document.body);
    const mutation = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes)
          if (node instanceof Element) scan(node);
    });
    mutation.observe(document.body, { childList: true, subtree: true });
    const change = () => {
      if (media.matches) {
        delete document.documentElement.dataset.motionReveals;
        observer.disconnect();
      }
    };
    media.addEventListener("change", change);
    return () => {
      observer.disconnect();
      mutation.disconnect();
      media.removeEventListener("change", change);
    };
  }, []);
  return null;
}
