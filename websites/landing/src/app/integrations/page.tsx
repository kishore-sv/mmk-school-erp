import Link from "next/link"
import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { integrations } from "@/data/integrations"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Integrations",
  description: "Configurable push, email, SMS, WhatsApp, and school fee payment options for MMK School ERP. No provider is claimed as already connected.",
  path: "/integrations",
})

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Integrations" title="Channels you can configure" description="These are optional connections around the product. A category on this list is not a promise that a named provider is already live." />
      <PageContainer className="grid gap-4 py-12 md:grid-cols-2">
        {integrations.map((item) => (
          <Link className="border border-border p-5" href={`/integrations/${item.slug}`} key={item.slug}>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.definition}</p>
          </Link>
        ))}
      </PageContainer>
    </>
  )
}
