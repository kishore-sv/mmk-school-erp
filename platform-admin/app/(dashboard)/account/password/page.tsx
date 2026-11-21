import { PageHeader } from "@/components/page-header"
import { PasswordForm } from "@/features/auth/password-form"
import { serverApi } from "@/lib/server-api"
import type { PlatformUser } from "@/types/platform"

export default async function PasswordPage() {
  const { user } = await serverApi<{ user: PlatformUser }>("/auth/me")
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Change password"
        description={
          user.mustChangePassword
            ? "The initial password must be replaced before the rest of Platform Admin is available."
            : "Replace the password for this platform administrator account."
        }
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Change password" },
        ]}
      />
      <PasswordForm />
    </div>
  )
}
