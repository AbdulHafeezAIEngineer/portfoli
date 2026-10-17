import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.VERCEL_ENV === "preview" ||
      process.env.CONTEXT === "deploy-preview"
        ? { userAgent: "*", disallow: "/" }
        : { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
