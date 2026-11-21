export type ApiFailure = Error & {
  status: number
  code?: string
  details?: Array<{ path: string; message: string }>
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json")
  }
  const method = (init.method ?? "GET").toUpperCase()
  if (method !== "GET" && method !== "HEAD") {
    const csrf = document.cookie
      .split("; ")
      .find((part) => part.startsWith("mmk_school_csrf="))
      ?.slice("mmk_school_csrf=".length)
    if (csrf) {
      headers.set("x-csrf-token", decodeURIComponent(csrf))
    }
  }
  const response = await fetch(`/api/v1/school${path}`, {
    ...init,
    headers,
    credentials: "include",
  })
  if (response.status === 204) {
    return undefined as T
  }
  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string; code?: string; details?: ApiFailure["details"] }
    message?: string
  } | null
  if (!response.ok) {
    const error = new Error(body?.error?.message ?? "The request could not be completed.") as ApiFailure
    error.status = response.status
    error.code = body?.error?.code
    error.details = body?.error?.details
    throw error
  }
  return body as T
}
