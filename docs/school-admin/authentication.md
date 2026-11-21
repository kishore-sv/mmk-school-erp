# School Admin authentication

There is no signup page and no signup API.

## Endpoints

- `POST /v1/school/auth/login`
- `POST /v1/school/auth/logout`
- `POST /v1/school/auth/refresh`
- `GET /v1/school/auth/me`
- `POST /v1/school/auth/change-password`
- `GET /v1/school/tenant/context`

Login resolves the school from `x-mmk-school-host` or `Host`, requires the school to be active, and accepts only an active administrator of that school. Unknown email, wrong password, and a pending invitation return "The email or password is incorrect." A disabled account returns a disabled-account response. Five failures for the same school, email, and IP within 15 minutes return HTTP 429.

Cookies are `HttpOnly` except the CSRF cookie. `Secure` is set in production. Tokens are not written to `localStorage` or `sessionStorage`.

The access token lasts 15 minutes and includes the administrator, session, school, and tenant. The refresh token is random; only its HMAC-SHA256 hash is stored. Refresh rotates the token. Reuse of a revoked token revokes the token family.

Passwords use the same Argon2id policy as Platform Admin: 12 to 128 characters with a letter and a number. The last five hashes are kept. Changing or resetting a password revokes existing sessions.

When Platform Admin sets an initial password, `must_change_password` is true. School profile and module APIs return HTTP 403 until it is changed. The middleware sends that session to `/account/password`.

## MFA

Multi-factor authentication is not implemented in this milestone.
