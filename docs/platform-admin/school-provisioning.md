# School provisioning

`POST /v1/platform/schools` creates, in one database transaction:

1. A tenant whose key is the school code.
2. The school row, marked `provisioning_status = ready`.
3. The commercial terms, with the rate supplied by the administrator.
4. The initial school administrator. If an initial password is supplied it is hashed with Argon2id, the account is `active`, and a password change is required on first sign-in. The password is not stored in the audit row and is not emailed. Without a password the account stays `pending_invitation`.
5. An idempotency record when `Idempotency-Key` is sent.
6. A `school.created` audit row.

A unique school code returns HTTP 409. A repeated idempotency key with the same body returns the existing school. A different body for the same key returns HTTP 409. If the transaction fails, none of the rows remain.

After the school transaction commits, the API enqueues a welcome email. A failed email job does not roll back the school. The welcome message contains the school name, school code, administrator email, and login URL. It does not contain the password. See `docs/school-admin/email-and-worker.md`.

## Not provisioned

No separate database, schema, or role is created for the tenant. No school data is copied into a tenant schema. That decision is unresolved and must be made before student records are stored. Platform Admin must not query individual academic records.

Editing, suspending, activating, and archiving write audit rows. An archived school cannot be edited. Activate is allowed only from `suspended`. Suspend is allowed only from `active`.
