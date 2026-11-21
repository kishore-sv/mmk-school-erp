"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getFeature } from "@/data/features"
import { getIntegration } from "@/data/integrations"
import { getModule } from "@/data/modules"
import { getSolution } from "@/data/solutions"

type Crumb = { label: string; href?: string }

const home: Crumb = { label: "Home", href: "/" }
const missing: Crumb[] = [home, { label: "Page not found" }]

const staticCrumbs: Record<string, Crumb[]> = {
  "/": [{ label: "Home" }],
  "/about": [home, { label: "About" }],
  "/pricing": [home, { label: "Pricing" }],
  "/contact": [home, { label: "Contact" }],
  "/faq": [home, { label: "Frequently asked questions" }],
  "/privacy": [home, { label: "Privacy" }],
  "/terms": [home, { label: "Terms" }],
  "/security": [home, { label: "Security" }],
  "/resources": [home, { label: "Resources" }],
  "/book-demo": [home, { label: "Book a demo" }],
  "/mobile-app": [home, { label: "Mobile app" }],
  "/admissions-website": [home, { label: "Admissions website" }],
  "/modules": [home, { label: "Modules" }],
  "/integrations": [home, { label: "Integrations" }],
  "/solutions": [home, { label: "Solutions" }],
  "/platform": [home, { label: "Platform" }],
  "/platform/teacher-portal": [
    home,
    { label: "Platform", href: "/platform" },
    { label: "Teacher portal" },
  ],
  "/platform/student-portal": [
    home,
    { label: "Platform", href: "/platform" },
    { label: "Student portal" },
  ],
  "/platform/parent-portal": [
    home,
    { label: "Platform", href: "/platform" },
    { label: "Parent portal" },
  ],
  "/platform/school-admin-portal": [
    home,
    { label: "Platform", href: "/platform" },
    { label: "School admin portal" },
  ],
  "/platform/platform-administration": [
    home,
    { label: "Platform", href: "/platform" },
    { label: "Platform administration" },
  ],
}

function crumbsForPath(pathname: string): Crumb[] {
  const known = staticCrumbs[pathname]
  if (known) return known
  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] === "modules" && parts[1] && parts.length === 2) {
    const module = getModule(parts[1])
    if (!module) return missing
    return [home, { label: "Modules", href: "/modules" }, { label: module.title }]
  }
  if (parts[0] === "features" && parts[1] && parts.length === 2) {
    const feature = getFeature(parts[1])
    const parent = feature ? getModule(feature.moduleSlug) : undefined
    if (!feature || !parent) return missing
    return [
      home,
      { label: "Modules", href: "/modules" },
      { label: parent.title, href: `/modules/${parent.slug}` },
      { label: feature.title },
    ]
  }
  if (parts[0] === "solutions" && parts[1] && parts.length === 2) {
    const solution = getSolution(parts[1])
    if (!solution) return missing
    return [home, { label: "Solutions", href: "/solutions" }, { label: solution.title }]
  }
  if (parts[0] === "integrations" && parts[1] && parts.length === 2) {
    const integration = getIntegration(parts[1])
    if (!integration) return missing
    return [home, { label: "Integrations", href: "/integrations" }, { label: integration.title }]
  }
  return missing
}

export function RouteBreadcrumbs() {
  const pathname = usePathname()
  const crumbs = crumbsForPath(pathname)
  return (
    <div className="border-b border-border">
      <div className="mx-auto flex max-w-6xl px-4 py-3 sm:px-6">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1
              return (
                <Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {last || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={crumb.href} />}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}
