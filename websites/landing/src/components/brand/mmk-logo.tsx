import { siteConfig } from "@/config/site"
import { cn } from "cn"

export function MmkMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0 text-foreground", className)}
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 22V10h3.2l4.8 7.4L20.8 10H24v12h-2.6v-7.2L17.2 22h-2.4l-4.2-7.2V22H8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MmkLogo({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <MmkMark />
      {compact ? null : (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">{siteConfig.shortName}</span>
          <span className="mt-1 text-[11px] text-muted-foreground">{siteConfig.brandSubtitle}</span>
        </span>
      )}
    </span>
  )
}
