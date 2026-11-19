import { demoSteps } from "@/config/contact"
import { CompanyContactBlock, FormStepsBlock } from "@/components/marketing/company-contact-block"

export function DemoPanel() {
  return (
    <section aria-labelledby="demo-intro-heading" className="flex flex-col gap-8">
      <p className="text-sm font-medium text-muted-foreground">Book a demo</p>
      <div className="flex flex-col gap-3">
        <h1 id="demo-intro-heading" className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          See MMK School ERP in action.
        </h1>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          Request a guided walkthrough for your school. There is no live calendar on this page - we will reach out using
          your preferred contact method to agree a time.
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t border-border pt-8">
        <CompanyContactBlock />
        <FormStepsBlock title="What happens next" steps={demoSteps} />
      </div>
    </section>
  )
}