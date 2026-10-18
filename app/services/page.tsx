import { Services } from "@/components/studio-sections";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getServices } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("services");

export default async function Page() {
  const services = await getServices();
  return (
    <SiteShell page="services">
      <Services services={services} />
    </SiteShell>
  );
}
