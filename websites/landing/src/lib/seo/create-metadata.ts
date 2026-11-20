import type { Metadata } from "next"
import { seoDefaults } from "@/config/seo"
import { siteConfig } from "@/config/site"

const defaultOgImage = {
  url: seoDefaults.ogImagePath,
  width: 1200,
  height: 630,
  alt: siteConfig.name,
}

export function createMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  noIndex?: boolean
}): Metadata {
  const url = new URL(path, siteConfig.url).toString()
  const robots = noIndex ? { index: false, follow: false } : { index: true, follow: true }
  const pageTitle = path === "/" ? { absolute: seoDefaults.title } : title

  return {
    title: pageTitle,
    description,
    keywords: [...seoDefaults.keywords],
    alternates: { canonical: url },
    robots: {
      ...robots,
      googleBot: {
        ...robots,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  }
}

export function rootLayoutMetadata(): Metadata {
  const ogImage = defaultOgImage
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: seoDefaults.title, template: `%s | ${siteConfig.name}` },
    description: seoDefaults.description,
    applicationName: siteConfig.name,
    keywords: [...seoDefaults.keywords],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: siteConfig.url,
      languages: { "en-IN": siteConfig.url },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: seoDefaults.title,
      description: seoDefaults.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: seoDefaults.title,
      description: seoDefaults.description,
      images: [ogImage],
    },
    icons: {
      icon: [{ url: siteConfig.logo.appIcon, type: "image/png" }],
      apple: [{ url: siteConfig.logo.appIcon, type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
  }
}