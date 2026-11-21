import { afterAll, beforeAll, beforeEach, expect, test } from "bun:test"
import type { Server } from "node:http"
import { eq, sql } from "drizzle-orm"

import { createApp } from "../../app"
import { getDb } from "../../db"
import { platformAdminUsers, schools, tenants } from "../../db/schema"
import { findUserByEmail } from "./auth/auth.repository"
import { normalizeEmail } from "./auth/auth.schemas"
import { createSchool } from "./schools/schools.service"

const password = "Correct-horse-12"
const email = "mmkerp@gmail.com"
let server: Server
let baseUrl = ""

beforeAll(async () => {
  process.env.PLATFORM_ADMIN_SEED_EMAIL = email
  process.env.PLATFORM_ADMIN_SEED_PASSWORD = password
  process.env.PLATFORM_ADMIN_SEED_NAME = "MMK Platform Administrator"
  process.env.PLATFORM_OTP_DEV_CODE = "123456"
  const { migrate } = await import("drizzle-orm/bun-sql/migrator")
  await migrate(getDb(), { migrationsFolder: "./src/db/migrations" })
  const app = createApp()
  server = app.listen(0, "127.0.0.1")
  await new Promise((resolve) => server.once("listening", resolve))
  const address = server.address()
  if (!address || typeof address === "string") {
    throw new Error("Test server did not bind a port.")
  }
  baseUrl = `http://127.0.0.1:${address.port}`
})

afterAll(() => {
  server.close()
})

beforeEach(async () => {
  await getDb().execute(sql`
    truncate table
      platform_idempotency_keys,
      email_job_attempts,
      email_jobs,
      storage_uploads,
      school_admin_password_resets,
      school_admin_password_history,
      school_admin_sessions,
      school_admin_login_attempts,
      school_admin_audit_logs,
      school_admin_accounts,
      school_commercial_terms,
      schools,
      tenants,
      platform_admin_audit_logs,
      platform_admin_password_history,
      platform_admin_sessions,
      platform_admin_login_attempts,
      platform_admin_school_action_verifications,
      platform_admin_users
    restart identity cascade
  `)
  process.env.PLATFORM_ADMIN_SEED_PASSWORD = password
  const { spawnSync } = await import("node:child_process")
  const result = spawnSync("bun", ["src/db/seed.ts"], {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8",
  })
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout)
  }
})

function cookiesFrom(response: Response): string {
  const list =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : []
  return list.map((cookie) => cookie.split(";")[0]).join("; ")
}

function csrfFrom(cookieHeader: string): string {
  const part = cookieHeader
    .split("; ")
    .find((item) => item.startsWith("mmk_platform_csrf="))
  return part?.slice("mmk_platform_csrf=".length) ?? ""
}

async function schoolLifecycleVerification(
  schoolId: string,
  action: "suspend" | "archive",
  cookie: string,
) {
  const requested = await authed(
    `/v1/platform/schools/${schoolId}/lifecycle-verification/request`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    },
    cookie,
  )
  expect(requested.status).toBe(200)
  const verified = await authed(
    `/v1/platform/schools/${schoolId}/lifecycle-verification/verify`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, code: "123456" }),
    },
    cookie,
  )
  expect(verified.status).toBe(200)
  const body = (await verified.json()) as { verificationToken: string }
  return body.verificationToken
}

