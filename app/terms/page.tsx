import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Terms of Service — Elvora",
  alternates: { canonical: "/terms" },
};
export default function Page() {
  return <LegalPage page="terms" />;
}
