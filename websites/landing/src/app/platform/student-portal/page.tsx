import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: 'Student portal',
  description: 'Students see their own profile, timetable, attendance, classwork, exams, and published report cards.',
  path: '/platform/student-portal',
})

export default function Page() {
  return (
    <>
      <PageHero title='Student portal' description='Students see their own profile, timetable, attendance, classwork, exams, and published report cards.' />
      <PageContainer className="py-12">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="border border-border px-3 py-2 text-sm" key="Student dashboard and profile">Student dashboard and profile</li>
          <li className="border border-border px-3 py-2 text-sm" key="Timetable and attendance">Timetable and attendance</li>
          <li className="border border-border px-3 py-2 text-sm" key="Digital diary, homework, assignments, and materials">Digital diary, homework, assignments, and materials</li>
          <li className="border border-border px-3 py-2 text-sm" key="Examinations, results, and report cards">Examinations, results, and report cards</li>
          <li className="border border-border px-3 py-2 text-sm" key="Calendar and notifications">Calendar and notifications</li>
        </ul>
      </PageContainer>
      <CtaBand title="Compare this experience in a demo" description="We will sign in as the role you care about and stay inside one school." />
    </>
  )
}