async function login(nextEmail = email, nextPassword = password) {
  const response = await fetch(`${baseUrl}/v1/platform/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify({ email: nextEmail, password: nextPassword }),
  })
  const cookie = cookiesFrom(response)
  const body = (await response.json()) as {
    user: { mustChangePassword: boolean }
    error: { message: string }
  }
  return { response, cookie, body }
}

const schoolBody = {
  name: "MMK Demo School",
  schoolCode: "MMK-DEMO",
  website: "https://demo.example.edu",
  email: "office@demo.example.edu",
  phone: "9840011122",
  schoolType: "k12" as const,
  board: "CBSE",
  country: "India",
  state: "Tamil Nadu",
  city: "Chennai",
  postalCode: "600001",
  addressLine1: "12 School Road",
  addressLine2: "",
  billingModel: "per_student" as const,
  perStudentRate: "250.00",
  billingFrequency: "monthly" as const,
  subscriptionStart: "2026-04-01",
  subscriptionEnd: "2027-03-31",
  studentLimit: 800,
  commercialNotes: "Negotiated locally",
  adminName: "Ada Admin",
  adminEmail: "ada@demo.example.edu",
  adminPhone: "9840099988",
}

async function authed(path: string, init: RequestInit = {}, cookie = "") {
  const headers = new Headers(init.headers)
  if (!headers.has("origin")) {
    headers.set("origin", "http://localhost:3000")
  }
  if (cookie) {
    headers.set("cookie", cookie)
  }
  if (init.method && init.method !== "GET") {
    headers.set("x-csrf-token", csrfFrom(cookie))
  }
  return fetch(`${baseUrl}${path}`, { ...init, headers })
}

test("login succeeds and stores only a password hash", async () => {
  const result = await login()
  expect(result.response.status).toBe(200)
  expect(result.body.user.mustChangePassword).toBe(true)
  expect(JSON.stringify(result.body)).not.toContain(password)
  const user = await findUserByEmail(getDb(), normalizeEmail(email))
  expect(user?.passwordHash.startsWith("$argon2")).toBe(true)
  expect(user?.passwordHash).not.toContain(password)
})

test("incorrect password and unknown email return the same error", async () => {
  const wrong = await login(email, "wrong-password-12")
  const unknown = await login("missing@example.com", password)
  expect(wrong.response.status).toBe(401)
  expect(unknown.response.status).toBe(401)
  expect(wrong.body.error.message).toBe(unknown.body.error.message)
})

test("disabled account cannot sign in", async () => {
  await getDb()
    .update(platformAdminUsers)
    .set({ status: "disabled" })
    .where(eq(platformAdminUsers.email, email))
  const result = await login()
  expect(result.response.status).toBe(401)
  expect(result.body.error.message).toBe("The email or password is incorrect.")
})

test("login is rate limited", async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await login(email, "wrong-password-12")
    expect(result.response.status).toBe(401)
  }
  const blocked = await login()
  expect(blocked.response.status).toBe(429)
})

test("refresh rotates and reuse revokes the family", async () => {
  const first = await login()
  const refreshed = await authed("/v1/platform/auth/refresh", { method: "POST" }, first.cookie)
  expect(refreshed.status).toBe(200)
  const rotated = cookiesFrom(refreshed)
  const reuse = await authed("/v1/platform/auth/refresh", { method: "POST" }, first.cookie)
  expect(reuse.status).toBe(401)
  const afterReuse = await authed("/v1/platform/auth/refresh", { method: "POST" }, rotated)
  expect(afterReuse.status).toBe(401)
})

test("logout revokes the session", async () => {
  const first = await login()
  const loggedOut = await authed("/v1/platform/auth/logout", { method: "POST" }, first.cookie)
  expect(loggedOut.status).toBe(204)
  const again = await authed("/v1/platform/auth/refresh", { method: "POST" }, first.cookie)
  expect(again.status).toBe(401)
})

test("expired refresh session is rejected", async () => {
  const first = await login()
  await getDb().execute(sql`update platform_admin_sessions set expires_at = now() - interval '1 minute'`)
  const refreshed = await authed("/v1/platform/auth/refresh", { method: "POST" }, first.cookie)
  expect(refreshed.status).toBe(401)
})

test("first login must change password before school access", async () => {
  const first = await login()
  const blocked = await authed("/v1/platform/schools", {}, first.cookie)
  expect(blocked.status).toBe(403)
  const changed = await authed(
    "/v1/platform/auth/change-password",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        currentPassword: password,
        newPassword: "Replacement-password-12",
      }),
    },
    first.cookie,
  )
  expect(changed.status).toBe(200)
  const cookie = cookiesFrom(changed)
  const schoolsResponse = await authed("/v1/platform/schools", {}, cookie)
  expect(schoolsResponse.status).toBe(200)
  const reused = await authed(
    "/v1/platform/auth/change-password",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        currentPassword: "Replacement-password-12",
        newPassword: password,
      }),
    },
    cookie,
  )
  expect(reused.status).toBe(400)
  expect(reused.statusText.length).toBeGreaterThan(0)
  const body = (await reused.json()) as { error: { code: string } }
  expect(body.error.code).toBe("PASSWORD_REUSE")
})

test("there is no public signup route", async () => {
  const response = await fetch(`${baseUrl}/v1/platform/auth/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify({ email, password }),
  })
  expect(response.status).toBe(404)
})

