import Image from "next/image"
import { AppStoreLink } from "@/components/marketing/app-store-link"
import { MobileStoreBadges } from "@/components/marketing/mobile-store-badges"
import { CtaBand, PageContainer } from "@/components/marketing/page-shell"
import { Iphone } from "@/components/ui/iphone"
import { siteConfig } from "@/config/site"
import { createMetadata } from "@/lib/seo/create-metadata"

const roleCards = [
  {
    title: "Teacher",
    copy: "Timetable, classes, attendance, diary, homework, and marks entry for assigned work.",
    previewLabel: "Teacher",
  },
  {
    title: "Student",
    copy: "Profile, timetable, attendance, classwork, exams, and published results.",
    previewLabel: "Student",
  },
  {
    title: "Parent",
    copy: "Switch between linked children, then open attendance, diary, fees, and notices for that child.",
    previewLabel: "Parent",
  },
] as const

function rolePreviewSrc(label: string) {
  return `https://placehold.co/900x1600/e5e5e5/2563eb?text=${encodeURIComponent(label)}`
}

export const metadata = createMetadata({
  title: "Mobile app",
  description: "One MMK School ERP mobile app for teachers, students, and parents, with navigation that changes by role.",
  path: "/mobile-app",
})

export default function Page() {
  return (
    <>
      <header className="border-b border-border">
        <PageContainer className="grid items-center gap-10 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:gap-12 md:py-20">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mobile app</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              One app, three roles
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Teachers, students, and parents use the same mobile application. After sign-in, the home screen matches
              that role. Download the app from Google Play or the App Store.
            </p>
            <MobileStoreBadges />
          </div>
          <AppStoreLink className="justify-self-center md:justify-self-end">
            <figure>
              <Image
                src={siteConfig.logo.squareLogo}
                alt="MMK School mobile app"
                width={512}
                height={512}
                priority
                draggable={false}
                className="w-full max-w-[14rem] select-none cursor-pointer rounded-3xl shadow-xl hover:shadow-2xl ring-2 ring-foreground/10 ring-offset-1 transition-all duration-200 ease-linear hover:scale-[1.02] active:scale-[0.98]"
              />
            </figure>
          </AppStoreLink>
        </PageContainer>
      </header>
      <PageContainer className="grid gap-6 py-12 sm:gap-8 md:grid-cols-3">
        {roleCards.map(({ title, copy, previewLabel }) => (
          <section
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            key={title}
          >
            <div className="border-b border-border/80 p-5 sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
            <div className="flex flex-1 items-end justify-center bg-muted/30 px-4 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-10">
              <div className="w-full max-w-[11rem] sm:max-w-[12.25rem] ">
                <Iphone
                  src={rolePreviewSrc(previewLabel)}
                  className="mx-auto drop-shadow-md"
                  aria-label={`${title} app preview placeholder`}
                />
              </div>
            </div>
          </section>
        ))}
      </PageContainer>
      <PageContainer className="pb-12 text-sm leading-7 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Shared behaviour</h2>
        <p className="mt-3 max-w-3xl">
          The app uses role-aware navigation, personal dashboards, timetable, attendance, homework, learning materials,
          examination information, and communication that the school has enabled. Parents can switch child. Push
          notifications and deep links apply when the app build and the school&apos;s notification setup support them.
        </p>
      </PageContainer>
      <CtaBand
        title="Ask for a mobile walkthrough"
        description="Book a demo and we can walk through the app for the role you care about—teacher, student, or parent."
      />
    </>
  )
}