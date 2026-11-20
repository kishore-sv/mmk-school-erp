import { PageHeader } from "@/components/page-header"

const titles: Record<string, string> = {
  plans: "Plans",
  subscriptions: "Active subscriptions",
  usage: "Usage and limits",
  payments: "Payments",
  invoices: "Invoices",
  tickets: "Support tickets",
  requests: "Feature requests",
  announcements: "Announcements",
  health: "System health",
  queues: "Queue monitoring",
  analytics: "Analytics",
  audit: "Audit logs and security",
  users: "Platform users",
  settings: "Settings",
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const title = titles[slug] ?? "Unavailable"
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={title}
        crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: title }]}
      />
      <div className="rounded-xl border p-8">
        <p className="font-medium">This section is not available yet.</p>
        <p className="text-muted-foreground mt-1 text-sm">
          It is reserved in the platform navigation. No records or actions are available here.
        </p>
      </div>
    </div>
  )
}
