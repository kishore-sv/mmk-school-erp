import { HomePage } from "@/components/home/home-page"
import { JsonLd, faqJsonLd } from "@/lib/seo/schema"
import { homeFaqs } from "@/data/faqs"

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <HomePage />
    </>
  )
}
