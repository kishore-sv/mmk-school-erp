import Link from "next/link"
import { PageContainer } from "@/components/marketing/page-shell"

export default function NotFound() {
  return (
    <PageContainer className="py-24">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">That address is not part of the MMK School ERP website.</p>
      <Link className="mt-6 inline-block text-sm underline" href="/">Back to home</Link>
    </PageContainer>
  )
}
