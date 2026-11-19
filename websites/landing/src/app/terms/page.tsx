import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { siteConfig } from "@/config/site"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Terms",
  description: "Draft terms for using the MMK School ERP website and for requesting a school subscription quotation.",
  path: "/terms",
})

export default function Page() {
  return (
    <>
      <PageHero title="Terms of use (draft)" description="These terms are a structure for review. They are not a signed commercial agreement and they have not been legally approved." />
      <PageContainer className="flex max-w-3xl flex-col gap-6 py-12 text-sm leading-7">
        <p>[LEGAL REVIEW: contracting entity.] The public site at {siteConfig.domain} describes {siteConfig.name}. Using the site does not by itself create a subscription.</p>
        <h2 className="text-xl font-semibold">Quotations</h2>
        <p>Any subscription is agreed in a separate quotation. The website does not publish an amount. [COMMERCIAL REVIEW: payment terms, student-count changes, and notice periods.]</p>
        <h2 className="text-xl font-semibold">School data</h2>
        <p>Schools are responsible for the student and staff information they enter and for the permissions they grant. [LEGAL REVIEW: data processing terms.]</p>
        <h2 className="text-xl font-semibold">Acceptable use</h2>
        <p>Do not attempt to access another school&apos;s account or to disrupt the service. [LEGAL REVIEW: liability limits and governing law.]</p>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>Questions about these draft terms: {siteConfig.email}.</p>
      </PageContainer>
    </>
  )
}
