"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import type { ModuleRecord } from "@/data/modules"

export function ModuleDirectory({ modules }: { modules: ModuleRecord[] }) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return modules
    return modules.filter((module) =>
      `${module.title} ${module.definition} ${module.capabilities.join(" ")}`.toLowerCase().includes(needle)
    )
  }, [modules, query])
  return (
    <div>
      <label className="flex max-w-md flex-col gap-2 text-sm" htmlFor="module-search">
        Search modules
        <Input id="module-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Attendance, fees, timetable…" />
      </label>
      <p className="mt-3 text-sm text-muted-foreground">{filtered.length} modules</p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((module, index) => (
          <li className="border border-border p-5 hover:scale-101 hover:shadow-md hover:rounded-md hover:ring ring-foreground/50 cursor-pointer transition-all duration-300 ease-in-out" key={module.slug}>
            <Link href={`/modules/${module.slug}`}>
            <p className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-lg font-semibold">
                {module.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.definition}</p>
              </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
