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
  return [...Object.keys(concepts), ...Object.keys(demos)].map((slug) => ({
    slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const demo =
    concepts[(await params).slug as ConceptSlug] ||
    demos[(await params).slug as DemoSlug];
  return {
    title: demo ? `${demo.name} — Elvora concept` : "Concept not found",
    description: demo?.intro,
    alternates: { canonical: `/demo/${(await params).slug}` },
  };
}
export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (Object.hasOwn(concepts, (await params).slug))
    return <ConceptSite slug={(await params).slug as ConceptSlug} />;
  if (!Object.hasOwn(demos, (await params).slug)) notFound();
  return <DemoSite slug={(await params).slug as DemoSlug} />;
}
