import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

function indexingAllowed() {
  if (process.env.ALLOW_INDEXING === "false") return false
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return false
  return true
}

export default function robots(): MetadataRoute.Robots {
  const sitemap = new URL("/sitemap.xml", siteConfig.url).toString()

  if (!indexingAllowed()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap,
      host: siteConfig.url,
    }
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap,
    host: siteConfig.url,
  }
}