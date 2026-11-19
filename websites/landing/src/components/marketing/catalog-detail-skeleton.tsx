import { PageContainer } from "@/components/marketing/page-shell"
import { Skeleton } from "@/components/ui/skeleton"

export function CatalogDetailSkeleton() {
  return (
    <PageContainer className="py-10" aria-busy="true" aria-live="polite">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-4 w-24" />
      <Skeleton className="mt-2 h-10 w-2/3" />
      <Skeleton className="mt-4 h-20 w-full max-w-3xl" />
    </PageContainer>
  )
}