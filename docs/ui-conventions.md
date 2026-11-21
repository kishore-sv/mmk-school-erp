# UI conventions (MMK web apps)

Applies to **platform-admin**, **school-admin**, **portal**, **admission-portal**, and future product surfaces. The marketing **landing** site follows the same toast and status-chip rules where relevant.

## Toasts

- Use **[Sonner](https://sonner.emilkowal.ski/)** only (`import { toast } from "sonner"`).
- Mount `<Toaster richColors closeButton position="top-right" theme="light" />` once in the app root layout (via `@/components/ui/sonner`).
- Do not add custom toast managers or Base UI toast stacks for product apps.

```tsx
import { toast } from "sonner"

toast.success("Saved")
toast.error("Not saved", { description: "Reason here" })
```

## Lifecycle status chips

School lifecycle and the same literal statuses elsewhere use **`StatusBadge`** from `@/components/status-badge`. Do not hand-pick `Badge` variants for these values.

| Normalized status | Color (Tailwind) | Use for |
| --- | --- | --- |
| `active` | `green-500` | Live / enabled |
| `suspended`, `suspend` | `yellow-500` | Temporarily disabled |
| `archived`, `archive` | `red-500` | Ended / removed |

Any other label (e.g. `scheduled`, `ended`, provisioning states) uses **`Badge variant="secondary"`** or **`outline`** via `StatusBadge` fallback — not primary/destructive unless it is a separate UX meaning (actions, not status).

```tsx
import { StatusBadge } from "@/components/status-badge"

<StatusBadge value={school.status} />
<StatusBadge value={school.subscriptionStatus} />
```

When adding new screens, reuse `StatusBadge` for any column or field that shows active / suspended / archived semantics.

## Sensitive school lifecycle actions

Suspending or archiving a school requires **email OTP** for the signed-in platform administrator:

1. `POST .../lifecycle-verification/request` with `{ action }`
2. `POST .../lifecycle-verification/verify` with `{ action, code }` → `verificationToken`
3. `POST .../suspend` or `.../archive` with `{ verificationToken, reason? }`

**Activate** does not require OTP. OTP jobs are queued in `email_jobs` (`platform_admin_lifecycle_otp`). In non-production environments the server log may include `devOtp` when delivery is not configured.