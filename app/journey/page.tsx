import { Journey } from "@/components/studio-sections";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("journey");

export default function Page() {
  return (
    <SiteShell page="journey">
      <Journey />
    </SiteShell>
  );
}
