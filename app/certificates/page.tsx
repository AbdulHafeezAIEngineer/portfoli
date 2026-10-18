import { Certifications } from "@/components/certifications";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getCertificates } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("certificates");

export default async function Page() {
  const certificates = await getCertificates();
  return (
    <SiteShell page="certificates">
      <Certifications certificates={certificates} />
    </SiteShell>
  );
}
