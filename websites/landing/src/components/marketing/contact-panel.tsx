import { contactSteps } from "@/config/contact"
import { CompanyContactBlock, FormStepsBlock } from "@/components/marketing/company-contact-block"

export function ContactPanel() {
  return (
    <section aria-labelledby="contact-intro-heading" className="flex flex-col gap-8">
      <p className="text-sm font-medium text-muted-foreground">Contact</p>
      <div className="flex flex-col gap-3">
        <h1 id="contact-intro-heading" className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Let&apos;s talk about your school.
        </h1>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          Tell us about your school and your requirements. Our team will help you understand how MMK School ERP can
          support your school&apos;s operations.
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t border-border pt-8">
        <CompanyContactBlock />
        <FormStepsBlock title="What happens next" steps={contactSteps} />
      </div>
    </section>
  )
}