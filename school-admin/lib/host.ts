export type ParsedHost =
  | { ok: true; label: string }
  | { ok: false }

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/

export function parseSchoolAdminHost(rawHost: string): ParsedHost {
  const trimmed = rawHost.trim().toLowerCase()
  const colon = trimmed.lastIndexOf(":")
  const hasPort = colon > -1 && /^\d+$/.test(trimmed.slice(colon + 1))
  const hostname = (hasPort ? trimmed.slice(0, colon) : trimmed).replace(/\.+$/g, "")
  const port = hasPort ? trimmed.slice(colon + 1) : ""
  const localBase = process.env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN ?? "localhost"
  const prodBase = process.env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN ?? "admin.mmkerp.tech"
  const localPort = process.env.SCHOOL_ADMIN_LOCAL_PORT ?? "3001"
  if (!hostname || hostname === "localhost" || hostname === localBase || hostname === prodBase) {
    return { ok: false }
  }
  let label = ""
  if (hostname.endsWith(`.${prodBase}`)) {
    label = hostname.slice(0, -(prodBase.length + 1))
  } else if (hostname.endsWith(`.${localBase}`)) {
    if (port && port !== localPort) {
      return { ok: false }
    }
    label = hostname.slice(0, -(localBase.length + 1))
  } else {
    return { ok: false }
  }
  if (!label || label.includes(".") || !LABEL.test(label)) {
    return { ok: false }
  }
  return { ok: true, label }
}
