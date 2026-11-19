import type { MetadataRoute } from "next"
import { buildSitemap } from "@/lib/seo/public-routes"

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap()
}