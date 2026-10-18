import type { Metadata } from "next";
import { legal } from "@/data/privacy";
import { site } from "@/data/site";

type LegalPage = keyof typeof legal.pages;

const descriptions: Record<LegalPage, string> = {
  cookies:
    "How Elvora uses cookies and browser storage, which features are optional, and how to manage your cookie settings.",
  privacy:
    "How Elvora handles information when you browse the website, contact us or use a chatbot, including your privacy choices and rights.",
  terms:
    "Terms for using Elvora's website and demos, including concept projects, acceptable use and separate agreements for paid work.",
};

export function legalPageMetadata(page: LegalPage): Metadata {
  const title = `${legal.pages[page].title} — ${site.brand}`;
  const description = descriptions[page];
  const href = `/${page}`;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      type: "website",
      title,
      description,
      url: href,
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
