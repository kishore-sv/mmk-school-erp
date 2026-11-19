import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ModuleView } from "@/components/catalog/module-view"
import { CatalogDetailSkeleton } from "@/components/marketing/catalog-detail-skeleton"
import { getModule, modules } from "@/data/modules"
import { createMetadata } from "@/lib/seo/create-metadata"

export function generateStaticParams() {
  return modules.map((module) => ({ slug: module.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const schoolModule = getModule(slug)
  if (!schoolModule) return {}
  return createMetadata({ title: schoolModule.title, description: schoolModule.definition, path: `/modules/${slug}` })
}

async function ModuleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const schoolModule = getModule(slug)
  if (!schoolModule) notFound()
  return <ModuleView module={schoolModule} />
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <ModuleDetail params={params} />
    </Suspense>
  )
}