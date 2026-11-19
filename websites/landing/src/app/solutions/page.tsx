import Link from "next/link"
import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { solutions } from "@/data/solutions"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "Solutions by school role",
  description: "How MMK School ERP supports school leadership, administrators, principals, teachers, parents, students, admissions, academics, and fee administration.",
  path: "/solutions",
})

export default function Page() {
  return (
    <>
      <PageHero title="Solutions for the people who run a school" description="These pages describe the same product from a role or workflow. They do not add modules outside the 17." />
      <PageContainer className="grid gap-4 py-12 md:grid-cols-3">
        {solutions.map((item) => (
          <Link className="border border-border p-5" href={`/solutions/${item.slug}`} key={item.slug}>
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.definition}</p>
          </Link>
        ))}
      </PageContainer>
    </>
  )
}
