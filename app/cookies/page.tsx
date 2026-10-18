import { LegalPage } from "@/components/legal-page";
import { legalPageMetadata } from "@/lib/legal-metadata";

export const metadata = legalPageMetadata("cookies");
export default function Page() {
  return <LegalPage page="cookies" />;
}
