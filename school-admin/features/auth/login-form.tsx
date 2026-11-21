"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, type ApiFailure } from "@/lib/api"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    try {
      const result = await api<{ user: { mustChangePassword: boolean } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      router.push(result.user.mustChangePassword ? "/account/password" : "/dashboard")
      router.refresh()
    } catch (caught) {
      setError((caught as ApiFailure).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={(event) => void submit(event)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Use the administrator account for this school.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="flex gap-2">
          <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button type="button" variant="outline" onClick={() => setShow((value) => !value)}>
            {show ? <IconEyeOff /> : <IconEye />}
            <span className="sr-only">{show ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</Button>
      <Button variant="link" nativeButton={false} render={<Link href="/forgot-password" />} className="px-0">
        Forgot password
      </Button>
    </form>
  )
}
