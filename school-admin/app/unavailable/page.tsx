export default function UnavailablePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">This school account is not available</h1>
      <p className="text-sm text-muted-foreground">Sign-in is not available for this address. Contact the platform administrator if you need access.</p>
    </main>
  )
}
