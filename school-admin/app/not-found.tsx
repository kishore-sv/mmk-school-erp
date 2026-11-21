import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
      <Image src="/illustrations/empty_state_generic_404_dark.svg" alt="" width={280} height={180} />
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">That page is not part of School Admin.</p>
      <Button nativeButton={false} render={<Link href="/dashboard" />}>Back to dashboard</Button>
    </main>
  )
}
