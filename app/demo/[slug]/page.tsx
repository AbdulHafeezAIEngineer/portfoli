import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demos, type DemoSlug } from "@/data/demos";
import { DemoSite } from "@/components/demo-site";
import "../demo.css";
export const dynamic = "force-dynamic";
export function generateStaticParams() {
  return Object.keys(demos).map((slug) => ({ slug }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const demo = demos[params.slug as DemoSlug];
  return {
    title: demo ? `${demo.name} — Elvora concept` : "Concept not found",
    description: demo?.intro,
    alternates: { canonical: `/demo/${params.slug}` },
  };
}
export default function DemoPage({ params }: { params: { slug: string } }) {
  if (!Object.hasOwn(demos, params.slug)) notFound();
  return <DemoSite slug={params.slug as DemoSlug} />;
}
