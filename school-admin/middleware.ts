import { NextResponse, type NextRequest } from "next/server"

import { verifyAccessToken } from "@/lib/access-token"
import { parseSchoolAdminHost } from "@/lib/host"

const ACCESS = "mmk_school_access"
const REFRESH = "mmk_school_refresh"
const CSRF = "mmk_school_csrf"
const PUBLIC = new Set(["/login", "/forgot-password", "/reset-password", "/host-not-found", "/unavailable"])

function loginRedirect(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = "/login"
  url.search = ""
  const response = NextResponse.redirect(url)
  response.cookies.set(ACCESS, "", { path: "/", maxAge: 0 })
  response.cookies.set(REFRESH, "", { path: "/", maxAge: 0 })
  response.cookies.set(CSRF, "", { path: "/", maxAge: 0 })
  return response
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""
  const parsed = parseSchoolAdminHost(host)
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api/")) {
    if (!parsed.ok) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Not found." } }, { status: 404 })
    }
    const headers = new Headers(request.headers)
    headers.set("x-mmk-school-host", host)
    return NextResponse.next({ request: { headers } })
  }
  if (!parsed.ok) {
    if (pathname === "/host-not-found") {
      return NextResponse.next()
    }
    const url = request.nextUrl.clone()
    url.pathname = "/host-not-found"
    return NextResponse.rewrite(url)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-mmk-school-host", host)

  if (pathname !== "/unavailable" && pathname !== "/host-not-found") {
    const target = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:4000"
    const context = await fetch(`${target}/v1/school/tenant/context`, {
      headers: { "x-mmk-school-host": host },
      cache: "no-store",
    }).catch(() => null)
    if (!context || context.status === 404) {
      const url = request.nextUrl.clone()
      url.pathname = "/host-not-found"
      return NextResponse.rewrite(url)
    }
    const body = (await context.json().catch(() => null)) as { school?: { status?: string } } | null
    if (body?.school?.status === "unavailable" && pathname !== "/unavailable") {
      const url = request.nextUrl.clone()
      url.pathname = "/unavailable"
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    }
  }

  const secret = process.env.SCHOOL_ACCESS_TOKEN_SECRET ?? ""
  const access = request.cookies.get(ACCESS)?.value
  const claims = secret && access ? await verifyAccessToken(access, secret) : null
  const authenticated = Boolean(claims)

  if (PUBLIC.has(pathname)) {
    if (authenticated && (pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password")) {
      const url = request.nextUrl.clone()
      url.pathname = claims?.mcp ? "/account/password" : "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (!authenticated) {
    return loginRedirect(request)
  }
  if (claims?.mcp && pathname !== "/account/password") {
    const url = request.nextUrl.clone()
    url.pathname = "/account/password"
    return NextResponse.redirect(url)
  }
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|illustrations).*)"],
}
