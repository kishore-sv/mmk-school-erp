import type { MetadataRoute } from "next"
import { features } from "@/data/features"
import { integrations } from "@/data/integrations"
import { modules } from "@/data/modules"
import { solutions } from "@/data/solutions"
import { siteConfig } from "@/config/site"

type RouteSpec = {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}

/** Paths and SEO hints for static marketing pages. Keep in sync with routes under `app`. */
const staticRoutes: RouteSpec[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/platform", changeFrequency: "monthly", priority: 0.85 },
  { path: "/platform/teacher-portal", changeFrequency: "monthly", priority: 0.75 },
  { path: "/platform/student-portal", changeFrequency: "monthly", priority: 0.75 },
  { path: "/platform/parent-portal", changeFrequency: "monthly", priority: 0.75 },
  { path: "/platform/school-admin-portal", changeFrequency: "monthly", priority: 0.75 },
  { path: "/platform/platform-administration", changeFrequency: "monthly", priority: 0.75 },
  { path: "/modules", changeFrequency: "weekly", priority: 0.85 },
  { path: "/integrations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/admissions-website", changeFrequency: "monthly", priority: 0.75 },
  { path: "/mobile-app", changeFrequency: "monthly", priority: 0.75 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
  { path: "/book-demo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/security", changeFrequency: "yearly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.75 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.7 },
]

const catalogRoutes: RouteSpec[] = [
  ...modules.map((item) => ({
    path: `/modules/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })),
  ...features.map((item) => ({
    path: `/features/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
  ...integrations.map((item) => ({
    path: `/integrations/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })),
  ...solutions.map((item) => ({
    path: `/solutions/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })),
]

export function buildSitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const routes = [...staticRoutes, ...catalogRoutes]

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path || "/", siteConfig.url).toString(),
    lastModified,
    changeFrequency,
    priority,
  }))
}

export function publicPathnames(): string[] {
  return [...staticRoutes, ...catalogRoutes].map((route) => route.path || "/")
}