import type { MetadataRoute } from "next";
import { getHikes } from "@/lib/hikes";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pd-goricko-tromeja.si";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/pohodi", "/galerija", "/o-drustvu", "/kontakt"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const hikeRoutes = getHikes().map((hike) => ({
    url: `${siteUrl}/pohodi/${hike.slug}`,
    lastModified: new Date(hike.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...hikeRoutes];
}
