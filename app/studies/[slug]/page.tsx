import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { studies } from "@/data/studies";
import { DesignStudy } from "@/components/design-study";
import "../studies.css";
export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map(({ id }) => ({ slug: id }));
}
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const study = studies.find(({ id }) => id === params.slug);
  return {
    title: study ? `${study.name} — UI study by Elvora` : "Study not found",
    description: study?.description,
    alternates: { canonical: `/studies/${params.slug}` },
  };
}
export default function Page({ params }: { params: { slug: string } }) {
  const study = studies.find(({ id }) => id === params.slug);
  if (!study) notFound();
  return <DesignStudy study={study} />;
}
