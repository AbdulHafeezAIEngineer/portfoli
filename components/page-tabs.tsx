"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  aboutPages,
  portfolioPages,
  type PortfolioPage,
} from "@/data/navigation";

export function PageTabs({ page }: { page: PortfolioPage }) {
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const active = row.current?.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    if (active && row.current)
      row.current.scrollLeft =
        active.offsetLeft -
        row.current.offsetLeft -
        (row.current.clientWidth - active.offsetWidth) / 2;
  }, [page]);
  const profile = aboutPages.some((id) => id === page);
  const bots = page === "bots" || page === "embedding";
  const pages = profile
    ? aboutPages
    : bots
      ? (["bots", "embedding"] as const)
      : null;
  if (!pages) return null;
  return (
    <nav
      className="page-tabs"
      aria-label={profile ? "About Me pages" : "AI Bots pages"}
    >
      <div className="container page-tabs-inner" ref={row}>
        {pages.map((id) => (
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
