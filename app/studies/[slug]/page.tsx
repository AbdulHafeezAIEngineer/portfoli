import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { studies } from "@/data/studies";
import { DesignStudy } from "@/components/design-study";
import "../studies.css";
export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map(({ id }) => ({ slug: id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = studies.find(({ id }) => id === slug);
  return {
    title: study ? `${study.name} — UI study by Elvora` : "Study not found",
    description: study?.description,
    alternates: { canonical: `/studies/${(await params).slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = studies.find(({ id }) => id === slug);
  if (!study) notFound();
  return <DesignStudy study={study} />;
}
