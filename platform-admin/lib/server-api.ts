import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export class ServerApiError extends Error {
  status: number

  constructor(status: number) {
    super("The platform API request failed.")
    this.status = status
  }
}

export async function serverApi<T>(path: string): Promise<T> {
  const jar = await cookies()
  const target = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:4000"
  const response = await fetch(`${target}/v1/platform${path}`, {
    headers: { cookie: jar.toString() },
    cache: "no-store",
  })
  if (response.status === 401) {
    redirect("/login")
  }
  if (response.status === 403) {
    const body = (await response.json().catch(() => null)) as {
      error?: { code?: string }
    } | null
    if (body?.error?.code === "PASSWORD_CHANGE_REQUIRED") {
      redirect("/account/password")
    }
  }
  if (!response.ok) {
    throw new ServerApiError(response.status)
  }
  return (await response.json()) as T
}
