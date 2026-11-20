import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { Button } from "@/components/ui/button"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Admissions website",
  description: "A school-specific public admissions page in MMK School ERP for enquiries, applications, documents, and status tracking.",
  path: "/admissions-website",
})

const items = [
  ["School-specific page", "Each school presents its own admission information, not a generic MMK form with another school's name."],
  ["Enquiry and application", "Families can send an enquiry and complete an application the admissions team can track."],
  ["Documents", "Applications can include the documents the school asks for."],
  ["Status", "Applicants see the status the school publishes. Staff record review, interviews, waitlist, and the decision."],
  ["Handover", "Approval can create the student profile and enrollment. The public page is not a separate website-building service."],
]

export default function Page() {
  return (
    <>
      <PageHero title="A public admissions page for your school" description="Families apply to your school. Your team reviews the same application inside Admission Management." />
      <PageContainer className="grid gap-4 py-12 md:grid-cols-2">
        {items.map(([title, copy]) => (
          <section className="border border-border p-5 hover:scale-101 hover:shadow-md hover:rounded-md hover:ring ring-foreground/50 transition-all duration-300 ease-in-out" key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </section>
        ))}
      </PageContainer>
      <CtaBand title="See the applicant and the office view" description="A demo can follow one application from the public form to the student record." primaryHref="/book-demo" />
    </>
  )
}