test("school provisioning, listing, update, and lifecycle", async () => {
  const first = await login()
  const changed = await authed(
    "/v1/platform/auth/change-password",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        currentPassword: password,
        newPassword: "Replacement-password-12",
      }),
    },
    first.cookie,
  )
  const cookie = cookiesFrom(changed)
  const unauthenticated = await fetch(`${baseUrl}/v1/platform/schools`)
  expect(unauthenticated.status).toBe(401)

  const invalid = await authed(
    "/v1/platform/schools",
    { method: "POST", headers: { "content-type": "application/json" }, body: "{}" },
    cookie,
  )
  expect(invalid.status).toBe(400)

  const created = await authed(
    "/v1/platform/schools",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "school-1",
      },
      body: JSON.stringify(schoolBody),
    },
    cookie,
  )
  expect(created.status).toBe(201)
  const createdBody = (await created.json()) as {
    school: { id: string; initialAdmin: { status: string; invitationDelivery: string } }
  }
  expect(createdBody.school.initialAdmin.status).toBe("pending_invitation")
  expect(createdBody.school.initialAdmin.invitationDelivery).toBe("not_configured")
  expect(JSON.stringify(createdBody)).not.toContain("password")

  const replay = await authed(
    "/v1/platform/schools",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "school-1",
      },
      body: JSON.stringify(schoolBody),
    },
    cookie,
  )
  expect(replay.status).toBe(201)
  const replayBody = (await replay.json()) as { school: { id: string } }
  expect(replayBody.school.id).toBe(createdBody.school.id)

  const duplicate = await authed(
    "/v1/platform/schools",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...schoolBody, email: "other@demo.example.edu" }),
    },
    cookie,
  )
  expect(duplicate.status).toBe(409)

  const listed = await authed("/v1/platform/schools?q=MMK-DEMO&page=1&pageSize=10", {}, cookie)
  expect(listed.status).toBe(200)
  const listedBody = (await listed.json()) as {
    page: { total: number }
    data: Array<{ studentCount: number | null }>
  }
  expect(listedBody.page.total).toBe(1)
  expect(listedBody.data[0]?.studentCount).toBeNull()

  const detail = await authed(`/v1/platform/schools/${createdBody.school.id}`, {}, cookie)
  expect(detail.status).toBe(200)

  const updated = await authed(
    `/v1/platform/schools/${createdBody.school.id}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...schoolBody, name: "MMK Updated School" }),
    },
    cookie,
  )
  expect(updated.status).toBe(200)

  const suspendToken = await schoolLifecycleVerification(
    createdBody.school.id,
    "suspend",
    cookie,
  )
  const suspended = await authed(
    `/v1/platform/schools/${createdBody.school.id}/suspend`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: "Billing hold", verificationToken: suspendToken }),
    },
    cookie,
  )
  expect(suspended.status).toBe(200)
  const activated = await authed(
    `/v1/platform/schools/${createdBody.school.id}/activate`,
    { method: "POST", headers: { "content-type": "application/json" }, body: "{}" },
    cookie,
  )
  expect(activated.status).toBe(200)
  const archiveToken = await schoolLifecycleVerification(
    createdBody.school.id,
    "archive",
    cookie,
  )
  const archived = await authed(
    `/v1/platform/schools/${createdBody.school.id}/archive`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: "Closed", verificationToken: archiveToken }),
    },
    cookie,
  )
  expect(archived.status).toBe(200)
  const archivedBody = (await archived.json()) as { school: { status: string } }
  expect(archivedBody.school.status).toBe("archived")

  const dashboard = await authed("/v1/platform/dashboard", {}, cookie)
  expect(dashboard.status).toBe(200)
  const dashboardBody = (await dashboard.json()) as {
    schools: { total: number }
    people: { available: boolean }
    payments: { available: boolean }
  }
  expect(dashboardBody.schools.total).toBe(1)
  expect(dashboardBody.people.available).toBe(false)
  expect(dashboardBody.payments.available).toBe(false)
})

test("failed provisioning rolls back and seed is idempotent", async () => {
  const admin = await findUserByEmail(getDb(), email)
  if (!admin) {
    throw new Error("missing admin")
  }
  await expect(
    createSchool(admin.id, schoolBody, {
      ipAddress: "127.0.0.1",
      userAgent: "test",
      correlationId: "test",
    }, { failForTest: true }),
  ).rejects.toMatchObject({ code: "PROVISIONING_FAILED" })
  const [schoolCount] = await getDb().select({ count: sql<number>`count(*)::int` }).from(schools)
  const [tenantCount] = await getDb().select({ count: sql<number>`count(*)::int` }).from(tenants)
  expect(schoolCount?.count).toBe(0)
  expect(tenantCount?.count).toBe(0)

  const second = Bun.spawnSync(["bun", "src/db/seed.ts"], {
    cwd: process.cwd(),
    env: process.env,
    stdout: "pipe",
    stderr: "pipe",
  })
  expect(second.exitCode).toBe(0)
  expect(new TextDecoder().decode(second.stdout)).toContain("already present")
  expect(new TextDecoder().decode(second.stdout)).not.toContain(password)
})

test("duplicate platform admin email is rejected", async () => {
  const admin = await findUserByEmail(getDb(), email)
  let rejected = false
  try {
    await getDb().insert(platformAdminUsers).values({
      email,
      passwordHash: admin?.passwordHash ?? "hash",
      name: "Duplicate",
    })
  } catch {
    rejected = true
  }
  expect(rejected).toBe(true)
})
