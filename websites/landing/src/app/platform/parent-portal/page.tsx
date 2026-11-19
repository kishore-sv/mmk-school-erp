import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: 'Parent portal',
  description: 'A parent uses one account and switches between children the school has linked.',
  path: '/platform/parent-portal',
})

export default function Page() {
  return (
    <>
      <PageHero title='Parent portal' description='A parent uses one account and switches between children the school has linked.' />
      <PageContainer className="py-12">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="border border-border px-3 py-2 text-sm" key="Parent dashboard">Parent dashboard</li>
          <li className="border border-border px-3 py-2 text-sm" key="Multiple-child switching">Multiple-child switching</li>
          <li className="border border-border px-3 py-2 text-sm" key="Child profile, attendance, and timetable">Child profile, attendance, and timetable</li>
          <li className="border border-border px-3 py-2 text-sm" key="Diary, homework, and academic performance">Diary, homework, and academic performance</li>
          <li className="border border-border px-3 py-2 text-sm" key="Fee information and leave applications">Fee information and leave applications</li>
          <li className="border border-border px-3 py-2 text-sm" key="Communication, calendar, and notifications">Communication, calendar, and notifications</li>
        </ul>
      </PageContainer>
      <CtaBand title="Compare this experience in a demo" description="We will sign in as the role you care about and stay inside one school." />
    </>
  )
}
