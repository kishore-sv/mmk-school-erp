import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { siteConfig } from "@/config/site"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Privacy",
  description: "Draft privacy notice for the MMK School ERP marketing website. Legal entity, retention, and subprocessors are marked for review.",
  path: "/privacy",
})

export default function Page() {
  return (
    <>
      <PageHero title="Privacy notice (draft)" description="This is a working draft for the public website. It has not been through legal review. Items in brackets need a decision before publication as a final policy." />
      <PageContainer className="flex max-w-3xl flex-col gap-6 py-12 text-sm leading-7">
        <p>The site operator is {siteConfig.name}. Contact {siteConfig.email}. [LEGAL REVIEW: legal entity name, registered address if any, and the role of MMK versus each school as data controller.]</p>
        <h2 className="text-xl font-semibold">What this website collects</h2>
        <p>If you submit a form, we ask for your name, school, email, phone, city, state, an approximate student-count range, and the message you type. [LEGAL REVIEW: where that data is stored, who can read it, and how long it is kept.] Until a form backend is connected, the page tells you the message was not sent automatically.</p>
        <h2 className="text-xl font-semibold">School product data</h2>
        <p>Student, parent, and staff records live in the school product, not on this marketing site. Each school decides who may access those records. [LEGAL REVIEW: subprocessors, hosting, and retention periods for the product.]</p>
        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>The site may store a theme preference in your browser. [LEGAL REVIEW: any analytics cookies before they are added.]</p>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>Privacy questions can be sent to {siteConfig.email}. [LEGAL REVIEW: dedicated privacy contact if different.]</p>
      </PageContainer>
    </>
  )
}
