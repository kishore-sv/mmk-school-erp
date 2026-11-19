"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { siteConfig } from "@/config/site"
import { cn } from "cn"

function storeHrefFromUserAgent() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return siteConfig.appstore
  if (/Android/i.test(ua)) return siteConfig.playstore
  return siteConfig.playstore
}

function subscribe() {
  return () => {}
}

export function AppStoreLink({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const href = useSyncExternalStore(subscribe, storeHrefFromUserAgent, () => siteConfig.playstore)

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
    >
      {children}
    </Link>
  )
}