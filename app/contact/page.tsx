import { Contact } from "@/components/contact";
import { FaqSection } from "@/components/faq-section";
import { SiteShell } from "@/components/site-shell";
import { getIdentity, getFaqs } from "@/lib/content-loader";
import { pageMetadata } from "@/lib/page-metadata";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("contact");
export default async function Page() {
  const [identity, faqs] = await Promise.all([getIdentity(), getFaqs()]);
  return (
    <SiteShell page="contact">
      <Contact email={identity.email} />
      <FaqSection faqs={faqs} />
    </SiteShell>
  );
}
