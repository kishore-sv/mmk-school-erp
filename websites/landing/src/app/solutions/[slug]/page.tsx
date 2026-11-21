import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CtaBand, PageContainer } from "@/components/marketing/page-shell"
import { CatalogDetailSkeleton } from "@/components/marketing/catalog-detail-skeleton"
import { getModule } from "@/data/modules"
import { getSolution, solutions } from "@/data/solutions"
import { createMetadata } from "@/lib/seo/create-metadata"

export function generateStaticParams() {
  return solutions.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getSolution(slug)
  if (!item) return {}
  return createMetadata({ title: item.title, description: item.definition, path: `/solutions/${slug}` })
}

async function SolutionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getSolution(slug)
  if (!item) notFound()
  return (
    <>
      <PageContainer className="py-10">
        <p className="text-sm text-muted-foreground">{item.audience}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{item.title}</h1>
        <p className="mt-4 max-w-3xl leading-7">{item.definition}</p>
        <h2 className="mt-10 text-xl font-semibold">Typical work</h2>
        <ol className="mt-4 flex max-w-3xl flex-col gap-3 text-sm">
          {item.workflows.map((step, index) => (
            <li key={step}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>
        <h2 className="mt-10 text-xl font-semibold">Modules involved</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {item.moduleSlugs.map((moduleSlug) => {
            const relatedModule = getModule(moduleSlug)
            return relatedModule ? (
              <li key={relatedModule.slug}>
                <Link className="text-sm underline-offset-4 hover:underline" href={`/modules/${relatedModule.slug}`}>
                  {relatedModule.title}
                </Link>
              </li>
            ) : null
          })}
        </ul>
      </PageContainer>
      <CtaBand
        title="See this role in the product"
        description="Book a demo and we will follow this workflow rather than a general tour only."
      />
    </>
  )
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <SolutionDetail params={params} />
    </Suspense>
  )
}