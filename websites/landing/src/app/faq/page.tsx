import { FaqList } from "@/components/marketing/faq-list"
import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { faqs } from "@/data/faqs"
import { createMetadata } from "@/lib/seo/create-metadata"
import { JsonLd, faqJsonLd } from "@/lib/seo/schema"

export const metadata = createMetadata({
  title: "FAQ",
  description: "Answers about MMK School ERP modules, onboarding, portals, fees, security, and per-student pricing.",
  path: "/faq",
})

export default function Page() {
  const categories = [...new Set(faqs.map((item) => item.category))]
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero title="Frequently asked questions" description="Answers stay inside the product that is actually described on this website." />
      <PageContainer className="flex flex-col gap-10 py-12">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="mt-3">
              <FaqList items={faqs.filter((item) => item.category === category)} />
            </div>
          </section>
        ))}
      </PageContainer>
    </>
  )
}
