# Platform Admin API

All routes are under `/v1/platform`. Authenticated routes read the access-token cookie. They do not accept a role from the browser. The only role is `platform_admin`.

Errors use `{ error: { code, message, requestId, details } }`. Validation details list field paths. Database errors and stack traces are not returned.

## Authentication

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/auth/login` | Origin |
| POST | `/auth/refresh` | Origin, CSRF |
| POST | `/auth/logout` | Origin, CSRF |
| GET | `/auth/me` | Session |
| POST | `/auth/change-password` | Session, origin, CSRF |

## Schools

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/schools` | `q`, `status`, `subscriptionStatus`, `createdFrom`, `createdTo`, `page`, `pageSize` |
| POST | `/schools` | Optional `Idempotency-Key` |
| GET | `/schools/:id` | Identity, commercial terms, invitation state, usage, audit |
| PATCH | `/schools/:id` | School code cannot change |
| POST | `/schools/:id/lifecycle-verification/request` | `{ "action": "suspend" \| "archive" }` — emails OTP |
| POST | `/schools/:id/lifecycle-verification/verify` | `{ "action", "code" }` → `verificationToken` |
| POST | `/schools/:id/suspend` | `reason?`, `verificationToken` (required) |
| POST | `/schools/:id/activate` | Optional `reason` (no OTP) |
| POST | `/schools/:id/archive` | `reason?`, `verificationToken` (required) |

School and dashboard routes also reject a session that still has `mustChangePassword`.

## Dashboard

`GET /dashboard` returns school counts, recent schools, recent audit actions, and health for PostgreSQL and object storage. Student counts, teacher counts, and outstanding payments are `null` with `available: false`. The queue status is `not_configured`.

List responses include `studentCount: null` until a reliable aggregate exists.
