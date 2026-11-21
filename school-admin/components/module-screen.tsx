import { AppCrumbs } from "@/components/app-crumbs"

export function ModuleScreen({
  title,
  description,
  crumbs,
  children,
}: {
  title: string
  description: string
  crumbs: Array<{ label: string; href?: string }>
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <AppCrumbs crumbs={crumbs} />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children ?? (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          This section is part of the School Admin shell. The working records for it will be added in a later milestone.
        </div>
      )}
    </div>
  )
}
