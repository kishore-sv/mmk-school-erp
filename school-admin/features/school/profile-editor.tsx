"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, type ApiFailure } from "@/lib/api"

type Profile = {
  schoolCode: string
  name: string
  email: string
  phone: string
  website: string | null
  description: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  schoolType: string
  board: string | null
  logoUrl: string | null
  bannerUrl: string | null
}

const empty = {
  name: "",
  email: "",
  phone: "",
  website: "",
  description: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
}

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [values, setValues] = useState(empty)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  useEffect(() => {
    void api<{ school: Profile }>("/profile").then((result) => {
      setProfile(result.school)
      setValues({
        name: result.school.name,
        email: result.school.email,
        phone: result.school.phone,
        website: result.school.website ?? "",
        description: result.school.description ?? "",
        addressLine1: result.school.addressLine1,
        addressLine2: result.school.addressLine2 ?? "",
        city: result.school.city,
        state: result.school.state,
        postalCode: result.school.postalCode,
      })
    })
  }, [])

  function set(key: keyof typeof empty, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    setMessage("")
    try {
      const result = await api<{ school: Profile }>("/profile", {
        method: "PATCH",
        body: JSON.stringify(values),
      })
      setProfile(result.school)
      setMessage("School profile saved.")
    } catch (caught) {
      setError((caught as ApiFailure).message)
    } finally {
      setPending(false)
    }
  }

  async function upload(purpose: "logo" | "banner", file: File | undefined) {
    if (!file) {
      return
    }
    setError("")
    const started = await api<{
      uploadId: string
      presigned: { url: string; headers?: Record<string, string> } | null
      multipart: boolean
    }>("/branding/uploads", {
      method: "POST",
      body: JSON.stringify({ purpose, contentType: file.type, contentLength: file.size }),
    })
    if (!started.presigned || started.multipart) {
      setError("Choose an image under 5 MB.")
      return
    }
    const uploaded = await fetch(started.presigned.url, {
      method: "PUT",
      headers: started.presigned.headers,
      body: file,
    })
    if (!uploaded.ok) {
      setError("The file could not be uploaded.")
      return
    }
    await api(`/branding/uploads/${started.uploadId}/complete`, { method: "POST", body: "{}" })
    const refreshed = await api<{ school: Profile }>("/profile")
    setProfile(refreshed.school)
    setMessage(purpose === "logo" ? "Logo updated." : "Banner updated.")
  }

  async function remove(purpose: "logo" | "banner") {
    await api(`/branding/${purpose}`, { method: "DELETE" })
    const refreshed = await api<{ school: Profile }>("/profile")
    setProfile(refreshed.school)
  }

  if (!profile) {
    return <p className="text-sm text-muted-foreground">Loading school profile...</p>
  }

  return (
    <form className="flex max-w-3xl flex-col gap-6" onSubmit={(event) => void save(event)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="School name" value={values.name} onChange={(value) => set("name", value)} />
        <Field label="School code" value={profile.schoolCode} readOnly />
        <Field label="School email" type="email" value={values.email} onChange={(value) => set("email", value)} />
        <Field label="School phone" value={values.phone} onChange={(value) => set("phone", value)} />
        <Field label="Website" value={values.website} onChange={(value) => set("website", value)} />
        <Field label="Country" value={profile.country} readOnly />
        <Field label="State" value={values.state} onChange={(value) => set("state", value)} />
        <Field label="City" value={values.city} onChange={(value) => set("city", value)} />
        <Field label="Postal code" value={values.postalCode} onChange={(value) => set("postalCode", value)} />
        <Field label="Address" value={values.addressLine1} onChange={(value) => set("addressLine1", value)} />
        <Field label="Address line 2" value={values.addressLine2} onChange={(value) => set("addressLine2", value)} />
        <Field label="School type" value={profile.schoolType.replaceAll("_", " ")} readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">School description</Label>
        <Input id="description" value={values.description} onChange={(event) => set("description", event.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <BrandingField label="School logo" preview={profile.logoUrl} onFile={(file) => void upload("logo", file)} onRemove={() => void remove("logo")} />
        <BrandingField label="School banner" preview={profile.bannerUrl} onFile={(file) => void upload("banner", file)} onRemove={() => void remove("banner")} />
      </div>
      <p className="text-muted-foreground text-sm">PNG, JPEG, or WebP. Logo up to 2 MB. Banner up to 8 MB. The school code and subscription details stay with Platform Admin.</p>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      {message ? <p className="text-sm">{message}</p> : null}
      <Button type="submit" disabled={pending} className="w-fit">{pending ? "Saving..." : "Save profile"}</Button>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  type?: string
  readOnly?: boolean
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} />
    </div>
  )
}

function BrandingField({
  label,
  preview,
  onFile,
  onRemove,
}: {
  label: string
  preview: string | null
  onFile: (file: File | undefined) => void
  onRemove: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-24 w-full rounded-md border object-contain" />
      ) : (
        <p className="text-muted-foreground text-sm">No image uploaded.</p>
      )}
      <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onFile(event.target.files?.[0])} />
      <Button type="button" variant="outline" onClick={onRemove}>Remove</Button>
    </div>
  )
}
