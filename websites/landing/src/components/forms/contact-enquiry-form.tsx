"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactEnquiryTypes, studentCountRanges } from "@/config/contact"
import { StateCombobox } from "@/components/forms/state-combobox"
import {
  EnquiryResultAlerts,
  EnquirySuccessCard,
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
import { contactSchema, type ContactInput } from "@/lib/forms/schemas"
import { submitEnquiry, type EnquiryResult } from "@/lib/forms/submit-enquiry"

export function ContactEnquiryForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      schoolName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      studentCount: undefined,
      enquiryType: undefined,
      message: "",
      consent: false,
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<EnquiryResult | null>(null)

  const fieldError = (name: keyof ContactInput) => form.formState.errors[name]?.message

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await submitEnquiry("contact", values)
      if (res.status === "sent") {
        setSubmitted(true)
        form.reset()
        toast.success("Enquiry submitted")
        return
      }
      setResult(res)
      if (res.status === "error") {
        toast.error("Enquiry not sent")
      }
    } finally {
      setSubmitting(false)
    }
  })

  if (submitted) {
    return (
      <EnquirySuccessCard
        title="Enquiry submitted"
        description="Your enquiry has been submitted successfully. Our team will contact you."
      />
    )
  }

  return (
    <Card className="ring-foreground/10">
      <CardHeader className="border-b border-border">
        <CardTitle>Send an enquiry</CardTitle>
        <CardDescription>All fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent className="pt-(--card-spacing)">
        <form className="flex flex-col gap-6" noValidate onSubmit={onSubmit}>
          <FieldGroup className="gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={fieldError("fullName") ? true : undefined}>
                <FieldLabel htmlFor="fullName">
                  Full name
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  aria-invalid={!!fieldError("fullName")}
                  disabled={submitting}
                  {...form.register("fullName")}
                />
                <FieldError>{fieldError("fullName")}</FieldError>
              </Field>

              <Field data-invalid={fieldError("schoolName") ? true : undefined}>
                <FieldLabel htmlFor="schoolName">
                  School name
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="schoolName"
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
                <FieldLabel htmlFor="email">
                  Email
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="email"
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
                <FieldLabel htmlFor="phone">
                  Phone
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="phone"
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
                <FieldLabel htmlFor="city">
                  City
                  <RequiredMark />
                </FieldLabel>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  placeholder="Enter your city"
                  aria-invalid={!!fieldError("city")}
                  disabled={submitting}
                  {...form.register("city")}
                />
                <FieldError>{fieldError("city")}</FieldError>
              </Field>

              <Field data-invalid={fieldError("state") ? true : undefined}>
                <FieldLabel htmlFor="state">
                  State
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="state"
                  control={form.control}
                  render={({ field }) => (
                    <StateCombobox
                      id="state"
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
                <FieldLabel htmlFor="studentCount">
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
                      <SelectTrigger id="studentCount" className="w-full" aria-invalid={!!fieldError("studentCount")}>
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

              <Field data-invalid={fieldError("enquiryType") ? true : undefined}>
                <FieldLabel htmlFor="enquiryType">
                  Enquiry type
                  <RequiredMark />
                </FieldLabel>
                <Controller
                  name="enquiryType"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? null}
                      onValueChange={(value) => field.onChange(value ?? undefined)}
                      disabled={submitting}
                    >
                      <SelectTrigger id="enquiryType" className="w-full" aria-invalid={!!fieldError("enquiryType")}>
                        <SelectValue placeholder="Select enquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactEnquiryTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{fieldError("enquiryType")}</FieldError>
              </Field>
            </div>

            <Field data-invalid={fieldError("message") ? true : undefined}>
              <FieldLabel htmlFor="message">
                Message
                <RequiredMark />
              </FieldLabel>
              <Textarea
                id="message"
                rows={5}
                className="min-h-32 resize-y"
                placeholder="Tell us about your school and what you would like to know about MMK School ERP."
                aria-invalid={!!fieldError("message")}
                disabled={submitting}
                {...form.register("message")}
              />
              <FieldError>{fieldError("message")}</FieldError>
            </Field>

            <Field orientation="horizontal" data-invalid={fieldError("consent") ? true : undefined}>
              <Checkbox
                id="consent"
                checked={form.watch("consent")}
                disabled={submitting}
                aria-invalid={!!fieldError("consent")}
                onCheckedChange={(checked) => form.setValue("consent", checked === true, { shouldValidate: true })}
              />
              <FieldLabel htmlFor="consent" className="font-normal leading-snug">
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
                Sending enquiry...
              </>
            ) : (
              "Send Enquiry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}