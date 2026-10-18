import { LegalPage } from "@/components/legal-page";
import { legalPageMetadata } from "@/lib/legal-metadata";

export const metadata = legalPageMetadata("privacy");
export default function Page() {
  return <LegalPage page="privacy" />;
}
