import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CtaBand, PageContainer } from "@/components/marketing/page-shell"
import { CatalogDetailSkeleton } from "@/components/marketing/catalog-detail-skeleton"
import { SiteBreadcrumbs } from "@/components/marketing/site-breadcrumbs"
import { getIntegration, integrations } from "@/data/integrations"
import { createMetadata } from "@/lib/seo/create-metadata"

export function generateStaticParams() {
  return integrations.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getIntegration(slug)
  if (!item) return {}
  return createMetadata({ title: item.title, description: item.definition, path: `/integrations/${slug}` })
}

async function IntegrationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getIntegration(slug)
  if (!item) notFound()
  return (
    <>
      <PageContainer className="py-10">
        <SiteBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Integrations", href: "/integrations" }, { label: item.title }]}
        />
        <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7">{item.definition}</p>
        <ul className="mt-8 flex max-w-3xl flex-col gap-3 text-sm leading-6">
          {item.detail.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <h2 className="mt-10 text-xl font-semibold">Limits of this claim</h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
          {item.caveats.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </PageContainer>
      <CtaBand
        title="Ask which channels you need"
        description="A demo can cover the notification composer and, if relevant, how a school fee gateway would sit beside fee records."
      />
    </>
  )
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <IntegrationDetail params={params} />
    </Suspense>
  )
}