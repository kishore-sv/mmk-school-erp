import { expect, test } from "bun:test"

import { parseTenantHost, type HostConfig } from "./host"

const config: HostConfig = {
  schoolAdminLocalBaseDomain: "localhost",
  schoolPortalLocalBaseDomain: "localhost",
  schoolAdminProductionBaseDomain: "admin.mmkerp.tech",
  schoolPortalProductionBaseDomain: "mmkerp.tech",
  schoolAdminLocalPort: 3001,
  portalLocalPort: 3002,
}

test("parses a local school-admin hostname", () => {
  const parsed = parseTenantHost("mmk-demo.localhost:3001", config)
  expect(parsed).toEqual({ ok: true, app: "school-admin", label: "mmk-demo" })
})

test("parses a local portal hostname", () => {
  const parsed = parseTenantHost("mmk-demo.localhost:3002", config)
  expect(parsed).toEqual({ ok: true, app: "portal", label: "mmk-demo" })
})

test("parses a production school-admin hostname", () => {
  const parsed = parseTenantHost("mmk-demo.admin.mmkerp.tech", config)
  expect(parsed).toEqual({ ok: true, app: "school-admin", label: "mmk-demo" })
})

test("rejects bare localhost and missing school codes", () => {
  expect(parseTenantHost("localhost:3001", config).ok).toBe(false)
  expect(parseTenantHost("admin.mmkerp.tech", config).ok).toBe(false)
  expect(parseTenantHost("mmkerp.tech", config).ok).toBe(false)
})

test("rejects malformed labels and the wrong application domain", () => {
  expect(parseTenantHost("mmk_demo.localhost:3001", config).ok).toBe(false)
  expect(parseTenantHost("-bad.localhost:3001", config).ok).toBe(false)
  expect(parseTenantHost("mmk-demo.example.com", config).ok).toBe(false)
  expect(parseTenantHost("mmk-demo.localhost:3002", config).ok).toBe(true)
  expect(parseTenantHost("mmk-demo.localhost:3999", config).ok).toBe(false)
})
