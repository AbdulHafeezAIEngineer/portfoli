import { WorkBunch } from "@/components/work-bunch";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getProjects } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("collection");

export default async function Page() {
  const projects = await getProjects();
  return (
    <SiteShell page="collection">
      <WorkBunch standalone projects={projects} />
    </SiteShell>
  );
}
