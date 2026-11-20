# Platform Admin

Platform Admin is the private application used by the MMK platform owner and operators. It is a separate Next.js app in `platform-admin/` and does not share UI code with School Admin.

It runs on port 3000:

```sh
bun run dev:platform-admin
```

The landing site also uses port 3000. Stop one before starting the other.

Local API:

```sh
bun --cwd server run dev
```

Before the first sign-in, apply migrations and seed the administrator from the untracked server environment:

```sh
bun --cwd server run db:migrate
bun --cwd server run db:seed
```

The seed password is read from `PLATFORM_ADMIN_SEED_PASSWORD`. It is not stored in Git. A later seed run does not replace an existing password.

Tests:

```sh
bun --cwd server test src/features/platform/platform.test.ts
```

The automated tests were run against the local `schoolerp` database on 20 November 2026: 12 passed.
