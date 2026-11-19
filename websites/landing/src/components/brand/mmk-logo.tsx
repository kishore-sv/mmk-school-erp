import Image from "next/image"
import { siteConfig } from "@/config/site"
import { cn } from "cn"

const wordmarkSrc = "/logo/mmk-wordmark.svg"

export function MmkWordmark({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={wordmarkSrc}
      alt=""
      width={383}
      height={129}
      priority={priority}
      className={cn("h-[1.75rem] w-auto sm:h-8", className)}
      aria-hidden
    />
  )
}

/** @deprecated Use MmkWordmark or MmkLogo */
export function MmkMark({ className }: { className?: string }) {
  return <MmkWordmark className={className} />
}

export function MmkLogo({
  className,
  compact = false,
  priority = false,
}: {
  className?: string
  compact?: boolean
  priority?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <MmkWordmark priority={priority} />
      {compact ? null : (
        <span className="border-l border-border pl-2 text-[10px] font-semibold tracking-wide text-muted-foreground sm:pl-2.5 sm:text-xs">
          {siteConfig.brandSubtitle}
        </span>
      )}
    </span>
  )
}

export function MmkLogoStacked({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <MmkWordmark priority={priority} />
      <span className="text-xs font-semibold tracking-wide text-muted-foreground">{siteConfig.brandSubtitle}</span>
    </span>
  )
}