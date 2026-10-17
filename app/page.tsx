import type { Metadata } from "next";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Work } from "@/components/work";
import {
  getServices,
  getFaqs,
  getTestimonials,
  getProjects,
  getBots,
  getSkills,
  getCertificates,
  getIdentity,
} from "@/lib/content-loader";

import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Certifications } from "@/components/certifications";
import { Contact } from "@/components/contact";
import { ScrollProgress } from "@/components/scroll-progress";
import { EditorialEffects } from "@/components/editorial-effects";
import { ScrollAmbience } from "@/components/scroll-ambience";
import { ReadingEffects } from "@/components/reading-effects";

import {
  Services,
  Workflow,
  Journey,
  WorkBunch,
} from "@/components/studio-sections";
import { WallOfLove } from "@/components/wall-of-love";

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
  const [
    projects,
    skills,
    certificates,
    bots,
    identity,
    services,
    faqs,
    reviews,
  ] = await Promise.all([
    getProjects(),
    getSkills(),
    getCertificates(),
    getBots(),
    getIdentity(),
    getServices(),
    getFaqs(),
    getTestimonials(),
  ]);
  return (
    <div id="top">
      <ScrollProgress />
      <EditorialEffects />
      <ScrollAmbience />
      <ReadingEffects />
      <div className="ambient-background" aria-hidden="true">
        <span />
        <span />
      </div>
      <Navbar identity={identity} />
      <main id="main-content">
        <Hero />
        <Services services={services} />
        <Work projects={projects} bots={bots} />
        <WorkBunch projects={projects} />
        <Experience />
        <Journey />
        <Skills skills={skills} />
        <Certifications certificates={certificates} />
        <Workflow />
        <WallOfLove testimonials={reviews} />
        <FaqSection faqs={faqs} />
        <Contact email={identity.email} />
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </div>
  );
}
