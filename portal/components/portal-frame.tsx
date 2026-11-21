import type { ReactNode } from "react"

import { AppCrumbs } from "@/components/app-crumbs"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function PortalFrame({
  sidebar,
  title,
  description,
}: {
  sidebar: ReactNode
  title: string
  description: string
}) {
  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4! w-px! shrink-0 self-center! bg-border"
            />
            <AppCrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}