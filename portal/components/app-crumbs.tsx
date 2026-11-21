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

type Crumb = { label: string; href?: string }

const sections: Record<string, string> = {
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
}

function crumbsForPath(pathname: string): Crumb[] {
  const section = pathname.split("/").filter(Boolean)[0]
  if (section && sections[section]) {
    return [
      { label: "Portal", href: "/" },
      { label: sections[section] },
    ]
  }
  if (pathname.startsWith("/login")) {
    return [
      { label: "Portal", href: "/" },
      { label: "Login" },
    ]
  }
  if (pathname === "/") return [{ label: "Portal" }]
  return [
    { label: "Portal", href: "/" },
    { label: "Page not found" },
  ]
}

export function AppCrumbs() {
  const pathname = usePathname()
  const items = crumbsForPath(pathname)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((crumb, index) => {
          const last = index === items.length - 1
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
  )
}
