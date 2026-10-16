import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Cookie Policy — Elvora",
  alternates: { canonical: "/cookies" },
};
export default function Page() {
  return <LegalPage page="cookies" />;
}
