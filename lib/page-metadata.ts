import type { Metadata } from "next";
import { portfolioPages, type PortfolioPage } from "@/data/navigation";
import { site } from "@/data/site";

const serviceTitles: Partial<Record<PortfolioPage, string>> = {
  websites: "Web Design & Development Services | Elvora",
  bots: "Custom AI Agents for Websites | Elvora",
};

export function pageMetadata(page: PortfolioPage): Metadata {
  const { label, href, description } = portfolioPages[page];
  const title = serviceTitles[page] || `${label} — ${site.brand}`;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      title,
      description,
      url: href,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
