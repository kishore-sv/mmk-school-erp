import { CtaBand, PageContainer, PageHero } from "@/components/marketing/page-shell"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: 'Platform administration',
  description: 'MMK operators onboard schools. A school administrator does not use this area and cannot open another school.',
  path: '/platform/platform-administration',
})

export default function Page() {
  return (
    <>
      <PageHero title='Platform administration' description='MMK operators onboard schools. A school administrator does not use this area and cannot open another school.' />
      <PageContainer className="py-12">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="border border-border px-3 py-2 text-sm" key="School onboarding and account status">School onboarding and account status</li>
          <li className="border border-border px-3 py-2 text-sm" key="Subscription records and module entitlements">Subscription records and module entitlements</li>
          <li className="border border-border px-3 py-2 text-sm" key="Usage limits and platform users">Usage limits and platform users</li>
          <li className="border border-border px-3 py-2 text-sm" key="Billing records for the MMK subscription, separate from school fee collection">Billing records for the MMK subscription, separate from school fee collection</li>
          <li className="border border-border px-3 py-2 text-sm" key="Support, lifecycle, audit, and platform analytics">Support, lifecycle, audit, and platform analytics</li>
        </ul>
      </PageContainer>
      <CtaBand title="Compare this experience in a demo" description="We will sign in as the role you care about and stay inside one school." />
    </>
  )
}
