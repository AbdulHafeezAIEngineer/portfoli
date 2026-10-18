import type { Metadata } from "next";
import { getIdentity, getProjects } from "@/lib/content-loader";
import { Hero } from "@/components/hero";
import { HomeDirectory } from "@/components/home-directory";
import { LegacySectionRedirect } from "@/components/legacy-section-redirect";
import { SiteShell } from "@/components/site-shell";

// Public CMS metadata belongs to the public page, so private sign-in can render during a CMS outage.
export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  return {
    title: identity.title,
    description: identity.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: identity.brand,
      title: identity.title,
      description: identity.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: identity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
      images: ["/opengraph-image"],
    },
  };
}
export const dynamic = "force-dynamic";
export default async function Home() {
  const projects = await getProjects();
  return (
    <SiteShell>
      <LegacySectionRedirect />
      <Hero />
      <HomeDirectory projects={projects} />
    </SiteShell>
  );
}
