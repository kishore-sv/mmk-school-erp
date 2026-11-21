# MMK School ERP

Monorepo for the MMK School platform. Platform Admin can sign in and register schools. Other product workflows are not implemented yet.

Product UI conventions (Sonner toasts, lifecycle status chips): [docs/ui-conventions.md](docs/ui-conventions.md).

## Applications

| App | Path | Local command | Port |
| --- | --- | --- | --- |
| Platform Admin | `platform-admin` | `bun run dev:platform-admin` | 3000 |
| Landing website | `websites/landing` | `bun run dev:landing` | 3000 |
| School admin | `school-admin` | `bun run dev:school-admin` | 3001 |
| Teacher, student, and parent portal | `portal` | `bun run dev:portal` | 3002 |
| Public admissions site | `admission-portal` | `bun run dev:admission` | 3003 |
| API | `server` | `bun run dev:server` | 4000 |
| Worker | `worker` | `bun run dev:worker` | none |
| Mobile | `mobile` | `bun run dev:mobile` | Expo |

## Local infrastructure

Postgres, Redis, and MinIO bind to localhost. Data is stored under `~/DockerData/schoolerp/`.

```sh
bun run infra:up
bun run infra:logs
bun run infra:down
```

Copy `server/.env.example` to `server/.env`, `worker/.env.example` to `worker/.env`, and `platform-admin/.env.example` to `platform-admin/.env` before starting those apps. Set `PLATFORM_ADMIN_SEED_PASSWORD` only in the untracked server environment, then run `bun run db:migrate` and `bun run db:seed` inside `server/`. Do not commit `.env` files.

Platform Admin and the landing site both use port 3000. Run one of them at a time.

Platform Admin authentication, school registration, and the local database tables are documented in `docs/platform-admin/`.

The API health check is `GET http://127.0.0.1:4000/health`. Storage reports up only after the private bucket `mmk-erp-dev` exists in local MinIO. The API does not create that bucket.

See `docs/PROJECT_SETUP_REVIEW.md` for setup decisions and `docs/PRODUCTION_ARCHITECTURE.md` for planned production boundaries.


```
bun run infra:up
bun run infra:down
bun run dev:platform-admin  # 3000, do not run with the landing site
bun run dev:landing          # 3000
bun run dev:school-admin     # 3001
bun run dev:portal           # 3002
bun run dev:admission        # 3003
bun run dev:server           # 4000
bun run dev:worker
bun run dev:mobile
```