"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  aboutPages,
  portfolioPages,
  type PortfolioPage,
} from "@/data/navigation";

const subjectSections = {
  websites: [
    { id: "work", label: "Website concepts" },
    { id: "workflow", label: "How I Build Websites" },
    { id: "fundamentals", label: "Technical Domains" },
  ],
  bots: [
    { id: "ai-bots", label: "AI Bots" },
    { id: "bot-build", label: "How I Build Bots" },
    { id: "embed-methods", label: "How I Embed Bots" },
  ],
};
export function PageTabs({ page }: { page: PortfolioPage }) {
  const row = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const sections =
    page === "websites" || page === "bots" ? subjectSections[page] : null;
  const profile = aboutPages.some((id) => id === page);
  useEffect(() => {
    if (!sections) {
      const selected = row.current?.querySelector<HTMLElement>(
        '[aria-current="page"]',
      );
      if (selected && row.current)
        row.current.scrollLeft =
          selected.offsetLeft -
          row.current.offsetLeft -
          (row.current.clientWidth - selected.offsetWidth) / 2;
      return;
    }
    setActive(sections[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-10% 0px -55% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [page, sections]);
  if (!sections && !profile) return null;
  return (
    <nav
      className="page-tabs"
      aria-label={
        profile
          ? "About Me pages"
          : `${page === "bots" ? "AI Bots" : "Websites"} sections`
      }
    >
      <div className="container page-tabs-inner" ref={row}>
        {sections
          ? sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={active === section.id ? "location" : undefined}
              >
                {section.label}
              </a>
            ))
          : aboutPages.map((id) => (
              <Link
                key={id}
                href={portfolioPages[id].href}
                aria-current={id === page ? "page" : undefined}
              >
                {portfolioPages[id].label}
              </Link>
            ))}
      </div>
    </nav>
  );
}
