import { NextResponse, type NextRequest } from "next/server"

import { parsePortalHost } from "@/lib/host"

export function middleware(request: NextRequest) {
  if (parsePortalHost(request.headers.get("host") ?? "")) {
    return NextResponse.next()
  }
  if (request.nextUrl.pathname === "/host-not-found") {
    return NextResponse.next()
  }
  const url = request.nextUrl.clone()
  url.pathname = "/host-not-found"
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|illustrations).*)"],
}
