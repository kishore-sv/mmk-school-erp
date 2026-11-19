import { ModuleDirectory } from "@/components/catalog/module-directory"
import { PageContainer, PageHero } from "@/components/marketing/page-shell"
import { modules } from "@/data/modules"
import { createMetadata } from "@/lib/seo/create-metadata"

export const metadata = createMetadata({
  title: "School ERP modules",
  description: "Directory of the 17 MMK School ERP modules, from admissions and attendance to fees, exams, and permissions.",
  path: "/modules",
})

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Modules / Services" title="Every module in MMK School ERP" description="These 17 modules are the product. Each one has its own explanation and links to the workflows inside it." />
      <PageContainer className="py-12">
        <ModuleDirectory modules={modules} />
      </PageContainer>
    </>
  )
}
