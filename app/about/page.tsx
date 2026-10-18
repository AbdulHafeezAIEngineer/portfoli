import { Experience } from "@/components/experience";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("about");

export default function Page() {
  return (
    <SiteShell page="about">
      <Experience />
    </SiteShell>
  );
}
