import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbProvider, HeaderCrumbs } from "@/components/page-crumbs"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { serverApi } from "@/lib/server-api"
import type { PlatformUser } from "@/types/platform"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await serverApi<{ user: PlatformUser }>("/auth/me")
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <BreadcrumbProvider>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 h-4! w-px! shrink-0 self-center! bg-border"
            />
            <HeaderCrumbs />
          </header>
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
        </BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
