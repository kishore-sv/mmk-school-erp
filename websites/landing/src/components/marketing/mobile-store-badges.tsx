import Link from "next/link"
import { IconBrandApple, IconBrandGooglePlay } from "@tabler/icons-react"
import { siteConfig } from "@/config/site"
import { cn } from "cn"

function StoreBadge({
  href,
  icon: Icon,
  label,
  title,
  className,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; stroke?: number; "aria-hidden"?: boolean }>
  label: string
  title: string
  className?: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 min-w-[11rem] active:scale-99 hover:ring-1 hover:ring-offset-1 transition-all ease-in-out items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-foreground ring-1 ring-foreground/10 hover:bg-muted/60",
        className
      )}
    >
      <Icon aria-hidden className="size-8 shrink-0" stroke={1.5} />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{title}</span>
      </span>
    </Link>
  )
}

export function MobileStoreBadges({ className }: { className?: string }) {
  return (
    <section
      aria-label="Download the mobile app"
      className={cn("mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}
    >
      <StoreBadge
        href={siteConfig.playstore}
        icon={IconBrandGooglePlay}
        label="Get it on"
        title="Google Play"
      />
      <StoreBadge href={siteConfig.appstore} icon={IconBrandApple} label="Download on the" title="App Store" />
    </section>
  )
}