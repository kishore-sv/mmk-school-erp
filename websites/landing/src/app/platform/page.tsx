import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: 'Platform',
  description: 'How school administration, teacher, student, and parent experiences sit on one school account, separate from MMK platform administration.',
  path: '/platform',
})

export default function Page() {
  return (
    <>
      <PageHero title='The MMK School ERP platform' description='How school administration, teacher, student, and parent experiences sit on one school account, separate from MMK platform administration.' />
      <PageContainer className="py-12">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="border border-border px-3 py-2 text-sm" key="School administration runs the modules for that school.">School administration runs the modules for that school.</li>
          <li className="border border-border px-3 py-2 text-sm" key="Teachers, students, and parents sign in to smaller experiences.">Teachers, students, and parents sign in to smaller experiences.</li>
          <li className="border border-border px-3 py-2 text-sm" key="The public admissions page feeds Admission Management.">The public admissions page feeds Admission Management.</li>
          <li className="border border-border px-3 py-2 text-sm" key="The mobile app is the same roles on a phone.">The mobile app is the same roles on a phone.</li>
          <li className="border border-border px-3 py-2 text-sm" key="Platform administration onboards schools and never appears as a menu inside a school.">Platform administration onboards schools and never appears as a menu inside a school.</li>
        </ul>
      </PageContainer>
      <CtaBand title="Compare this experience in a demo" description="We will sign in as the role you care about and stay inside one school." />
    </>
  )
}
