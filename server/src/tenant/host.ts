export type TenantApp = "school-admin" | "portal"

export type HostConfig = {
  schoolAdminLocalBaseDomain: string
  schoolPortalLocalBaseDomain: string
  schoolAdminProductionBaseDomain: string
  schoolPortalProductionBaseDomain: string
  schoolAdminLocalPort: number
  portalLocalPort: number
}

export type ParsedTenantHost =
  | { ok: true; app: TenantApp; label: string }
  | { ok: false; reason: "invalid_host" | "missing_code" | "malformed_code" }

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/

function strip(value: string): string {
  return value.trim().toLowerCase().replace(/^\.+|\.+$/g, "")
}

export function parseTenantHost(rawHost: string, config: HostConfig): ParsedTenantHost {
  const trimmed = rawHost.trim().toLowerCase()
  if (!trimmed || trimmed.includes("/") || trimmed.includes(" ")) {
    return { ok: false, reason: "invalid_host" }
  }
  const colon = trimmed.lastIndexOf(":")
  const hasPort = colon > -1 && /^\d+$/.test(trimmed.slice(colon + 1))
  const hostname = strip(hasPort ? trimmed.slice(0, colon) : trimmed)
  const port = hasPort ? Number(trimmed.slice(colon + 1)) : null
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return { ok: false, reason: "missing_code" }
  }

  const adminProd = strip(config.schoolAdminProductionBaseDomain)
  const portalProd = strip(config.schoolPortalProductionBaseDomain)
  const adminLocal = strip(config.schoolAdminLocalBaseDomain)
  const portalLocal = strip(config.schoolPortalLocalBaseDomain)

  if (hostname === adminProd || hostname === portalProd || hostname === adminLocal || hostname === portalLocal) {
    return { ok: false, reason: "missing_code" }
  }

  let label = ""
  let app: TenantApp | null = null

  if (hostname.endsWith(`.${adminProd}`)) {
    label = hostname.slice(0, -(adminProd.length + 1))
    app = "school-admin"
  } else if (hostname.endsWith(`.${portalProd}`)) {
    label = hostname.slice(0, -(portalProd.length + 1))
    app = "portal"
  } else if (adminLocal === portalLocal && hostname.endsWith(`.${adminLocal}`)) {
    label = hostname.slice(0, -(adminLocal.length + 1))
    if (port === config.schoolAdminLocalPort) {
      app = "school-admin"
    } else if (port === config.portalLocalPort) {
      app = "portal"
    } else {
      return { ok: false, reason: "invalid_host" }
    }
  } else if (hostname.endsWith(`.${adminLocal}`)) {
    label = hostname.slice(0, -(adminLocal.length + 1))
    app = "school-admin"
    if (port !== null && port !== config.schoolAdminLocalPort) {
      return { ok: false, reason: "invalid_host" }
    }
  } else if (hostname.endsWith(`.${portalLocal}`)) {
    label = hostname.slice(0, -(portalLocal.length + 1))
    app = "portal"
    if (port !== null && port !== config.portalLocalPort) {
      return { ok: false, reason: "invalid_host" }
    }
  } else {
    return { ok: false, reason: "invalid_host" }
  }

  if (!label || label.includes(".")) {
    return { ok: false, reason: "malformed_code" }
  }
  if (!LABEL.test(label)) {
    return { ok: false, reason: "malformed_code" }
  }
  return { ok: true, app, label }
}

export function schoolCodeMatches(storedCode: string, label: string): boolean {
  return storedCode.toLowerCase() === label.toLowerCase()
}
