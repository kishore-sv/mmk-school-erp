import { RecoveryForm } from "@/features/auth/recovery-form"

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center p-6">
      <RecoveryForm />
    </main>
  )
}
