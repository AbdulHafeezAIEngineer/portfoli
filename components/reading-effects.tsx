"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { useMotionPreference } from "./motion-preference";

export function ReadingEffects() {
  const { reduced } = useMotionPreference();
  const pathname = usePathname();
  useEffect(() => {
    if (reduced) return;
    const paragraphs = [
      ...document.querySelectorAll<HTMLElement>("[data-reading-text]"),
    ];
    const records = new Map(
      paragraphs.map((element) => [
        element,
        {
          words: [...element.querySelectorAll<HTMLElement>(".reading-word")],
          count: 0,
        },
      ]),
    );
    const visible = new Set<HTMLElement>();
    const update = (viewport: number) => {
      const changes = [...visible].map((element) => {
        const rect = element.getBoundingClientRect();
        const record = records.get(element)!;
        const progress = Math.max(
          0,
          Math.min(1, (viewport * 0.65 - rect.top) / Math.max(1, rect.height)),
        );
        return {
          element,
          record,
          count: Math.round(progress * record.words.length),
        };
      });
      for (const { record, count } of changes) {
        for (
          let index = Math.min(record.count, count);
          index < Math.max(record.count, count);
          index++
        )
          record.words[index].classList.toggle("is-read", index < count);
        record.count = count;
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        }
        update(window.innerHeight);
      },
      { rootMargin: "15% 0px" },
    );
    for (const element of paragraphs) {
      element.dataset.readingActive = "true";
      observer.observe(element);
    }
    const unsubscribe = subscribeScroll(({ viewport }) => update(viewport));
    return () => {
      unsubscribe();
      observer.disconnect();
      for (const [element, record] of records) {
        delete element.dataset.readingActive;
        for (const word of record.words) word.classList.remove("is-read");
      }
    };
  }, [reduced, pathname]);
  return null;
}
