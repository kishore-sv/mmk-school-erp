import type { Env } from "../config/env"
import { parseTenantHost } from "./host"

export function listedOrigins(env: Env): Set<string> {
  return new Set(
    env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  )
}

export function isAllowedBrowserOrigin(origin: string, env: Env): boolean {
  if (listedOrigins(env).has(origin)) {
    return true
  }
  let url: URL
  try {
    url = new URL(origin)
  } catch {
    return false
  }
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    return false
  }
  const host = url.port ? `${url.hostname}:${url.port}` : url.hostname
  const parsed = parseTenantHost(host, {
    schoolAdminLocalBaseDomain: env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN,
    schoolPortalLocalBaseDomain: env.SCHOOL_PORTAL_LOCAL_BASE_DOMAIN,
    schoolAdminProductionBaseDomain: env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN,
    schoolPortalProductionBaseDomain: env.SCHOOL_PORTAL_PRODUCTION_BASE_DOMAIN,
    schoolAdminLocalPort: env.SCHOOL_ADMIN_LOCAL_PORT,
    portalLocalPort: env.SCHOOL_PORTAL_LOCAL_PORT,
  })
  if (!parsed.ok) {
    return false
  }
  if (parsed.app === "school-admin" && url.protocol === "http:" && url.hostname.endsWith(`.${env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN}`)) {
    return true
  }
  if (parsed.app === "portal" && url.protocol === "http:" && url.hostname.endsWith(`.${env.SCHOOL_PORTAL_LOCAL_BASE_DOMAIN}`)) {
    return true
  }
  if (url.protocol !== "https:") {
    return false
  }
  return parsed.app === "school-admin" || parsed.app === "portal"
}
