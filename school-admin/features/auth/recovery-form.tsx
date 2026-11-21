"use client"

import Link from "next/link"
import { useState } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, type ApiFailure } from "@/lib/api"

export function RecoveryForm() {
  const [step, setStep] = useState<"email" | "otp" | "password" | "done">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  async function requestCode(event?: React.FormEvent) {
    event?.preventDefault()
    setPending(true)
    setError("")
    try {
      const result = await api<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      })
      setMessage(result.message)
      setStep("otp")
      setCooldown(60)
      const timer = window.setInterval(() => {
        setCooldown((value) => {
          if (value <= 1) {
            window.clearInterval(timer)
            return 0
          }
          return value - 1
        })
      }, 1000)
    } catch (caught) {
      setError((caught as ApiFailure).message)
    } finally {
      setPending(false)
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    try {
      await api("/auth/verify-reset-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      })
      setStep("password")
    } catch (caught) {
      setError((caught as ApiFailure).message)
    } finally {
      setPending(false)
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ newPassword: password, confirmPassword: confirm }),
      })
      setStep("done")
    } catch (caught) {
      setError((caught as ApiFailure).message)
    } finally {
      setPending(false)
    }
  }

  if (step === "done") {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Password updated</h1>
        <p className="text-sm text-muted-foreground">You can sign in with the new password. Existing sessions were signed out.</p>
        <Button nativeButton={false} render={<Link href="/login" />}>Back to sign in</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {step === "email" ? (
        <form className="flex flex-col gap-4" onSubmit={(event) => void requestCode(event)}>
          <div>
            <h1 className="text-2xl font-semibold">Forgot password</h1>
            <p className="text-sm text-muted-foreground">Enter the email for this school administrator. The school is taken from the address you are using.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <Button type="submit" disabled={pending}>Send code</Button>
        </form>
      ) : null}
      {step === "otp" ? (
        <form className="flex flex-col gap-4" onSubmit={(event) => void verify(event)}>
          <div>
            <h1 className="text-2xl font-semibold">Enter the code</h1>
            <p className="text-sm text-muted-foreground">The code expires in 5 minutes. {message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="otp">Six-digit code</Label>
            <Input id="otp" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value)} required />
          </div>
          <Button type="submit" disabled={pending}>Verify</Button>
          <Button type="button" variant="outline" disabled={pending || cooldown > 0} onClick={() => void requestCode()}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </Button>
        </form>
      ) : null}
      {step === "password" ? (
        <form className="flex flex-col gap-4" onSubmit={(event) => void save(event)}>
          <div>
            <h1 className="text-2xl font-semibold">Choose a new password</h1>
            <p className="text-sm text-muted-foreground">Use at least 12 characters with a letter and a number.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New password</Label>
            <div className="flex gap-2">
              <Input id="password" type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required />
              <Button type="button" variant="outline" onClick={() => setShow((value) => !value)}>{show ? <IconEyeOff /> : <IconEye />}</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type={show ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
          </div>
          <Button type="submit" disabled={pending}>Save password</Button>
        </form>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
