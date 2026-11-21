# School Admin implementation status

Completed in this milestone:

- Tenant hostname parsing for School Admin and the portal, including the custom 404 illustration.
- School Admin login, refresh, logout, current user, forced password change, and CSRF cookies.
- Password recovery with hashed email OTPs, resend limits, and session revocation.
- Redis priority queue and worker email processing with a console provider. SES is stubbed.
- Welcome email after school creation, without the password.
- Platform Admin initial password, logo, and banner upload.
- School Admin profile edit and branding upload for its own school.
- Sidebar and routes for the 17 School Admin sections. Module data entry is deferred.
- Server tests: 22 passed when `bun test --max-concurrency 1` was run from `server/` on 21 November 2026. That count includes the existing Platform Admin tests.

Not implemented:

- School Admin multi-factor authentication.
- Amazon SES delivery. Console previews are not counted as delivered.
- Portal, teacher, student, parent, and admissions sign-in.
- Public signup.
- ERP module behavior: students, fees, attendance, exams, and the rest of the section pages.
- A separate database per school.
- Multipart upload was implemented in the storage provider and was not exercised against MinIO in the automated run.
- Firebase push notifications.

## Commands

```bash
bun run infra:up
bun --cwd server run db:migrate
bun --cwd server run db:seed
bun run dev:server
bun run dev:worker
bun run dev:platform-admin
bun run dev:school-admin
bun --cwd server test --max-concurrency 1
```

Open School Admin at `http://{school-code}.localhost:3001/login`. The label must match the stored school code, ignoring case.
