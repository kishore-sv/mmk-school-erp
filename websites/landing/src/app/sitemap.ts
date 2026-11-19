import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { features } from "@/data/features"
import { integrations } from "@/data/integrations"
import { modules } from "@/data/modules"
import { solutions } from "@/data/solutions"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/platform",
    "/platform/teacher-portal",
    "/platform/student-portal",
    "/platform/parent-portal",
    "/platform/school-admin-portal",
    "/platform/platform-administration",
    "/modules",
    "/integrations",
    "/admissions-website",
    "/mobile-app",
    "/pricing",
    "/book-demo",
    "/contact",
    "/about",
    "/security",
    "/privacy",
    "/terms",
    "/faq",
    "/resources",
    "/solutions",
  ]
  const dynamicPaths = [
    ...modules.map((item) => `/modules/${item.slug}`),
    ...features.map((item) => `/features/${item.slug}`),
    ...integrations.map((item) => `/integrations/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
  ]
  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: new URL(path || "/", siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }))
}
