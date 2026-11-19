import { ContactEnquiryForm } from "@/components/forms/contact-enquiry-form"
import { ContactPanel } from "@/components/marketing/contact-panel"
import { PageContainer } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Contact MMK School ERP about general, sales, pricing, or technical enquiries. Share your school details and our team will reach out.",
  path: "/contact",
})

export default function Page() {
  return (
    <PageContainer className="py-10 md:py-14">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,13fr)] lg:gap-12">
        <ContactPanel />
        <ContactEnquiryForm />
      </div>
    </PageContainer>
  )
}