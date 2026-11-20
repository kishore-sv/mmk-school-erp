"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  IconActivity,
  IconBuilding,
  IconChartBar,
  IconChevronRight,
  IconCreditCard,
  IconHeadset,
  IconLayoutDashboard,
  IconLogout,
  IconReceipt,
  IconSettings,
  IconShieldLock,
  IconSpeakerphone,
  IconUsers,
} from "@tabler/icons-react"

import { api } from "@/lib/api"
import type { PlatformUser } from "@/types/platform"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const groups = [
  {
    title: "Schools",
    icon: IconBuilding,
    items: [
      { title: "All Schools", href: "/schools" },
      { title: "Create School", href: "/schools/create" },
    ],
  },
  {
    title: "Subscriptions & Plans",
    icon: IconReceipt,
    items: [
      { title: "Plans", href: "/sections/plans" },
      { title: "Active Subscriptions", href: "/sections/subscriptions" },
    ],
  },
  {
    title: "Billing & Payments",
    icon: IconCreditCard,
    items: [
      { title: "Payments", href: "/sections/payments" },
      { title: "Invoices", href: "/sections/invoices" },
    ],
  },
  {
    title: "Support",
    icon: IconHeadset,
    items: [
      { title: "Support Tickets", href: "/sections/tickets" },
      { title: "Feature Requests", href: "/sections/requests" },
    ],
  },
  {
    title: "Monitoring",
    icon: IconActivity,
    items: [
      { title: "System Health", href: "/sections/health" },
      { title: "Queue Monitoring", href: "/sections/queues" },
    ],
  },
]

export function AppSidebar({ user }: { user: PlatformUser }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await api("/auth/logout", { method: "POST" })
    router.replace("/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
            >
              <img src="/logo/mmk-wordmark.svg" alt="MMK School ERP" className="h-6" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="text-muted-foreground px-2 text-xs group-data-[collapsible=icon]:hidden">
          Platform Admin
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard"}
                  render={<Link href="/dashboard" />}
                  tooltip="Dashboard"
                >
                  <IconLayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  defaultOpen={group.items.some((item) => pathname.startsWith(item.href))}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={<SidebarMenuButton tooltip={group.title} />}
                    >
                      <group.icon />
                      <span>{group.title}</span>
                      <IconChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton
                              isActive={pathname === item.href}
                              render={<Link href={item.href} />}
                            >
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { title: "Usage & Limits", href: "/sections/usage", icon: IconChartBar },
                { title: "Announcements", href: "/sections/announcements", icon: IconSpeakerphone },
                { title: "Analytics", href: "/sections/analytics", icon: IconChartBar },
                { title: "Audit Logs & Security", href: "/sections/audit", icon: IconShieldLock },
                { title: "Platform Users", href: "/sections/users", icon: IconUsers },
                { title: "Settings", href: "/sections/settings", icon: IconSettings },
              ].map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" />
                }
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem onClick={() => void signOut()}>
                  <IconLogout />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
