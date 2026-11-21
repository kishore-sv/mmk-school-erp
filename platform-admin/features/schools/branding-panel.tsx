"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { uploadSchoolBranding } from "@/lib/branding-upload"

export function BrandingPanel({ schoolId }: { schoolId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function replace(purpose: "logo" | "banner", file: File | undefined) {
    if (!file) {
      return
    }
    setPending(true)
    try {
      await uploadSchoolBranding(schoolId, purpose, file)
      toast.success(purpose === "logo" ? "Logo updated" : "Banner updated")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The file could not be saved.")
    } finally {
      setPending(false)
    }
  }

  async function remove(purpose: "logo" | "banner") {
    setPending(true)
    try {
      await api(`/schools/${schoolId}/branding/${purpose}`, { method: "DELETE" })
      toast.success(purpose === "logo" ? "Logo removed" : "Banner removed")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The branding could not be removed.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="replace-logo">School logo</Label>
          <p className="text-muted-foreground text-sm">PNG, JPEG, or WebP. Up to 2 MB.</p>
          <Input id="replace-logo" type="file" accept="image/png,image/jpeg,image/webp" disabled={pending} onChange={(event) => void replace("logo", event.target.files?.[0])} />
          <Button type="button" variant="outline" disabled={pending} onClick={() => void remove("logo")}>Remove logo</Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="replace-banner">School banner</Label>
          <p className="text-muted-foreground text-sm">PNG, JPEG, or WebP. Up to 8 MB.</p>
          <Input id="replace-banner" type="file" accept="image/png,image/jpeg,image/webp" disabled={pending} onChange={(event) => void replace("banner", event.target.files?.[0])} />
          <Button type="button" variant="outline" disabled={pending} onClick={() => void remove("banner")}>Remove banner</Button>
        </div>
      </CardContent>
    </Card>
  )
}
