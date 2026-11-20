"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { SchoolForm, type SchoolFormValues } from "@/features/schools/school-form"
import type { SchoolDetail } from "@/types/platform"

export function SchoolActions({ school }: { school: SchoolDetail }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [action, setAction] = useState<"suspend" | "activate" | "archive" | null>(null)
  const [reason, setReason] = useState("")
  const [pending, setPending] = useState(false)
  const archived = school.status === "archived"

  async function confirm() {
    if (!action) return
    setPending(true)
    try {
      await api(`/schools/${school.id}/${action}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      })
      toast("School updated")
      setAction(null)
      setReason("")
      router.refresh()
    } catch (error) {
      toast("School was not updated", error instanceof Error ? error.message : undefined)
    } finally {
      setPending(false)
    }
  }

  const initial: SchoolFormValues = {
    name: school.name,
    schoolCode: school.schoolCode,
    website: school.website ?? "",
    email: school.email,
    phone: school.phone,
    schoolType: school.schoolType,
    board: school.board ?? "",
    country: school.country,
    state: school.state,
    city: school.city,
    postalCode: school.postalCode,
    addressLine1: school.addressLine1,
    addressLine2: school.addressLine2 ?? "",
    billingModel: school.commercial.billingModel,
    perStudentRate: school.commercial.perStudentRate,
    billingFrequency: school.commercial.billingFrequency,
    subscriptionStart: school.commercial.subscriptionStart.slice(0, 10),
    subscriptionEnd: school.commercial.subscriptionEnd.slice(0, 10),
    studentLimit: school.commercial.studentLimit ? String(school.commercial.studentLimit) : "",
    commercialNotes: school.commercial.notes ?? "",
    adminName: school.initialAdmin.fullName,
    adminEmail: school.initialAdmin.email,
    adminPhone: school.initialAdmin.phone,
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" disabled={archived} onClick={() => setEditing(true)}>Edit</Button>
      {school.status === "active" ? (
        <Button variant="outline" onClick={() => setAction("suspend")}>Suspend</Button>
      ) : null}
      {school.status === "suspended" ? (
        <Button variant="outline" onClick={() => setAction("activate")}>Activate</Button>
      ) : null}
      {archived ? null : (
        <Button variant="destructive" onClick={() => setAction("archive")}>Archive</Button>
      )}
      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Edit school</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <SchoolForm
              initial={initial}
              includeCode={false}
              submitLabel="Save changes"
              onSubmit={async (body) => {
                await api(`/schools/${school.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(body),
                })
                toast("School saved")
                setEditing(false)
                router.refresh()
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      <AlertDialog open={action !== null} onOpenChange={(open) => { if (!open) setAction(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "archive" ? "Archive this school?" : action === "suspend" ? "Suspend this school?" : "Activate this school?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "archive"
                ? "Archiving keeps the school record and does not delete tenant data. The school cannot be edited afterward."
                : "This changes the school's platform status."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason, optional" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={() => void confirm()}>
              {pending ? "Working..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
