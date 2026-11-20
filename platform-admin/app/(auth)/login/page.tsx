import { LoginForm } from "@/features/auth/login-form"

export default function LoginPage() {
  return (
    <main className="bg-muted flex min-h-svh items-center justify-center p-6">
      <div className="bg-background w-full max-w-md rounded-xl border p-8">
        <img src="/logo/mmk-wordmark.svg" alt="MMK School ERP" className="h-8" />
        <p className="text-muted-foreground mt-4 text-sm">Platform Admin</p>
        <h1 className="mt-1 text-2xl font-semibold">Sign in</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This application is for MMK platform administrators. Accounts are issued by the platform owner.
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
