# Email and worker

`EmailProvider.send` is implemented by `ConsoleEmailProvider` and `AmazonSesEmailProvider`. `EMAIL_PROVIDER=console` logs a preview and reports `delivered: false`. The job status is `previewed`, not `sent`. `EMAIL_PROVIDER=ses` is a stub and fails until SES is configured. The failure does not roll back a school that was already created.

Jobs are stored in `email_jobs` and queued in Redis under `mmk:email:ready`. The score is the priority rank plus the available time, so critical jobs run before high, normal, and low jobs. The worker uses Bun's Redis client. BullMQ was not added; the previous worker only pinged Redis and had no queue library.

Priorities:

1. `critical` — password reset and platform lifecycle verification
2. `high` — school welcome email
3. `normal` — reserved for later school notifications
4. `low` — reserved for non-urgent mail

Failed jobs retry with exponential backoff, then move to `mmk:email:dead`. Idempotency keys prevent a duplicate welcome email for the same school. The worker updates `invitation_delivery` to `previewed`, `sent`, or `failed`.

Welcome email includes the school name, school code, administrator email, login URL, and support contact. It does not include a password.

Local commands:

```bash
bun run infra:up
bun --cwd server run db:migrate
bun run dev:server
bun run dev:worker
```
