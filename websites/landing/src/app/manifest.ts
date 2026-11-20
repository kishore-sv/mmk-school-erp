import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: siteConfig.locale,
    dir: "ltr",
    categories: ["education", "business"],
    icons: [
      {
        src: siteConfig.logo.appIcon,
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: siteConfig.logo.appIcon,
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  }
}