"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
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
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { uploadSchoolBranding } from "@/lib/branding-upload"
import { SchoolForm, type SchoolFormValues } from "@/features/schools/school-form"
import type { SchoolDetail } from "@/types/platform"

type LifecycleAction = "suspend" | "activate" | "archive"

function needsEmailVerification(action: LifecycleAction | null) {
  return action === "suspend" || action === "archive"
}

export function SchoolActions({ school }: { school: SchoolDetail }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [action, setAction] = useState<LifecycleAction | null>(null)
  const [step, setStep] = useState<"details" | "otp">("details")
  const [reason, setReason] = useState("")
  const [otp, setOtp] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")
  const [pending, setPending] = useState(false)
  const archived = school.status === "archived"

  useEffect(() => {
    if (action === null) {
      setStep("details")
      setOtp("")
      setMaskedEmail("")
      setReason("")
    }
  }, [action])

  async function sendVerificationCode() {
    if (!action || !needsEmailVerification(action)) return
    setPending(true)
    try {
      const result = await api<{ maskedEmail: string }>(
        `/schools/${school.id}/lifecycle-verification/request`,
        {
          method: "POST",
          body: JSON.stringify({ action }),
        },
      )
      setMaskedEmail(result.maskedEmail)
      setStep("otp")
      toast.success("Verification code sent", {
        description: `Check ${result.maskedEmail} for the 6-digit code.`,
      })
    } catch (error) {
      toast.error("Code not sent", {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setPending(false)
    }
  }

  async function confirm() {
    if (!action) return
    if (needsEmailVerification(action) && step === "details") {
      await sendVerificationCode()
      return
    }
    setPending(true)
    try {
      let verificationToken: string | undefined
      if (needsEmailVerification(action)) {
        const verified = await api<{ verificationToken: string }>(
          `/schools/${school.id}/lifecycle-verification/verify`,
          {
            method: "POST",
            body: JSON.stringify({ action, code: otp }),
          },
        )
        verificationToken = verified.verificationToken
      }
      await api(`/schools/${school.id}/${action}`, {
        method: "POST",
        body: JSON.stringify({
          reason,
          ...(verificationToken ? { verificationToken } : {}),
        }),
      })
      toast.success("School updated")
      setAction(null)
      setReason("")
      setOtp("")
      router.refresh()
    } catch (error) {
      toast.error("School was not updated", {
        description: error instanceof Error ? error.message : undefined,
      })
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
    description: school.description ?? "",
    adminName: school.initialAdmin.fullName,
    adminEmail: school.initialAdmin.email,
    adminPhone: school.initialAdmin.phone,
    adminPassword: "",
    adminPasswordConfirm: "",
  }

  const confirmLabel =
    step === "otp"
      ? pending
        ? "Working..."
        : "Verify and confirm"
      : needsEmailVerification(action)
        ? pending
          ? "Sending..."
          : "Send verification code"
        : pending
          ? "Working..."
          : "Confirm"

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
              onSubmit={async (body, files) => {
                await api(`/schools/${school.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(body),
                })
                if (files.logo) {
                  await uploadSchoolBranding(school.id, "logo", files.logo)
                }
                if (files.banner) {
                  await uploadSchoolBranding(school.id, "banner", files.banner)
                }
                toast.success("School saved")
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
                : needsEmailVerification(action)
                  ? step === "otp"
                    ? `Enter the 6-digit code sent to ${maskedEmail || "your platform admin email"}.`
                    : "A verification code will be emailed to your platform admin address before this change is applied."
                  : "This changes the school's platform status."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {step === "details" ? (
            <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason, optional" />
          ) : (
            <div className="flex flex-col gap-2">
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
              />
              <Button
                type="button"
                variant="ghost"
                className="self-start px-0"
                disabled={pending}
                onClick={() => void sendVerificationCode()}
              >
                Resend code
              </Button>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending || (step === "otp" && otp.length !== 6)}
              onClick={(event) => {
                event.preventDefault()
                void confirm()
              }}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}