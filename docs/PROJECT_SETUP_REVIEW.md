# Project setup review

This report records the inspection and the initial monorepo setup. It does not add product behavior.

## Documents inspected

Existing product documents were left in place and were not renamed or edited.

- `docs/MMK_School_Development_Handoff_Pack_v1.0.pdf`
- `docs/MMK_School_Complete_Product_Design_Blueprint_v1.0.pdf`
- `docs/MMK_School_Product_Proposal.pdf`
- `docs/MMK_School_Platform_Admin_Web_Portal_Specification.pdf`
- `docs/MMK_School_UI_UX_Design_System_Specification.pdf`
- `docs/MMK_School_UI_UX_Design_System_Specification_v1.1_Addendum.pdf`
- `docs/MMK_School_API_and_Workflow_Contracts_v1.0.md`
- `docs/MMK_School_Logical_ERD_and_Data_Dictionary_v1.0.md`
- `docs/MMK School — Academic & School Structure Specification.md`

The handoff pack is the stack baseline used for this setup: platform admin, school admin, one teacher/student/parent web portal, a public admissions site, one mobile app, PostgreSQL with Drizzle, private object storage, and a separate worker. The logical ERD was not converted into tables.

## Illustrations

`illustrations/` contains existing SVG and PNG assets, including age-level PNGs, a sign-in illustration, empty-state artwork, and `MMK SCHOOL ERP YT Thumbnails.png`. The landing site also has its own files under `websites/landing/public/illustrations/`. None of these assets were moved or deleted. They are not wired into the new application shells.

## Existing application

`websites/landing/` was already a Next.js App Router site. It was not moved or replaced. It still uses `lucide-react` alongside Tabler. New web apps do not import it, and it does not import them.

## Agreed technical stack

- Package manager: Bun 1.3.3
- Web: Next.js, TypeScript, Tailwind CSS, shadcn preset `b1YmqwEoy` (`base-nova`, Tabler icons, Base UI)
- API: Express 5 on Bun, Zod for environment parsing, Drizzle ORM and drizzle-kit
- Database: PostgreSQL 16
- Worker: Bun, with `Bun.RedisClient`. No queue library is installed
- Storage: an S3-compatible interface with MinIO, S3, R2, and Supabase provider names
- Mobile: Expo SDK 58, React Native, TypeScript, gluestack-ui core, NativeWind 5, Reanimated, Lottie, Tabler icons, React Navigation

## Folder structure created

`platform-admin/`, `school-admin/`, `portal/`, `admission-portal/`, `server/`, `worker/`, `mobile/`, `infrastructure/docker/`, `infrastructure/storage/`, and `scripts/` sit beside the existing `docs/`, `illustrations/`, and `websites/landing/`. Root files include `package.json`, `docker-compose.yml`, `.env.example`, `.gitignore`, `.dockerignore`, and this report.

There is no shared UI package. Each client has its own `package.json`.

## Configuration decisions

- Platform Admin, school admin, portal, and admission portal use preset `b1YmqwEoy`. Platform Admin and the landing site both use port 3000, so they cannot run together. The other web apps use 3001, 3002, and 3003.
- Platform Admin authenticates against `POST /v1/platform/auth/login` and can register schools. School admin and portal login screens remain visual shells.
- The API exposes `GET /health` and the Platform Admin routes under `/v1/platform`. Upload, presign, and multipart methods exist on the storage interface and throw until a later task implements them.
- Drizzle is configured at `server/drizzle.config.ts`. Platform tables live in `server/src/db/schema/platform.ts`. Migrations run with `bun run db:migrate` inside `server/`, using the Bun SQL migrator.
- Local Compose service names are `schoolerp_postgres`, `schoolerp_redis`, and `schoolerp_minio`. Host data lives in `~/DockerData/schoolerp/`. Postgres user and database are `schoolerp`. Ports are bound to `127.0.0.1` only: 5432, 6379, 9000, and 9001.
- MinIO is pinned to the image already present on this machine, tagged `minio/minio:RELEASE.2025-09-07T16-13-09Z`, with `pull_policy: if_not_present`. That image is not a security-supported release and must not be used in production.
- `server/.env` and `worker/.env` were created locally from the examples. Both match `.gitignore`.

## Conflicts and unresolved questions

- The setup brief named containers, the database, and `~/DockerData/erp`. Those container names were already taken on this machine. Local names use `schoolerp` instead. `.env.example` and `server/.env.example` use the same database user, name, and password.
- The landing site still depends on `lucide-react`. New web apps use `@tabler/icons-react` only. Landing was intentionally left unchanged.
- The handoff pack describes queued jobs. BullMQ was not added. The worker connects to Redis, logs readiness, and registers no jobs.
- `bunx gluestack-ui@latest init` failed while cloning its template repository (`RPC failed; curl 56`). NativeWind, the theme CSS, Reanimated, Lottie, Tabler, React Navigation, and a provider shell were added directly. Copy-paste gluestack components were not generated.
- A line-by-line comparison of the UI specification against its v1.1 addendum was not completed. Both files remain the source of truth for later UI work.
- The storage health check needs the private bucket `mmk-erp-dev`. The API does not create it. It was created once in local MinIO with the MinIO client.

## Commands used

```sh
bun run infra:up
bun run infra:down
bun run dev:landing
bun run dev:school-admin
bun run dev:portal
bun run dev:admission
bun run dev:server
bun run dev:worker
bun run dev:mobile
```

Inside `server/` and `worker/`: `bun run typecheck` and `bun run lint`.

Inside each Next.js app: `bun run typecheck`.

Inside `server/`: `bunx drizzle-kit generate`.

Inside `mobile/`: `bun run typecheck`.

## Validation recorded on 20 November 2026

| Check | Result |
| --- | --- |
| Each app has its own `package.json` | Passed |
| `school-admin`, `portal`, `admission-portal` typecheck | Passed |
| Landing typecheck via `bunx tsc --noEmit` | Passed. Landing has no `typecheck` script |
| Server typecheck and lint | Passed |
| `GET /health` | `200` with postgres and storage up, after the local bucket existed. Before the bucket, storage was `down` and the status was `503` |
| Postgres | Healthy. `pg_isready` accepts connections for user `schoolerp` |
| Redis | `PONG`. Worker logged `redis: up` |
| MinIO | Healthy. `http://127.0.0.1:9000/minio/health/live` and `http://127.0.0.1:9001/` returned 200 |
| Volumes | `~/DockerData/schoolerp/{postgres,redis,minio}` |
| Drizzle | Config loads. 0 tables, nothing to migrate |
| Mobile typecheck | Passed |
| Tabler in the three new web apps | `components.json` sets `"iconLibrary": "tabler"`. No `lucide-react` dependency there |
| Cross-client UI imports | None found |
| Environment examples | Local defaults only. No production secrets |
| Next.js production builds | Not run |
| Expo on a simulator | Not run |

## Deliberately not implemented

School Admin, teacher, student, parent, and mobile authentication are not implemented. There is no public signup. Platform Admin MFA, separate tenant databases, billing, support, announcements, and queued invitation email are not implemented. See `docs/platform-admin/implementation-status.md`.
