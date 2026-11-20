# School provisioning

`POST /v1/platform/schools` creates, in one database transaction:

1. A tenant whose key is the school code.
2. The school row, marked `provisioning_status = ready`.
3. The commercial terms, with the rate supplied by the administrator.
4. The initial school administrator in `pending_invitation`, without a password.
5. An idempotency record when `Idempotency-Key` is sent.
6. A `school.created` audit row.

A unique school code returns HTTP 409. A repeated idempotency key with the same body returns the existing school. A different body for the same key returns HTTP 409. If the transaction fails, none of the rows remain.

The school administrator invitation is stored with `invitation_delivery = not_configured`. The API does not send email. The worker does not register an invitation job yet.

## Not provisioned

No separate database, schema, or role is created for the tenant. No school data is copied into a tenant schema. That decision is unresolved and must be made before student records are stored. Platform Admin must not query individual academic records.

Editing, suspending, activating, and archiving write audit rows. An archived school cannot be edited. Activate is allowed only from `suspended`. Suspend is allowed only from `active`.
