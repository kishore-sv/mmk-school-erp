import { afterAll, beforeAll, expect, test } from "bun:test"
import type { Server } from "node:http"
import { eq } from "drizzle-orm"

import { createApp } from "../../app"
import { getDb } from "../../db"
import { schoolAdminAccounts, schoolAdminPasswordResets } from "../../db/schema"
import { createSchool } from "../platform/schools/schools.service"
import { findUserByEmail } from "../platform/auth/auth.repository"

let server: Server
let baseUrl = ""
const platformEmail = "mmkerp@gmail.com"

beforeAll(async () => {
  process.env.PLATFORM_ADMIN_SEED_EMAIL = platformEmail
  process.env.PLATFORM_ADMIN_SEED_PASSWORD = "Correct-horse-12"
  process.env.PLATFORM_ADMIN_SEED_NAME = "MMK Platform Administrator"
  const { spawnSync } = await import("node:child_process")
  const seeded = spawnSync("bun", ["src/db/seed.ts"], { cwd: process.cwd(), env: process.env, encoding: "utf8" })
  if (seeded.status !== 0 && !seeded.stderr.includes("already")) {
    throw new Error(seeded.stderr || seeded.stdout)
  }
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

function cookiesFrom(response: Response): string {
  const list = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : []
  return list.map((cookie) => cookie.split(";")[0]).join("; ")
}

async function platformLogin() {
  const response = await fetch(`${baseUrl}/v1/platform/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify({ email: platformEmail, password: "Correct-horse-12" }),
  })
  return cookiesFrom(response)
}

test("school admin can sign in only on the matching hostname", async () => {
  const actor = await findUserByEmail(getDb(), platformEmail)
  expect(actor).not.toBeNull()
  const created = await createSchool(
    actor!.id,
    {
      name: "Host School",
      schoolCode: "HOST-SCHOOL",
      website: "",
      email: "office@host.example",
      phone: "9840011100",
      schoolType: "k12",
      board: "",
      country: "India",
      state: "Tamil Nadu",
      city: "Chennai",
      postalCode: "600001",
      addressLine1: "1 School Road",
      addressLine2: "",
      billingModel: "per_student",
      perStudentRate: "10.00",
      billingFrequency: "monthly",
      subscriptionStart: "2026-04-01",
      subscriptionEnd: "2027-03-31",
      commercialNotes: "",
      description: "A school",
      adminName: "Host Admin",
      adminEmail: "host-admin@example.edu",
      adminPhone: "9840011101",
      adminPassword: "Host-password-12",
      adminPasswordConfirm: "Host-password-12",
    },
    { ipAddress: "127.0.0.1", userAgent: "test", correlationId: "school-test" },
  )

  const signup = await fetch(`${baseUrl}/v1/school/auth/signup`, { method: "POST" })
  expect(signup.status).toBe(404)

  const unknown = await fetch(`${baseUrl}/v1/school/tenant/context`, {
    headers: { "x-mmk-school-host": "missing-school.localhost:3001" },
  })
  expect(unknown.status).toBe(404)

  const login = await fetch(`${baseUrl}/v1/school/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://host-school.localhost:3001",
      "x-mmk-school-host": "host-school.localhost:3001",
    },
    body: JSON.stringify({ email: "host-admin@example.edu", password: "Host-password-12" }),
  })
  expect(login.status).toBe(200)
  const cookie = cookiesFrom(login)
  const me = await fetch(`${baseUrl}/v1/school/auth/me`, {
    headers: { cookie, "x-mmk-school-host": "host-school.localhost:3001" },
  })
  expect(me.status).toBe(200)

  const other = await fetch(`${baseUrl}/v1/school/auth/me`, {
    headers: { cookie, "x-mmk-school-host": "other-school.localhost:3001" },
  })
  expect(other.status).toBe(404)

  const wrongPassword = await fetch(`${baseUrl}/v1/school/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://host-school.localhost:3001",
      "x-mmk-school-host": "host-school.localhost:3001",
    },
    body: JSON.stringify({ email: "host-admin@example.edu", password: "not-the-password" }),
  })
  expect(wrongPassword.status).toBe(401)

  await getDb()
    .update(schoolAdminAccounts)
    .set({ status: "disabled" })
    .where(eq(schoolAdminAccounts.schoolId, created.id))
  const disabled = await fetch(`${baseUrl}/v1/school/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://host-school.localhost:3001",
      "x-mmk-school-host": "host-school.localhost:3001",
    },
    body: JSON.stringify({ email: "host-admin@example.edu", password: "Host-password-12" }),
  })
  expect(disabled.status).toBe(403)

  await getDb()
    .update(schoolAdminAccounts)
    .set({ status: "active" })
    .where(eq(schoolAdminAccounts.schoolId, created.id))
  const forgot = await fetch(`${baseUrl}/v1/school/auth/forgot-password`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://host-school.localhost:3001",
      "x-mmk-school-host": "host-school.localhost:3001",
    },
    body: JSON.stringify({ email: "nobody@example.edu" }),
  })
  expect(forgot.status).toBe(200)
  const resetRows = await getDb().select().from(schoolAdminPasswordResets)
  for (const row of resetRows) {
    expect(row.otpHash).not.toMatch(/^\d{6}$/)
  }
})

test("platform login cookie cannot be omitted from this file", async () => {
  const cookie = await platformLogin()
  expect(cookie.length).toBeGreaterThan(0)
})
