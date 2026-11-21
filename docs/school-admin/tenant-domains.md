# Tenant domains

The hostname is an input. It is not an authorization credential.

School codes are stored uppercase and may include hyphens, for example `HOST-SCHOOL`. The hostname label must match that code exactly, ignoring case. `HOST-SCHOOL` is served at `host-school.localhost:3001`, not `host.localhost:3001`.

## Local

- School Admin: `{school-code}.localhost:3001`
- Portal: `{school-code}.localhost:3002`

`localhost:3001` and `localhost:3002` have no school code and show the custom 404 page.

## Production

Configured with environment variables, not hardcoded in page components:

- `SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN=admin.mmkerp.tech` → `host-school.admin.mmkerp.tech`
- `SCHOOL_PORTAL_PRODUCTION_BASE_DOMAIN=mmkerp.tech` → `host-school.mmkerp.tech`

Unknown codes, malformed labels, and domains outside the configured bases show the same 404. The page does not say whether a school exists. Suspended or archived schools show an access-unavailable page without the school's private profile.

The 404 illustration is `illustrations/empty_state_generic_404_dark.svg`, copied into each app's `public/illustrations/` directory.
