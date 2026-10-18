import { LegalPage } from "@/components/legal-page";
import { legalPageMetadata } from "@/lib/legal-metadata";

export const metadata = legalPageMetadata("terms");
export default function Page() {
  return <LegalPage page="terms" />;
}
