const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/

export function parsePortalHost(rawHost: string): boolean {
  const trimmed = rawHost.trim().toLowerCase()
  const colon = trimmed.lastIndexOf(":")
  const hasPort = colon > -1 && /^\d+$/.test(trimmed.slice(colon + 1))
  const hostname = (hasPort ? trimmed.slice(0, colon) : trimmed).replace(/\.+$/g, "")
  const port = hasPort ? trimmed.slice(colon + 1) : ""
  const localBase = process.env.SCHOOL_PORTAL_LOCAL_BASE_DOMAIN ?? "localhost"
  const prodBase = process.env.SCHOOL_PORTAL_PRODUCTION_BASE_DOMAIN ?? "mmkerp.tech"
  const adminBase = process.env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN ?? "admin.mmkerp.tech"
  const localPort = process.env.SCHOOL_PORTAL_LOCAL_PORT ?? "3002"
  if (!hostname || hostname === "localhost" || hostname === localBase || hostname === prodBase || hostname === adminBase) {
    return false
  }
  let label = ""
  if (hostname.endsWith(`.${adminBase}`)) {
    return false
  }
  if (hostname.endsWith(`.${prodBase}`)) {
    label = hostname.slice(0, -(prodBase.length + 1))
  } else if (hostname.endsWith(`.${localBase}`)) {
    if (port && port !== localPort) {
      return false
    }
    label = hostname.slice(0, -(localBase.length + 1))
  } else {
    return false
  }
  return Boolean(label) && !label.includes(".") && LABEL.test(label)
}
