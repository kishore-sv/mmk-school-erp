"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactMethods, studentCountRanges } from "@/config/contact"
import { modules } from "@/data/modules"
import { StateCombobox } from "@/components/forms/state-combobox"
import {
  ENQUIRY_MESSAGE_MAX,
  EnquiryResultAlerts,
  EnquirySuccessCard,
  MessageCharacterCount,
  RequiredMark,
} from "@/components/forms/enquiry-form-shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { demoSchema, type DemoInput } from "@/lib/forms/schemas"
import { submitEnquiry, type EnquiryResult } from "@/lib/forms/submit-enquiry"

export function DemoEnquiryForm() {
  const form = useForm<DemoInput>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      fullName: "",
      schoolName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      studentCount: undefined,
      contactMethod: undefined,
      modules: [],
      preferredDate: "",
      message: "",
      consent: false,
      enquiryType: "demo",
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<EnquiryResult | null>(null)

  const fieldError = (name: keyof DemoInput) => form.formState.errors[name]?.message

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await submitEnquiry("demo", values)
      if (res.status === "sent") {
        setSubmitted(true)
        form.reset({ enquiryType: "demo", modules: [], consent: false })
        toast.success("Demo request submitted")
        return
      }
      setResult(res)
      if (res.status === "error") {
        toast.error("Request not sent")
      }
    } finally {
      setSubmitting(false)
    }
  })

  if (submitted) {
    return (
      <EnquirySuccessCard
        title="Demo request submitted"
        description="Your demo request has been submitted successfully. Our team will contact you to schedule a walkthrough."
      />
    )
  }

  return (
    <Card className="ring-foreground/10">
      <CardHeader className="border-b border-border">
        <CardTitle>Request a demo</CardTitle>
        <CardDescription>
          All fields marked with * are required. Preferred demo date is optional. This form does not book a slot
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-(--card-spacing)">
        <form className="flex flex-col gap-6" noValidate onSubmit={onSubmit}>
          <FieldGroup className="gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={fieldError("fullName") ? true : undefined}>
                <FieldLabel htmlFor="demo-fullName">
                  Full name
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="demo-fullName"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  aria-invalid={!!fieldError("fullName")}
                  disabled={submitting}
                  {...form.register("fullName")}
                />
                <FieldError>{fieldError("fullName")}</FieldError>
              </Field>

              <Field data-invalid={fieldError("schoolName") ? true : undefined}>
                <FieldLabel htmlFor="demo-schoolName">
                  School name
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="demo-schoolName"
                  autoComplete="organization"
                  placeholder="Enter your school name"
                  aria-invalid={!!fieldError("schoolName")}
                  disabled={submitting}
                  {...form.register("schoolName")}
                />
                <FieldError>{fieldError("schoolName")}</FieldError>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={fieldError("email") ? true : undefined}>
                <FieldLabel htmlFor="demo-email">
                  Email
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="demo-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={!!fieldError("email")}
                  disabled={submitting}
                  {...form.register("email")}
                />
                <FieldError>{fieldError("email")}</FieldError>
              </Field>

              <Field data-invalid={fieldError("phone") ? true : undefined}>
                <FieldLabel htmlFor="demo-phone">
                  Phone
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="demo-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 XXXXX XXXXX"
                  aria-invalid={!!fieldError("phone")}
                  disabled={submitting}
                  {...form.register("phone")}
                />
                <FieldError>{fieldError("phone")}</FieldError>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={fieldError("city") ? true : undefined}>
                <FieldLabel htmlFor="demo-city">
                  City
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="demo-city"
                  autoComplete="address-level2"
                  placeholder="Enter your city"
                  aria-invalid={!!fieldError("city")}
                  disabled={submitting}
                  {...form.register("city")}
                />
                <FieldError>{fieldError("city")}</FieldError>
              </Field>

              <Field data-invalid={fieldError("state") ? true : undefined}>
                <FieldLabel htmlFor="demo-state">
                  State
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <StateCombobox
                      id="demo-state"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      invalid={!!fieldError("state")}
                      disabled={submitting}
                    />
                  )}
                />
                <FieldError>{fieldError("state")}</FieldError>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={fieldError("studentCount") ? true : undefined}>
                <FieldLabel htmlFor="demo-studentCount">
                  Approximate student count
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="studentCount"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? null}
                      onValueChange={(value) => field.onChange(value ?? undefined)}
                      disabled={submitting}
                    >
                      <SelectTrigger
                        id="demo-studentCount"
                        className="w-full"
                        aria-invalid={!!fieldError("studentCount")}
                      >
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentCountRanges.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{fieldError("studentCount")}</FieldError>
              </Field>

              <Field data-invalid={fieldError("contactMethod") ? true : undefined}>
                <FieldLabel htmlFor="demo-contactMethod">
                  Preferred contact method
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="contactMethod"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? null}
                      onValueChange={(value) => field.onChange(value ?? undefined)}
                      disabled={submitting}
                    >
                      <SelectTrigger
                        id="demo-contactMethod"
                        className="w-full"
                        aria-invalid={!!fieldError("contactMethod")}
                      >
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactMethods.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{fieldError("contactMethod")}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="demo-preferredDate">Preferred demo date (optional)</FieldLabel>
              <Input id="demo-preferredDate" type="date" disabled={submitting} {...form.register("preferredDate")} />
            </Field>

            <Field data-invalid={fieldError("modules") ? true : undefined}>
              <FieldLabel>
                Interested modules
                <RequiredMark />
              </FieldLabel>
              <p className="text-sm text-muted-foreground">Select at least one module to focus on during the demo.</p>
              <Controller
                name="modules"
                control={form.control}
                render={({ field }) => (
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {modules.map((module) => {
                      const checked = field.value?.includes(module.slug) ?? false
                      return (
                        <label
                          key={module.slug}
                          className="flex items-start gap-2.5 text-sm leading-snug"
                          htmlFor={`module-${module.slug}`}
                        >
                          <Checkbox
                            id={`module-${module.slug}`}
                            className="mt-0.5"
                            disabled={submitting}
                            checked={checked}
                            onCheckedChange={(on) => {
                              const next = on
                                ? [...(field.value ?? []), module.slug]
                                : (field.value ?? []).filter((slug) => slug !== module.slug)
                              field.onChange(next)
                            }}
                          />
                          {module.title}
                        </label>
                      )
                    })}
                  </div>
                )}
              />
              <FieldError>{fieldError("modules")}</FieldError>
            </Field>

            <Field data-invalid={fieldError("message") ? true : undefined}>
              <FieldLabel htmlFor="demo-message">
                Message
                <RequiredMark />
              </FieldLabel>
              <Textarea
                id="demo-message"
                rows={5}
                className="min-h-32 resize-y"
                placeholder="Tell us about your school, the challenges you want to solve, and what you hope to see in the demonstration."
                aria-invalid={!!fieldError("message")}
                disabled={submitting}
                maxLength={ENQUIRY_MESSAGE_MAX}
                aria-describedby="demo-message-length"
                {...form.register("message")}
              />
              <MessageCharacterCount id="demo-message-length" length={form.watch("message")?.length ?? 0} />
              <FieldError>{fieldError("message")}</FieldError>
            </Field>

            <Field orientation="horizontal" data-invalid={fieldError("consent") ? true : undefined}>
              <Checkbox
                id="demo-consent"
                checked={form.watch("consent")}
                disabled={submitting}
                aria-invalid={!!fieldError("consent")}
                onCheckedChange={(checked) => form.setValue("consent", checked === true, { shouldValidate: true })}
              />
              <FieldLabel htmlFor="demo-consent" className="font-normal leading-snug">
                I agree that MMK may use these details to respond to my enquiry.
                <RequiredMark />
              </FieldLabel>
              <FieldError>{fieldError("consent")}</FieldError>
            </Field>
          </FieldGroup>

          <EnquiryResultAlerts result={result} />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="size-4" />
                Sending request...
              </>
            ) : (
              "Request a demo"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}