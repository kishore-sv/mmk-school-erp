"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/toast"
import { api } from "@/lib/api"
import { SchoolForm, emptySchoolForm } from "@/features/schools/school-form"

export function CreateSchoolForm() {
  const router = useRouter()
  const idempotencyKey = useRef(crypto.randomUUID())

  return (
    <SchoolForm
      initial={emptySchoolForm}
      includeCode
      submitLabel="Create school"
      onSubmit={async (body) => {
        const result = await api<{ school: { id: string } }>("/schools", {
          method: "POST",
          headers: { "idempotency-key": idempotencyKey.current },
          body: JSON.stringify(body),
        })
        toast("School created", "The initial school admin invitation has not been delivered.")
        router.push(`/schools/${result.school.id}`)
        router.refresh()
      }}
    />
  )
}
