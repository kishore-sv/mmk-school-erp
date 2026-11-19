import { EnquiryForm } from "@/components/forms/enquiry-form"
import { FaqList } from "@/components/marketing/faq-list"
import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { faqs } from "@/data/faqs"
import { createMetadata } from "@/lib/seo/create-metadata"
import { JsonLd, faqJsonLd } from "@/lib/seo/schema"

export const metadata = createMetadata({
  title: "Pricing",
  description: "Simple per-student pricing for MMK School ERP. The quotation depends on student strength and school requirements.",
  path: "/pricing",
})

const pricingFaqs = faqs.filter((item) => item.category === "Pricing" || item.category === "Fees")

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(pricingFaqs)} />
      <PageHero
        eyebrow="Pricing"
        title="Simple per-student pricing."
        description="Your school's subscription is calculated based on its student strength. The final quotation also depends on the requirements you confirm. This page does not show an amount, a range, or a package."
      />
      <PageContainer className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-10 text-sm leading-7">
          <section>
            <h2 className="text-xl font-semibold">Pricing philosophy</h2>
            <p className="mt-3 text-muted-foreground">Schools differ in size. MMK calculates the subscription from student strength instead of asking you to pick a named plan.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">What the school gets</h2>
            <p className="mt-3 text-muted-foreground">The quotation covers the platform described on this site: administration, academic modules, role portals, the admissions website, and the mobile app. School fee collection is separate from the subscription the school pays MMK.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">How a quotation works</h2>
            <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">
              <li>You share the school, location, approximate student count, and requirements.</li>
              <li>We confirm the student strength the subscription should use.</li>
              <li>You receive a written quotation. This website does not calculate or display that figure.</li>
            </ol>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Questions</h2>
            <FaqList items={pricingFaqs} />
          </section>
        </div>
        <div className="border border-border p-5">
          <h2 className="text-lg font-semibold">Request a Custom Quote</h2>
          <div className="mt-4">
            <EnquiryForm kind="quote" />
          </div>
        </div>
      </PageContainer>
    </>
  )
}
