import type { Metadata } from "next"
import { seoDefaults } from "@/config/seo"
import { siteConfig } from "@/config/site"

export function createMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = new URL(path, siteConfig.url).toString()
  return {
    title,
    description,
    keywords: [...seoDefaults.keywords],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
