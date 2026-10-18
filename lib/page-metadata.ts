import type { Metadata } from "next";
import { portfolioPages, type PortfolioPage } from "@/data/navigation";
import { site } from "@/data/site";

export function pageMetadata(page: PortfolioPage): Metadata {
  const { label, href, description } = portfolioPages[page];
  const title = `${label} — ${site.brand}`;
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
