import { Suspense } from "react"
import { notFound } from "next/navigation"
import { FeatureView } from "@/components/catalog/feature-view"
import { CatalogDetailSkeleton } from "@/components/marketing/catalog-detail-skeleton"
import { features, getFeature } from "@/data/features"
import { createMetadata } from "@/lib/seo/create-metadata"

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const feature = getFeature(slug)
  if (!feature) return {}
  return createMetadata({ title: feature.title, description: feature.definition, path: `/features/${slug}` })
}

async function FeatureDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const feature = getFeature(slug)
  if (!feature) notFound()
  return <FeatureView feature={feature} />
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <FeatureDetail params={params} />
    </Suspense>
  )
}