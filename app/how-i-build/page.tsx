import { Workflow } from "@/components/studio-sections";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("process");

export default function Page() {
  return (
    <SiteShell page="process">
      <Workflow />
    </SiteShell>
  );
}
