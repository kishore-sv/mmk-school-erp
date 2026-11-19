import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Security",
  description: "How MMK School ERP separates schools, limits access by role, requires admin multi-factor authentication, and keeps audit history.",
  path: "/security",
})

const points = [
  ["Role-based access", "A user receives the permissions of their role. A teacher does not inherit the fee cashier's actions."],
  ["School boundaries", "A school account does not open another school's students, fees, or staff. Platform administration is a separate operator experience."],
  ["School admin MFA", "Multi-factor authentication is mandatory for the school administrator role."],
  ["Audit trails", "Authorised administrators can review audit logs of significant changes instead of sharing one office password."],
  ["Historical records", "Promotion, withdrawal, and closed academic years keep the records that belonged to that year."],
  ["Authentication", "People sign in to their own account. Invitations replace shared logins."],
  ["Support access", "Support is a controlled operator activity. It is not a school user browsing every school."],
  ["Student information", "Student data is shown to roles and guardians the school has authorised. This page does not claim a completed privacy certification."],
]

export default function Page() {
  return (
    <>
      <PageHero title="Access is limited to the school and the role" description="These are design commitments of MMK School ERP. They are not a list of audited certifications, named hosting regions, or compliance badges." />
      <PageContainer className="grid gap-4 py-12 md:grid-cols-2">
        {points.map(([title, copy]) => (
          <section className="border border-border p-5" key={title}>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </section>
        ))}
      </PageContainer>
    </>
  )
}
