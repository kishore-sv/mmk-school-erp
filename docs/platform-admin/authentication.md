# Platform Admin authentication

There is no signup page and no signup API.

## Endpoints

- `POST /v1/platform/auth/login`
- `POST /v1/platform/auth/refresh`
- `POST /v1/platform/auth/logout`
- `GET /v1/platform/auth/me`
- `POST /v1/platform/auth/change-password`

Login and refresh require an `Origin` listed in `CORS_ORIGINS`. Refresh, logout, password change, and school mutations also require the `x-csrf-token` header to match the `mmk_platform_csrf` cookie. Login does not require that header because the cookie does not exist yet.

Unknown email, wrong password, and disabled accounts return the same message: "The email or password is incorrect." Five failures for the same email and IP within 15 minutes return HTTP 429.

## Cookies

| Cookie | HttpOnly | Lifetime |
| --- | --- | --- |
| `mmk_platform_access` | yes | 15 minutes |
| `mmk_platform_refresh` | yes | 7 days |
| `mmk_platform_csrf` | no | 7 days |

`SameSite=Lax`. `Secure` is added when `NODE_ENV=production`. Tokens are not written to `localStorage` or `sessionStorage`.

The access token is an HMAC-SHA256 JWT signed with `PLATFORM_ACCESS_TOKEN_SECRET`. It carries the administrator id, session id, token-family id, and whether a password change is required. The refresh token is random. Only its HMAC-SHA256 hash is stored.

Refresh rotates the refresh token inside the same family. Presenting a revoked token revokes the rest of that family. Logout revokes the session even when the access token has expired, as long as the refresh cookie and CSRF header are valid.

Passwords are hashed with Argon2id through `Bun.password.hash` (`memoryCost` 19456, `timeCost` 2). A password must be 12 to 128 characters and include a letter and a number. The last five hashes are kept in `platform_admin_password_history`. Changing the password revokes existing sessions and issues a new one.

The seeded account has `must_change_password = true`. School and dashboard APIs return HTTP 403 `PASSWORD_CHANGE_REQUIRED` until it is changed. The middleware sends that session to `/account/password`.

## Seed

```env
PLATFORM_ADMIN_SEED_EMAIL=mmkerp@gmail.com
PLATFORM_ADMIN_SEED_PASSWORD=
PLATFORM_ADMIN_SEED_NAME=MMK Platform Administrator
```

`bun --cwd server run db:seed` refuses to run without the email and password. In production it also requires `PLATFORM_ADMIN_SEED_CONFIRM=yes`. The script does not print the password or hash. If the email already belongs to an active administrator, it leaves the password unchanged. If that account is disabled or archived, the script fails.

## MFA

Multi-factor authentication is a required future control. It is not implemented, and login does not claim that a second factor was checked.

Password recovery email is not implemented. The login page has no recovery link.
