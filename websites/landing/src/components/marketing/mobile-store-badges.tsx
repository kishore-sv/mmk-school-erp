import Image from "next/image"
import Link from "next/link"
import { IconBrandApple, IconBrandGooglePlay } from "@tabler/icons-react"
import { siteConfig } from "@/config/site"
import { cn } from "cn"

const storeBadgeImages = {
  googlePlay: {
    src: "/badges/google-play.webp",
    alt: "Get it on Google Play",
    width: 564,
    height: 168,
  },
  appStore: {
    src: "/badges/app-store.svg",
    alt: "Download on the App Store",
    width: 120,
    height: 40,
  },
} as const

function StoreBadgeImage({
  href,
  src,
  alt,
  width,
  height,
  className,
}: {
  href: string
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-block transition-opacity hover:opacity-90 active:scale-[0.99]", className)}
    >
      {src.endsWith(".svg") ? (
        // eslint-disable-next-line @next/next/no-img-element -- official App Store SVG badge
        <img src={src} alt={alt} width={width} height={height} className="h-10 w-auto" />
      ) : (
        <Image src={src} alt={alt} width={width} height={height} className="h-10 w-auto" />
      )}
    </Link>
  )
}

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
        "inline-flex min-h-11 min-w-[11rem] active:scale-99 items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-foreground ring-1 ring-foreground/10 transition-all ease-in-out hover:bg-muted/60 hover:ring-1 hover:ring-offset-1",
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

export function MobileStoreBadges({
  className,
  variant = "default",
}: {
  className?: string
  variant?: "default" | "dark"
}) {
  if (variant === "dark") {
    return (
      <section
        aria-label="Download the mobile app"
        className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}
      >
        <StoreBadgeImage href={siteConfig.playstore} {...storeBadgeImages.googlePlay} />
        <StoreBadgeImage href={siteConfig.appstore} {...storeBadgeImages.appStore} />
      </section>
    )
  }

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