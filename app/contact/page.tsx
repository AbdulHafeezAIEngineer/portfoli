import { Contact } from "@/components/contact";
import { SiteShell } from "@/components/site-shell";
import { getIdentity } from "@/lib/content-loader";
import { pageMetadata } from "@/lib/page-metadata";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("contact");
export default async function Page() {
  const identity = await getIdentity();
  return (
    <SiteShell page="contact">
      <Contact email={identity.email} />
    </SiteShell>
  );
}
