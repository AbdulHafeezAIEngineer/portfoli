import { TechnicalDomains } from "@/components/experience";
import { Workflow } from "@/components/studio-sections";
import { Work } from "@/components/work";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getProjects } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("websites");

export default async function Page() {
  const projects = await getProjects();
  return (
    <SiteShell page="websites">
      <Work projects={projects} />
      <Workflow />
      <TechnicalDomains />
    </SiteShell>
  );
}
