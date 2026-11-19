import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: 'Teacher portal',
  description: 'Teachers open their timetable, classes, attendance, diary, homework, marks, and profile.',
  path: '/platform/teacher-portal',
})

export default function Page() {
  return (
    <>
      <PageHero title='Teacher portal' description='Teachers open their timetable, classes, attendance, diary, homework, marks, and profile.' />
      <PageContainer className="py-12">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="border border-border px-3 py-2 text-sm" key="Teacher dashboard">Teacher dashboard</li>
          <li className="border border-border px-3 py-2 text-sm" key="My timetable and my classes">My timetable and my classes</li>
          <li className="border border-border px-3 py-2 text-sm" key="Attendance">Attendance</li>
          <li className="border border-border px-3 py-2 text-sm" key="Digital diary, homework, and assignments">Digital diary, homework, and assignments</li>
          <li className="border border-border px-3 py-2 text-sm" key="Examination marks and student progress">Examination marks and student progress</li>
          <li className="border border-border px-3 py-2 text-sm" key="Leave requests, communication, and settings">Leave requests, communication, and settings</li>
        </ul>
      </PageContainer>
      <CtaBand title="Compare this experience in a demo" description="We will sign in as the role you care about and stay inside one school." />
    </>
  )
}
