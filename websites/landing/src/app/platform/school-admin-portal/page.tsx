import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: 'School admin portal',
  description: 'School administrators run setup, people, academics, money, communication, reports, and permissions for their school only.',
  path: '/platform/school-admin-portal',
})

export default function Page() {
  return (
    <>
      <PageHero title='School admin portal' description='School administrators run setup, people, academics, money, communication, reports, and permissions for their school only.' />
      <PageContainer className="py-12">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="border border-border px-3 py-2 text-sm" key="Dashboard and school setup">Dashboard and school setup</li>
          <li className="border border-border px-3 py-2 text-sm" key="Academic, student, admission, staff, and parent records">Academic, student, admission, staff, and parent records</li>
          <li className="border border-border px-3 py-2 text-sm" key="Timetable, attendance, examinations, and learning">Timetable, attendance, examinations, and learning</li>
          <li className="border border-border px-3 py-2 text-sm" key="Fees, transport, calendar, and communication">Fees, transport, calendar, and communication</li>
          <li className="border border-border px-3 py-2 text-sm" key="Reports, settings, and permissions">Reports, settings, and permissions</li>
        </ul>
      </PageContainer>
      <CtaBand title="Compare this experience in a demo" description="We will sign in as the role you care about and stay inside one school." />
    </>
  )
}
