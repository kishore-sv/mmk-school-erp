"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
import { api } from "@/lib/api"
import { uploadSchoolBranding } from "@/lib/branding-upload"
import { SchoolForm, emptySchoolForm } from "@/features/schools/school-form"

export function CreateSchoolForm() {
  const router = useRouter()
  const idempotencyKey = useRef(crypto.randomUUID())

  return (
    <SchoolForm
      initial={emptySchoolForm}
      includeCode
      submitLabel="Create school"
      onSubmit={async (body, files) => {
        const result = await api<{ school: { id: string } }>("/schools", {
          method: "POST",
          headers: { "idempotency-key": idempotencyKey.current },
          body: JSON.stringify(body),
        })
        if (files.logo) {
          await uploadSchoolBranding(result.school.id, "logo", files.logo)
        }
        if (files.banner) {
          await uploadSchoolBranding(result.school.id, "banner", files.banner)
        }
        toast.success("School created", {
          description: "A welcome email was queued. The initial password is not included in that email.",
        })
        router.push(`/schools/${result.school.id}`)
        router.refresh()
      }}
    />
  )
}
