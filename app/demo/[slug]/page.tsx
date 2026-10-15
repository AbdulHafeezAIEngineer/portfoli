import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demos, type DemoSlug } from "@/data/demos";
import { DemoSite } from "@/components/demo-site";
import { concepts, type ConceptSlug } from "@/data/concepts";
import { ConceptSite } from "@/components/concept-site";
import "../demo.css";
import "../concepts.css";
export const dynamic = "force-dynamic";
export function generateStaticParams() {
  return [...Object.keys(concepts), ...Object.keys(demos)].map((slug) => ({ slug }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const demo = concepts[params.slug as ConceptSlug] || demos[params.slug as DemoSlug];
  return {
    title: demo ? `${demo.name} — Elvora concept` : "Concept not found",
    description: demo?.intro,
    alternates: { canonical: `/demo/${params.slug}` },
  };
}
export default function DemoPage({ params }: { params: { slug: string } }) {
  if (Object.hasOwn(concepts, params.slug)) return <ConceptSite slug={params.slug as ConceptSlug} />;
  if (!Object.hasOwn(demos, params.slug)) notFound();
  return <DemoSite slug={params.slug as DemoSlug} />;
}
