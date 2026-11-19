export const siteConfig = {
  name: "MMK School ERP",
  shortName: "MMK",
  brandSubtitle: "School ERP",
  websiteName: "MMK School ERP",
  url: "https://mmkerp.tech",
  domain: "mmkerp.tech",
  email: "mmkerp@gmail.com",
  phones: ["+91 78993 04607", "+91 861 881 3147"] as const,
  blogUrl: "https://blogs.mmkerp.tech",
  youtubeUrl: "https://www.youtube.com/channel/UCglZwT9PYeAPTKg6rUhQiFA",
  locale: "en-IN",
  country: "India",
  language: "English",
  description:
    "MMK School ERP is school management software for Indian schools. It connects administration, academics, teachers, students, and parents in one platform.",
  logo: {
    symbol: "/logo/mmk-wordmark.svg",
    wordmark: "/logo/mmk-wordmark.svg",
    wordmarkPng: "/logo/mmk-wordmark.png",
  },
  social: {
    youtube: "https://www.youtube.com/channel/UCglZwT9PYeAPTKg6rUhQiFA",
    blog: "https://blogs.mmkerp.tech",
  },
} as const

export function copyrightLine(year: number) {
  return `© ${year} ${siteConfig.name}. All rights reserved.`
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`
}
