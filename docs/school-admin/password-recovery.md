# Password recovery

Routes: `/forgot-password` and `/reset-password`.

1. The administrator enters an email. The school comes from the hostname. The API returns the same message whether or not the account exists.
2. A six-digit code is generated with `crypto.randomInt`, stored only as an HMAC-SHA256 hash, and expires after `OTP_TTL_SECONDS` (default 300). A new code consumes older unused codes.
3. Verification allows `OTP_MAX_ATTEMPTS` (default 5). Success sets an HttpOnly reset cookie for 10 minutes. The code cannot be reused.
4. The new password and confirmation are saved, the reset record is consumed, and existing sessions are revoked.

Resend is refused server-side for 60 seconds and for more than five codes an hour. The public response stays neutral except for IP rate limits.

The email job uses critical priority. The HTTP handler does not print the code. In development the worker may print `development-only password reset code`. Production does not add the code to the job payload.
