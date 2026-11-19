import { DemoEnquiryForm } from "@/components/forms/demo-enquiry-form"
import { DemoPanel } from "@/components/marketing/demo-panel"
import { PageContainer } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Book a demo",
  description:
    "Request a demonstration of MMK School ERP. Share your school details, student count, and the modules you want to see.",
  path: "/book-demo",
})

export default function Page() {
  return (
    <PageContainer className="py-10 md:py-14">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,13fr)] lg:gap-12">
        <DemoPanel />
        <DemoEnquiryForm />
      </div>
    </PageContainer>
  )
}