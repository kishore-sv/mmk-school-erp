import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

const lifecycleClassNames = {
  active: "border-green-500 bg-green-500/10 text-green-700",
  suspended: "border-yellow-500 bg-yellow-500/10 text-yellow-800",
  archived: "border-red-500 bg-red-500/10 text-red-700",
} as const

type LifecycleStatus = keyof typeof lifecycleClassNames

export function normalizeLifecycleStatus(value: string): LifecycleStatus | null {
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_")
  if (normalized === "active") return "active"
  if (normalized === "suspended" || normalized === "suspend") return "suspended"
  if (normalized === "archived" || normalized === "archive") return "archived"
  return null
}

function formatStatusLabel(value: string) {
  return value.replaceAll("_", " ")
}

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  const lifecycle = normalizeLifecycleStatus(value)
  if (lifecycle) {
    return (
      <Badge variant="outline" className={cn(lifecycleClassNames[lifecycle], className)}>
        {formatStatusLabel(value)}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className={className}>
      {formatStatusLabel(value)}
    </Badge>
  )
}