import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <header className="border-b border-border">
      <PageContainer className="py-14 md:py-20">
        {eyebrow ? <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </PageContainer>
    </header>
  )
}

export function CtaBand({
  title,
  description,
  primaryHref = "/book-demo",
  primaryLabel = "Book a Demo",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
}: {
  title: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <section className="border-t border-border bg-muted/40">
      <PageContainer className="flex flex-col gap-6 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className={buttonVariants()} href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className={buttonVariants({ variant: "outline" })} href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </div>
      </PageContainer>
    </section>
  )
}
