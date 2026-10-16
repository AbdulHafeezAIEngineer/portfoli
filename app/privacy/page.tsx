import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Privacy Policy — Elvora",
  alternates: { canonical: "/privacy" },
};
export default function Page() {
  return <LegalPage page="privacy" />;
}
