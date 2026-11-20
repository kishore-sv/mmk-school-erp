import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { verifyAccessToken } from "@/lib/access-token"

export default async function HomePage() {
  const secret = process.env.PLATFORM_ACCESS_TOKEN_SECRET ?? ""
  const token = (await cookies()).get("mmk_platform_access")?.value
  const claims = secret && token ? await verifyAccessToken(token, secret) : null
  redirect(claims ? (claims.mcp ? "/account/password" : "/dashboard") : "/login")
}
