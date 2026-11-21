"use client"

import { useState } from "react"

import { DateField } from "@/components/date-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api, type ApiFailure } from "@/lib/api"

export type SchoolFormValues = {
  name: string
  schoolCode: string
  website: string
  email: string
  phone: string
  schoolType: string
  board: string
  country: string
  state: string
  city: string
  postalCode: string
  addressLine1: string
  addressLine2: string
  billingModel: string
  perStudentRate: string
  billingFrequency: string
  subscriptionStart: string
  subscriptionEnd: string
  studentLimit: string
  commercialNotes: string
  description: string
  adminName: string
  adminEmail: string
  adminPhone: string
  adminPassword: string
  adminPasswordConfirm: string
}

export const emptySchoolForm: SchoolFormValues = {
  name: "",
  schoolCode: "",
  website: "",
  email: "",
  phone: "",
  schoolType: "k12",
  board: "",
  country: "",
  state: "",
  city: "",
  postalCode: "",
  addressLine1: "",
  addressLine2: "",
  billingModel: "per_student",
  perStudentRate: "",
  billingFrequency: "monthly",
  subscriptionStart: "",
  subscriptionEnd: "",
  studentLimit: "",
  commercialNotes: "",
  description: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  adminPassword: "",
  adminPasswordConfirm: "",
}

function payload(values: SchoolFormValues, includeCode: boolean) {
  return {
    ...(includeCode ? { schoolCode: values.schoolCode } : {}),
    name: values.name,
    website: values.website,
    email: values.email,
    phone: values.phone,
    schoolType: values.schoolType,
    board: values.board,
    country: values.country,
    state: values.state,
    city: values.city,
    postalCode: values.postalCode,
    addressLine1: values.addressLine1,
    addressLine2: values.addressLine2,
    billingModel: values.billingModel,
    perStudentRate: values.perStudentRate,
    billingFrequency: values.billingFrequency,
    subscriptionStart: values.subscriptionStart,
    subscriptionEnd: values.subscriptionEnd,
    studentLimit: values.studentLimit ? Number(values.studentLimit) : undefined,
    commercialNotes: values.commercialNotes,
    description: values.description,
    adminName: values.adminName,
    adminEmail: values.adminEmail,
    adminPhone: values.adminPhone,
    adminPassword: values.adminPassword,
    adminPasswordConfirm: values.adminPasswordConfirm,
  }
}

export function SchoolForm({
  initial,
  includeCode,
  submitLabel,
  onSubmit,
}: {
  initial: SchoolFormValues
  includeCode: boolean
  submitLabel: string
  onSubmit: (body: ReturnType<typeof payload>, files: { logo: File | null; banner: File | null }) => Promise<void>
}) {
  const [values, setValues] = useState(initial)
  const [logo, setLogo] = useState<File | null>(null)
  const [banner, setBanner] = useState<File | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  function set<K extends keyof SchoolFormValues>(key: K, value: SchoolFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    try {
      await onSubmit(payload(values, includeCode), { logo, banner })
    } catch (caught) {
      const failure = caught as ApiFailure
      const detail = failure.details?.[0]
      setError(detail ? `${detail.path}: ${detail.message}` : failure.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={(event) => void submit(event)}>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">School information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="School name" value={values.name} onChange={(value) => set("name", value)} required />
          {includeCode ? (
            <Field label="School code" value={values.schoolCode} onChange={(value) => set("schoolCode", value)} required />
          ) : null}
          <Field label="Website" value={values.website} onChange={(value) => set("website", value)} />
          <Field label="School email" type="email" value={values.email} onChange={(value) => set("email", value)} required />
          <Field label="School phone" value={values.phone} onChange={(value) => set("phone", value)} required />
          <Choice
            label="School type"
            value={values.schoolType}
            onChange={(value) => set("schoolType", value)}
            options={[
              ["pre_primary", "Pre-primary"],
              ["primary", "Primary"],
              ["secondary", "Secondary"],
              ["higher_secondary", "Higher secondary"],
              ["k12", "K-12"],
              ["other", "Other"],
            ]}
          />
          <Field label="Board or affiliation" value={values.board} onChange={(value) => set("board", value)} />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Address</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Country" value={values.country} onChange={(value) => set("country", value)} required />
          <Field label="State" value={values.state} onChange={(value) => set("state", value)} required />
          <Field label="City" value={values.city} onChange={(value) => set("city", value)} required />
          <Field label="Postal code" value={values.postalCode} onChange={(value) => set("postalCode", value)} required />
          <Field label="Address line 1" value={values.addressLine1} onChange={(value) => set("addressLine1", value)} required />
          <Field label="Address line 2" value={values.addressLine2} onChange={(value) => set("addressLine2", value)} />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Subscription</h2>
        <p className="text-muted-foreground text-sm">
          Enter the rate agreed for this school. The platform does not publish a fixed price.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Choice
            label="Billing model"
            value={values.billingModel}
            onChange={(value) => set("billingModel", value)}
            options={[["per_student", "Per student"], ["custom", "Custom"]]}
          />
          <Field label="Per-student rate" value={values.perStudentRate} onChange={(value) => set("perStudentRate", value)} required />
          <Choice
            label="Billing frequency"
            value={values.billingFrequency}
            onChange={(value) => set("billingFrequency", value)}
            options={[["monthly", "Monthly"], ["quarterly", "Quarterly"], ["annual", "Annual"], ["custom", "Custom"]]}
          />
          <Field label="Agreed student limit" value={values.studentLimit} onChange={(value) => set("studentLimit", value)} />
          <div className="flex flex-col gap-2">
            <Label>Subscription start</Label>
            <DateField value={values.subscriptionStart} onChange={(value) => set("subscriptionStart", value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Subscription end</Label>
            <DateField value={values.subscriptionEnd} onChange={(value) => set("subscriptionEnd", value)} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Commercial notes</Label>
          <Textarea id="notes" value={values.commercialNotes} onChange={(event) => set("commercialNotes", event.target.value)} />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Initial school admin</h2>
        <p className="text-muted-foreground text-sm">
          Set an initial password for the first sign-in. The password is stored as a hash and is not included in the welcome email. Leave it blank only when the administrator will set a password through recovery later.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" value={values.adminName} onChange={(value) => set("adminName", value)} required />
          <Field label="Email" type="email" value={values.adminEmail} onChange={(value) => set("adminEmail", value)} required />
          <Field label="Phone number" value={values.adminPhone} onChange={(value) => set("adminPhone", value)} required />
          <Field label="Initial password" type="password" value={values.adminPassword} onChange={(value) => set("adminPassword", value)} />
          <Field label="Confirm password" type="password" value={values.adminPasswordConfirm} onChange={(value) => set("adminPasswordConfirm", value)} />
        </div>
        <p className="text-muted-foreground text-sm">Use at least 12 characters with a letter and a number.</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">School branding</h2>
        <p className="text-muted-foreground text-sm">PNG, JPEG, or WebP. Logo up to 2 MB. Banner up to 8 MB. SVG files are not accepted.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="school-logo">School logo</Label>
            <Input id="school-logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="school-banner">School banner</Label>
            <Input id="school-banner" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setBanner(event.target.files?.[0] ?? null)} />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">School description</h2>
        <Textarea value={values.description} onChange={(event) => set("description", event.target.value)} />
      </section>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

function Choice({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<[string, string]>
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select
        value={value}
        items={Object.fromEntries(options)}
        onValueChange={(next) => onChange(next ?? value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([option, text]) => (
            <SelectItem key={option} value={option}>{text}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
