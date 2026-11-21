# School Admin architecture

School Admin is the Next.js application in `school-admin/` on port 3001. It is separate from Platform Admin, the portal, and the admissions site. UI components are not shared.

The Express API mounts School Admin routes at `/v1/school`. Sessions use `mmk_school_access`, `mmk_school_refresh`, and `mmk_school_csrf`. They are signed with `SCHOOL_ACCESS_TOKEN_SECRET` and are not interchangeable with Platform Admin cookies.

The browser calls `/api/v1/school/*` on the school hostname. Next.js rewrites that path to the API and the School Admin middleware sets `x-mmk-school-host` from the real `Host` header. The API resolves the school from that hostname and checks that the signed-in administrator belongs to that school.

School rows stay in the shared PostgreSQL database created by Platform Admin. This milestone does not add a database per school.

Multi-factor authentication is required by the product direction and is **not implemented**. Login does not claim that a second factor was checked.
