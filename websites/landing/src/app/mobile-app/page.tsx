import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Mobile app",
  description: "One MMK School ERP mobile app for teachers, students, and parents, with navigation that changes by role.",
  path: "/mobile-app",
})

export default function Page() {
  return (
    <>
      <PageHero title="One app, three roles" description="Teachers, students, and parents use the same mobile application. After sign-in, the home screen matches that role. This page does not claim an App Store or Play Store listing." />
      <PageContainer className="grid gap-4 py-12 md:grid-cols-3">
        {[
          ["Teacher", "Timetable, classes, attendance, diary, homework, and marks entry for assigned work."],
          ["Student", "Profile, timetable, attendance, classwork, exams, and published results."],
          ["Parent", "Switch between linked children, then open attendance, diary, fees, and notices for that child."],
        ].map(([title, copy]) => (
          <section className="border border-border p-5" key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </section>
        ))}
      </PageContainer>
      <PageContainer className="pb-12 text-sm leading-7 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Shared behaviour</h2>
        <p className="mt-3 max-w-3xl">The app uses role-aware navigation, personal dashboards, timetable, attendance, homework, learning materials, examination information, and communication that the school has enabled. Parents can switch child. Push notifications and deep links apply when the app build and the school&apos;s notification setup support them.</p>
      </PageContainer>
      <CtaBand title="Ask for a mobile walkthrough" description="We will show the role you care about. We will not show a store badge that does not exist." />
    </>
  )
}
