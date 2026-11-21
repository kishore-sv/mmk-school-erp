import Image from "next/image"

export default function HostNotFoundPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
      <Image src="/illustrations/empty_state_generic_404_dark.svg" alt="" width={280} height={180} priority />
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">This address is not a school portal.</p>
    </main>
  )
}
