import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { studies } from "@/data/studies";
import { concepts } from "@/data/concepts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
