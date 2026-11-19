import { HomePage } from "@/components/home/home-page"
import { homeFaqs } from "@/data/faqs"
import { createMetadata } from "@/lib/seo/create-metadata"
import { JsonLd, faqJsonLd } from "@/lib/seo/schema"
import { seoDefaults } from "@/config/seo"

export const metadata = createMetadata({
  title: "Home",
  description: seoDefaults.description,
  path: "/",
})

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <HomePage />
    </>
  )
}
