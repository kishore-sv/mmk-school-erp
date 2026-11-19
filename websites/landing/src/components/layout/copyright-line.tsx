"use client"

import { useEffect, useState } from "react"
import { copyrightLine, siteConfig } from "@/config/site"

export function CopyrightLine() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setYear(new Date().getFullYear()))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
      {year ? copyrightLine(year) : `© ${siteConfig.name}. All rights reserved.`}
    </p>
  )
}
