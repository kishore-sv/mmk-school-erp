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

function crumbsForPath(pathname: string): Crumb[] {
  if (pathname.startsWith("/dashboard")) return [{ label: "Dashboard" }]
  if (pathname.startsWith("/login")) {
    return [
      { label: "School Admin", href: "/" },
      { label: "Login" },
    ]
  }
  if (pathname === "/") return [{ label: "School Admin" }]
  return [
    { label: "School Admin", href: "/" },
    { label: "Page not found" },
  ]
}

export function AppCrumbs({ crumbs }: { crumbs?: Crumb[] }) {
  const pathname = usePathname()
  const items = crumbs ?? crumbsForPath(pathname)
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
