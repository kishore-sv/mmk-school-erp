"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactMethods, indianStates, studentCountRanges } from "@/config/contact"
import { siteConfig, telHref } from "@/config/site"
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { quoteSchema, type QuoteInput } from "@/lib/forms/schemas"
import { submitEnquiry, type EnquiryResult } from "@/lib/forms/submit-enquiry"

export function EnquiryForm({ kind }: { kind: "quote" }) {
  return <QuoteEnquiryForm />
}

function SubmissionFeedback({ result }: { result: EnquiryResult | null }) {
  if (!result || result.status === "sent") return null

  if (result.status === "unconfigured") {
    return (
      <div className="rounded-lg border border-border p-4 text-sm leading-6">
        <p>We could not send your enquiry automatically.</p>
        <p className="mt-2">
          Email{" "}
          <a className="underline" href={result.mailto}>
            {siteConfig.email}
          </a>{" "}
          or call{" "}
          {siteConfig.phones.map((phone, index) => (
            <span key={phone}>
              {index > 0 ? " or " : null}
              <a className="underline" href={telHref(phone)}>
                {phone}
              </a>
            </span>
          ))}
          .
        </p>
      </div>
    )
  }

  return <p className="text-sm text-destructive">{result.message}</p>
}

function QuoteEnquiryForm() {
  const form = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { consent: false },
  })
  const [result, setResult] = useState<EnquiryResult | null>(null)
  const pendingSuccess = useRef<EnquiryResult | null>(null)
  const error = (name: keyof QuoteInput) => form.formState.errors[name]?.message

  if (result?.status === "sent") {
    return <p className="text-sm leading-6">Your enquiry was sent. We will reply using the contact details you entered.</p>
  }

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <FieldGroup>
        <Field data-invalid={error("contactPerson") ? true : undefined}>
          <FieldLabel htmlFor="contactPerson">Contact person</FieldLabel>
          <Input id="contactPerson" aria-invalid={!!error("contactPerson")} {...form.register("contactPerson")} />
          <FieldError>{error("contactPerson")}</FieldError>
        </Field>
        <Field data-invalid={error("schoolName") ? true : undefined}>
          <FieldLabel htmlFor="schoolName">School name</FieldLabel>
          <Input id="schoolName" aria-invalid={!!error("schoolName")} {...form.register("schoolName")} />
          <FieldError>{error("schoolName")}</FieldError>
        </Field>
        <Field data-invalid={error("email") ? true : undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" aria-invalid={!!error("email")} {...form.register("email")} />
          <FieldError>{error("email")}</FieldError>
        </Field>
        <Field data-invalid={error("phone") ? true : undefined}>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" type="tel" aria-invalid={!!error("phone")} {...form.register("phone")} />
          <FieldError>{error("phone")}</FieldError>
        </Field>
        <Field data-invalid={error("city") ? true : undefined}>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" aria-invalid={!!error("city")} {...form.register("city")} />
          <FieldError>{error("city")}</FieldError>
        </Field>
        <Field data-invalid={error("state") ? true : undefined}>
          <FieldLabel htmlFor="state">State</FieldLabel>
          <select
            id="state"
            className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            aria-invalid={!!error("state")}
            {...form.register("state")}
          >
            <option value="">Select a state</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <FieldError>{error("state")}</FieldError>
        </Field>
        <Field data-invalid={error("studentCount") ? true : undefined}>
          <FieldLabel htmlFor="studentCount">Approximate student count</FieldLabel>
          <select
            id="studentCount"
            className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            aria-invalid={!!error("studentCount")}
            {...form.register("studentCount")}
          >
            <option value="">Select a range</option>
            {studentCountRanges.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <FieldError>{error("studentCount")}</FieldError>
        </Field>
        <Field data-invalid={error("contactMethod") ? true : undefined}>
          <FieldLabel htmlFor="contactMethod">Preferred contact method</FieldLabel>
          <select
            id="contactMethod"
            className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
            {...form.register("contactMethod")}
          >
            <option value="">Select</option>
            {contactMethods.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <FieldError>{error("contactMethod")}</FieldError>
        </Field>
        <Field data-invalid={error("requirements") ? true : undefined}>
          <FieldLabel htmlFor="requirements">Requirements</FieldLabel>
          <Textarea id="requirements" aria-invalid={!!error("requirements")} {...form.register("requirements")} />
          <FieldError>{error("requirements")}</FieldError>
        </Field>
        <Field orientation="horizontal" data-invalid={error("consent") ? true : undefined}>
          <Checkbox
            checked={form.watch("consent")}
            onCheckedChange={(checked) => form.setValue("consent", checked === true, { shouldValidate: true })}
            id="consent"
            aria-invalid={!!error("consent")}
          />
          <FieldLabel htmlFor="consent">I agree that MMK may use these details to respond to this enquiry.</FieldLabel>
          <FieldError>{error("consent")}</FieldError>
        </Field>
      </FieldGroup>
      <StatefulButton
        className="w-full sm:w-auto"
        onAfterSuccess={() => {
          if (pendingSuccess.current) setResult(pendingSuccess.current)
        }}
        onClick={async () => {
          const valid = await form.trigger()
          if (!valid) throw new Error("validation")
          const res = await submitEnquiry("quote", form.getValues())
          if (res.status !== "sent") {
            setResult(res)
            throw new Error("submit-failed")
          }
          pendingSuccess.current = res
        }}
      >
        Request a Custom Quote
      </StatefulButton>
      <SubmissionFeedback result={result} />
    </form>
  )
}