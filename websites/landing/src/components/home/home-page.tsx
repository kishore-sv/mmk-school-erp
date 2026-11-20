import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { PageContainer } from "@/components/marketing/page-shell"
import { ConnectedSchoolEcosystemCard } from "@/components/home/connected-school-ecosystem-card"
import { ProductOverviewCards } from "@/components/home/product-overview-cards"
import { RolePortalCards } from "@/components/home/role-portal-cards"
import { ProductPreview } from "@/components/marketing/product-preview"
import { FaqList } from "@/components/marketing/faq-list"
import { modules } from "@/data/modules"
import { homeFaqs } from "@/data/faqs"
import { siteConfig } from "@/config/site"

export function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <PageContainer className="grid items-start gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
            <p className="text-sm font-medium text-muted-foreground">School ERP software for India</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              One connected system for your entire school.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              {siteConfig.name} brings school administration, academic operations, teachers, students, and parents together through one platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={buttonVariants()} href="/book-demo">Book a Demo</Link>
              <Link className={buttonVariants({ variant: "outline" })} href="/platform">Explore the Platform</Link>
            </div>
          </div>
          <ProductPreview />
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="grid gap-8 py-16 md:grid-cols-[16rem_minmax(0,1fr)] md:py-24">
          <h2 className="text-2xl font-semibold tracking-tight">A clear operating picture</h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Leadership, the office, and the classroom should not keep separate versions of the same student. MMK School ERP is the shared record for the academic year: who is enrolled, which class they attend, what they were assigned, and what the family is allowed to see.
          </p>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <h2 className="text-2xl font-semibold tracking-tight">Product overview</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            The product is a set of school modules plus role-based portals. Platform administration, used by MMK to onboard a school, is separate from the school admin portal.
          </p>
          <ProductOverviewCards />
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="grid gap-6 py-16 md:grid-cols-2 md:py-24">
          <ConnectedSchoolEcosystemCard />
          <ol className="flex flex-col justify-center gap-4 text-sm">
            {["Application approved", "Student enrolled", "Class and guardians linked", "Daily academic work", "Reports for the people allowed to see them"].map((step, index) => (
              <li className="flex gap-3" key={step}>
                <span className="font-mono text-muted-foreground">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Seventeen modules</h2>
            <Link className="text-sm underline-offset-4 hover:underline" href="/modules">Module directory</Link>
          </div>
          <ul className="mt-8 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
            {modules.map((module) => (
              <li className="mb-3 break-inside-avoid hover:scale-101 transition-all duration-300 ease-in-out" key={module.slug}>
                <Link className="text-sm hover:text-shadow-[1px_1px_0_rgba(0,0,0,0.1)] font-medium underline-offset-4 hover:underline trasnition-all duration-300 ease-in-out" href={`/modules/${module.slug}`}>
                  {module.title}
                </Link>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <h2 className="text-2xl font-semibold">Role-specific portals</h2>
          <RolePortalCards />
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <h2 className="text-2xl font-semibold">How the platform works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["01", "School account", "MMK onboards the school. The school cannot see other schools."],
              ["02", "Structure", "Profile, year, classes, and users are set by administrators."],
              ["03", "Daily use", "Teachers, students, and parents sign in to their own experience."],
              ["04", "Review", "Reports and audit logs stay inside the school's permissions."],
            ].map(([n, title, copy]) => (
              <li className="border-t border-border pt-4" key={n}>
                <p className="font-mono text-xs text-muted-foreground">{n}</p>
                <h3 className="mt-2 font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="grid gap-8 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-24">
          <h2 className="text-2xl font-semibold">Key capabilities</h2>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {["Admissions to enrollment", "Attendance with corrections", "Timetables with clash checks", "Exams and report cards", "School fee records", "Role-based access"].map((item) => (
              <li className="border border-border px-3 py-3 hover:scale-103 hover:shadow-md hover:rounded-md hover:ring ring-foreground/50 transition-all duration-300 ease-in-out" key={item}>{item}</li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h2 className="text-2xl font-semibold">Academic management</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Years, classes, sections, subjects, and teacher allocation sit under the timetable, attendance, and examinations that use them.
            </p>
            <Link className="mt-4 inline-block text-sm underline-offset-4 hover:underline" href="/modules/academic-management">Academic management</Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Administrative management</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The office runs student records, staff, admissions, fees, transport, and user permissions without a second login per task.
            </p>
            <Link className="mt-4 inline-block text-sm underline-offset-4 hover:underline" href="/platform/school-admin-portal">School admin portal</Link>
          </div>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <h2 className="max-w-xl text-2xl font-semibold">Parent and student engagement</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Guardians see the children linked to them. Students see their own classwork and published results. Notices can be limited to a class or role. Email, SMS, and WhatsApp are configurable channels, not assumed connections.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link className="underline-offset-4 hover:underline" href="/platform/parent-portal">Parent portal</Link>
            <Link className="underline-offset-4 hover:underline" href="/platform/student-portal">Student portal</Link>
          </div>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="flex flex-col gap-4 py-16 md:flex-row md:items-center md:justify-between md:py-24">
          <div>
            <h2 className="text-2xl font-semibold">One mobile app</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Teachers, students, and parents use the same app. The navigation changes with the role. This site does not claim a store listing.
            </p>
          </div>
          <Link className={`${buttonVariants({ variant: "outline" })} hover:shadow-lg hover:scale-101 transition-all duration-300 ease-in-out`} href="/mobile-app">Mobile app</Link>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <h2 className="text-2xl font-semibold">Security and access</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Each school is a separate account. Permissions follow roles. School administrators use multi-factor authentication. Audit logs are available to authorised admins. These are product commitments, not a certification claim.
          </p>
          <Link className="mt-4 inline-block text-sm underline-offset-4 hover:underline" href="/security">Security</Link>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="py-16 md:py-24">
          <h2 className="text-2xl font-semibold">Implementation</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {["Share school details and the student strength used for the quotation.", "MMK opens the school account and confirms the modules in scope.", "Your team completes setup, imports the year, and invites users."].map((step, index) => (
              <li className="bg-muted/40 p-4 text-sm leading-6" key={step}>
                <span className="font-medium">Step {index + 1}. </span>
                {step}
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="border-b border-border">
        <PageContainer className="grid gap-6 py-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:py-24">
          <div>
            <h2 className="text-2xl font-semibold">Per-student pricing</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Simple per-student pricing. Your school&apos;s subscription is calculated based on its student strength and confirmed requirements. No amount is published on this website.
            </p>
          </div>
          <Link className={buttonVariants()} href="/pricing">Request a Custom Quote</Link>
        </PageContainer>
      </section>

      <section>
        <PageContainer className="py-16 md:py-24">
          <h2 className="text-2xl font-semibold">Questions</h2>
          <div className="mt-6">
            <FaqList items={homeFaqs} />
          </div>
          <Link className="mt-6 inline-block text-sm underline-offset-4 hover:underline" href="/faq">All questions</Link>
        </PageContainer>
      </section>

      <section className="border-t border-border bg-muted/50">
        <PageContainer className="flex flex-col gap-4 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold">Book a demo with your own questions.</h2>
          <Link className={buttonVariants()} href="/book-demo">Book a Demo</Link>
        </PageContainer>
      </section>
    </>
  )
}
