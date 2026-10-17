import type { MetadataRoute } from "next";
import { getServices, getProjects } from "@/lib/content-loader";
import { site } from "@/data/site";
import { studies } from "@/data/studies";
import { concepts } from "@/data/concepts";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([
    getServices(),
    getProjects(),
  ]);
  return [
    ...services.map((service) => ({
      url: `${site.url}/services/${service.id}`,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.id}`,
      priority: 0.6,
    })),
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...["privacy", "cookies", "terms"].map((path) => ({
      url: `${site.url}/${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    ...studies.map((study) => ({
      url: `${site.url}/studies/${study.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...Object.keys(concepts).map((slug) => ({
      url: `${site.url}/demo/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
