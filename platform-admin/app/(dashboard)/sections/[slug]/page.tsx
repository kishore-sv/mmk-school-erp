import { PageHeader } from "@/components/page-header"
import { sectionTitles } from "@/lib/page-titles"

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const title = sectionTitles[slug] ?? "Unavailable"
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
