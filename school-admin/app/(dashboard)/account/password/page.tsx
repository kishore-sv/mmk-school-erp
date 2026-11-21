"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { ModuleScreen } from "@/components/module-screen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, type ApiFailure } from "@/lib/api"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    try {
      await api("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      router.push("/dashboard")
      router.refresh()
    } catch (caught) {
      setError((caught as ApiFailure).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <ModuleScreen
      title="Change password"
      description="Use at least 12 characters with a letter and a number. Existing sessions are replaced after the password changes."
      crumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Change password" }]}
    >
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => void submit(event)}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type={show ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="next">New password</Label>
          <div className="flex gap-2">
            <Input id="next" type={show ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            <Button type="button" variant="outline" onClick={() => setShow((value) => !value)}>
              {show ? <IconEyeOff /> : <IconEye />}
              <span className="sr-only">Show password</span>
            </Button>
          </div>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save password"}</Button>
      </form>
    </ModuleScreen>
  )
}
