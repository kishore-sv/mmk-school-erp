import { RegisterCrumbs } from "@/components/page-crumbs"
import type { Crumb } from "@/lib/page-titles"

export function PageHeader({
  title,
  description,
  crumbs = [],
}: {
  title: string
  description?: string
  crumbs?: Crumb[]
}) {
  return (
    <div className="flex flex-col gap-3">
      {crumbs.length > 0 ? <RegisterCrumbs crumbs={crumbs} /> : null}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
