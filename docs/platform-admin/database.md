# Platform Admin database

PostgreSQL and Drizzle. The migration is `server/src/db/migrations/0000_platform_admin_and_schools.sql`. Apply it with:

```sh
bun --cwd server run db:migrate
```

`db:migrate` uses `drizzle-orm/bun-sql/migrator`. `drizzle-kit migrate` is not used because it expects a different driver.

## Tables

- `platform_admin_users` — email, Argon2id hash, name, status (`active`, `disabled`), `must_change_password`, last login, archive time.
- `platform_admin_sessions` — hashed refresh token, token family, user agent, IP, expiry, revocation.
- `platform_admin_password_history` — previous hashes.
- `platform_admin_login_attempts` — failed sign-in counters.
- `platform_admin_audit_logs` — append-only action records. The application only inserts. Passwords, hashes, tokens, and recovery secrets are removed from audit payloads.
- `tenants` — `tenant_key` and status.
- `schools` — identity, contact, address, status, provisioning status. `school_code` is unique on its own and unique with `tenant_id`.
- `school_commercial_terms` — negotiated rate, frequency, dates, student limit, notes, derived status.
- `school_admin_accounts` — initial school administrator. Status starts at `pending_invitation`.
- `platform_idempotency_keys` — one stored response key per administrator and `Idempotency-Key`.

School status is `active`, `suspended`, or `archived`. There is no delete API. Archiving sets the school and tenant to `archived` and keeps the rows.

Commercial status is `scheduled`, `active`, or `ended`, based on the subscription dates and the current UTC date.

## Environment

`PLATFORM_ACCESS_TOKEN_SECRET` is required at API startup and must be at least 32 characters. Seed variables are read only by `src/db/seed.ts`.

The test suite truncates these tables in the configured `POSTGRES_URL`. It does not create a separate test database. Run it only against the local development database.
