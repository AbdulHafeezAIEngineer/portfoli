import { TechnicalDomains } from "@/components/experience";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("domains");

export default function Page() {
  return (
    <SiteShell page="domains">
      <TechnicalDomains />
    </SiteShell>
  );
}
