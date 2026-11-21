"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useLayoutEffect, useRef, useState } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { crumbsForPath, type Crumb } from "@/lib/page-titles"

import { createContext, useContext } from "react"

const CrumbsContext = createContext<Crumb[] | null>(null)
const SetCrumbsContext = createContext<(crumbs: Crumb[] | null) => void>(() => {})

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [crumbs, setCrumbs] = useState<Crumb[] | null>(null)
  return (
    <SetCrumbsContext.Provider value={setCrumbs}>
      <CrumbsContext.Provider value={crumbs}>{children}</CrumbsContext.Provider>
    </SetCrumbsContext.Provider>
  )
}

export function RegisterCrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const setCrumbs = useContext(SetCrumbsContext)
  const key = crumbs.map((crumb) => `${crumb.label}|${crumb.href ?? ""}`).join(">")
  const crumbsRef = useRef(crumbs)
  crumbsRef.current = crumbs
  useLayoutEffect(() => {
    setCrumbs(crumbsRef.current)
    return () => setCrumbs(null)
  }, [setCrumbs, key])
  return null
}

export function CrumbTrail({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {last || !crumb.href ? (
                  last ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <span>{crumb.label}</span>
                  )
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

export function HeaderCrumbs() {
  const pathname = usePathname()
  const registered = useContext(CrumbsContext)
  const crumbs = registered ?? crumbsForPath(pathname)
  return <CrumbTrail crumbs={crumbs} />
}
