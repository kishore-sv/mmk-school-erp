# Platform Admin architecture

`platform-admin/` is an independent Next.js App Router application. It uses the shadcn preset `b1YmqwEoy`, Tailwind CSS 4.3.3, and Tabler icons. It does not import components from `school-admin/`, `portal/`, or `admission-portal/`.

The browser calls `/api/v1/*`. Next.js rewrites that path to the Express API (`API_PROXY_TARGET`, default `http://127.0.0.1:4000`). Authentication cookies are set by the API and stored for the Platform Admin origin.

`middleware.ts` verifies the access-token cookie on the server. A missing or invalid access token is refreshed once when a refresh cookie and CSRF cookie are present. Failure clears the session cookies and redirects to `/login`. An authenticated visit to `/login` goes to `/dashboard`, or to `/account/password` when the initial password still has to be changed.

Protected pages load data in server components through `lib/server-api.ts`. Forms and lifecycle actions use the browser client in `lib/api.ts`.

The Express feature lives in `server/src/features/platform/`. Route handlers validate input and call services. Services own transactions and audit writes. Repositories own Drizzle queries.

## Tenant boundary

A school is a tenant row plus a school row in the same PostgreSQL database. Platform administrator accounts stay in `platform_admin_users`. The first school administrator is stored in `school_admin_accounts` and cannot sign in yet.

Separate physical databases or schemas per school are not provisioned. Row-level security is not enabled. Platform Admin reads school identity, commercial terms, provisioning state, and aggregate counts. Student and teacher totals are returned as unavailable because those records do not exist yet.

## Reference implementation

The external repository `kishore-sv/erp` was not readable (HTTP 404) while this milestone was built. The structure follows the MMK brief and the local architecture documents.
