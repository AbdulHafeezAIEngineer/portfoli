import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Work } from "@/components/work";
import {
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

import {
  Services,
  Workflow,
  Journey,
  ToolOrbit,
  WorkBunch,
} from "@/components/studio-sections";
import { WallOfLove } from "@/components/wall-of-love";

export const dynamic = "force-dynamic";
export default async function Home() {
  const [projects, skills, certificates, bots, identity] = await Promise.all([
    getProjects(),
    getSkills(),
    getCertificates(),
    getBots(),
    getIdentity(),
  ]);
  return (
    <div id="top">
      <ScrollProgress />
      <div className="ambient-background" aria-hidden="true">
        <span />
        <span />
      </div>
      <Navbar identity={identity} />
      <main id="main-content">
        <Hero />
        <Services />
        <Work projects={projects} bots={bots} />
        <WorkBunch projects={projects} />
        <Experience />
        <ToolOrbit />
        <Skills skills={skills} />
        <Workflow />
        <Journey />
        <Certifications certificates={certificates} />
        <WallOfLove />
        <Contact email={identity.email} />
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </div>
  );
}
