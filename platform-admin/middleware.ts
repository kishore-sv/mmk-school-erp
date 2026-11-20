import { NextResponse, type NextRequest } from "next/server"

import { verifyAccessToken } from "@/lib/access-token"

const ACCESS = "mmk_platform_access"
const REFRESH = "mmk_platform_refresh"
const CSRF = "mmk_platform_csrf"

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

async function refreshSession(request: NextRequest) {
  const csrf = request.cookies.get(CSRF)?.value
  const refresh = request.cookies.get(REFRESH)?.value
  if (!csrf || !refresh) {
    return null
  }
  const target = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:4000"
  const response = await fetch(`${target}/v1/platform/auth/refresh`, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
      origin: request.nextUrl.origin,
      "x-csrf-token": csrf,
    },
    cache: "no-store",
  })
  if (!response.ok) {
    return null
  }
  const next = NextResponse.redirect(request.nextUrl)
  for (const cookie of response.headers.getSetCookie()) {
    next.headers.append("set-cookie", cookie)
  }
  return next
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secret = process.env.PLATFORM_ACCESS_TOKEN_SECRET ?? ""
  const access = request.cookies.get(ACCESS)?.value
  const claims =
    secret && access ? await verifyAccessToken(access, secret) : null

  if (!claims && request.cookies.get(REFRESH)?.value) {
    const refreshed = await refreshSession(request)
    if (refreshed) {
      return refreshed
    }
  }

  const authenticated = Boolean(claims)
  if (pathname === "/login") {
    if (!authenticated) {
      return NextResponse.next()
    }
    const url = request.nextUrl.clone()
    url.pathname = claims?.mcp ? "/account/password" : "/dashboard"
    return NextResponse.redirect(url)
  }

  if (!authenticated) {
    return loginRedirect(request)
  }

  if (claims?.mcp && pathname !== "/account/password") {
    const url = request.nextUrl.clone()
    url.pathname = "/account/password"
    return NextResponse.redirect(url)
  }

  if (!claims?.mcp && pathname === "/account/password") {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo).*)"],
}
