import Link from "next/link"
import { CtaBand, PageContainer } from "@/components/marketing/page-shell"
import { SiteBreadcrumbs } from "@/components/marketing/site-breadcrumbs"
import { FaqList } from "@/components/marketing/faq-list"
import { ProductPreview } from "@/components/marketing/product-preview"
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema"
import { getModule } from "@/data/modules"
import { relatedFeatures, type FeatureRecord } from "@/data/features"

export function FeatureView({ feature }: { feature: FeatureRecord }) {
  const parentModule = getModule(feature.moduleSlug)
  const related = relatedFeatures(feature.slug)
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Modules", path: "/modules" },
    { name: parentModule?.title ?? "Module", path: `/modules/${feature.moduleSlug}` },
    { name: feature.title, path: `/features/${feature.slug}` },
  ]
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(feature.faqs)} />
      <PageContainer className="py-10">
        <SiteBreadcrumbs
          items={crumbs.map((item, index) => ({
            label: item.name,
            href: index === crumbs.length - 1 ? undefined : item.path,
          }))}
        />
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">{feature.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7">{feature.definition}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-xl font-semibold">Problem it solves</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.problem}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">How it works</h2>
              <ol className="mt-3 flex flex-col gap-3">
                {feature.howItWorks.map((step, index) => (
                  <li className="flex gap-3 text-sm" key={step}>
                    <span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Key capabilities</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {feature.capabilities.map((item) => (
                  <li className="border border-border px-3 py-2 text-sm" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Who benefits</h2>
              <p className="mt-3 text-sm text-muted-foreground">{feature.audiences.join(", ")}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">What this looks like</h2>
              <div className="mt-3">
                <ProductPreview />
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold">FAQ</h2>
              <div className="mt-3">
                <FaqList items={feature.faqs} />
              </div>
            </section>
          </div>
          <aside className="flex flex-col gap-6">
            {parentModule ? (
              <div className="border border-border p-4">
                <h2 className="text-sm font-semibold">Related module</h2>
                <Link className="mt-2 inline-block text-sm underline-offset-4 hover:underline" href={`/modules/${parentModule.slug}`}>
                  {parentModule.title}
                </Link>
              </div>
            ) : null}
            <div className="border border-border p-4">
              <h2 className="text-sm font-semibold">Related features</h2>
              <ul className="mt-2 flex flex-col gap-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link className="text-sm underline-offset-4 hover:underline" href={`/features/${item.slug}`}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </PageContainer>
      <CtaBand title="Walk through this workflow" description="Book a demo and we will use your school's questions, not a generic slide." />
    </>
  )
}
