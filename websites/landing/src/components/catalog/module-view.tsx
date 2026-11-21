import Link from "next/link"
import { CtaBand, PageContainer } from "@/components/marketing/page-shell"
import { FaqList } from "@/components/marketing/faq-list"
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema"
import { getModule, modules, type ModuleRecord } from "@/data/modules"
import { featuresForModule } from "@/data/features"

export function ModuleView({ module }: { module: ModuleRecord }) {
  const related = module.related.map((slug) => getModule(slug)).filter((item) => item != null)
  const featureList = featuresForModule(module.slug)
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Modules", href: "/modules" },
    { label: module.title },
  ]
  const faqs = featureList.flatMap((feature) => feature.faqs).slice(0, 4)
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs.map((item) => ({ name: item.label, path: item.href ?? `/modules/${module.slug}` })))} />
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <PageContainer className="py-10">
        <p className="text-sm text-muted-foreground">Module</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">{module.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7">{module.definition}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-xl font-semibold">The problem it addresses</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{module.problem}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Who uses it</h2>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-muted-foreground">
                {module.whoUses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold">What the school can do</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {module.capabilities.map((item) => (
                  <li className="rounded-lg border border-border px-3 py-2 text-sm" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Why it matters</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                {module.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Feature guides</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {featureList.map((feature) => (
                  <li key={feature.slug}>
                    <Link className="font-medium underline-offset-4 hover:underline" href={`/features/${feature.slug}`}>
                      {feature.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{feature.definition}</p>
                  </li>
                ))}
              </ul>
            </section>
            {faqs.length ? (
              <section>
                <h2 className="text-xl font-semibold">Questions</h2>
                <div className="mt-3">
                  <FaqList items={faqs} />
                </div>
              </section>
            ) : null}
          </div>
          <aside className="h-fit border border-border p-4">
            <h2 className="text-sm font-semibold">Related modules</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link className="text-sm underline-offset-4 hover:underline" href={`/modules/${item.slug}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="text-sm underline-offset-4 hover:underline" href="/modules">
                  All {modules.length} modules
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </PageContainer>
      <CtaBand title={`See ${module.title} in a demo`} description="Tell us which workflows matter for your school. We will walk through this module with your team." />
    </>
  )
}
