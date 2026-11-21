"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IconChevronRight, IconLogout, IconKey, IconUser } from "@tabler/icons-react"

import { api } from "@/lib/api"
import { navigation } from "@/lib/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SessionUser = { name: string; email: string; schoolName: string }

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    void api<{ user: { name: string; email: string; schoolName: string } }>("/auth/me")
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
    void api<{ school: { name: string; logoUrl: string | null } }>("/profile")
      .then((result) => {
        setUser((current) => current ?? { name: "School Admin", email: "", schoolName: result.school.name })
        setLogoUrl(result.school.logoUrl)
      })
      .catch(() => undefined)
  }, [])

  async function signOut() {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined)
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="" className="size-8 rounded-md object-cover" />
              ) : (
                <div className="bg-muted flex size-8 items-center justify-center rounded-md text-xs font-medium">SA</div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.schoolName ?? "School Admin"}</span>
                <span className="truncate text-xs text-muted-foreground">School Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((section) => {
                const open = pathname === section.href || pathname.startsWith(`${section.href}/`)
                const Icon = section.icon
                if (section.items.length === 0) {
                  return (
                    <SidebarMenuItem key={section.href}>
                      <SidebarMenuButton isActive={open} tooltip={section.title} render={<Link href={section.href} />}>
                        <Icon />
                        <span>{section.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }
                return (
                  <Collapsible key={section.href} defaultOpen={open} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        render={<SidebarMenuButton tooltip={section.title} isActive={open} />}
                      >
                        <Icon />
                        <span>{section.title}</span>
                        <IconChevronRight className="ml-auto transition-transform group-data-[open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton isActive={pathname === section.href} render={<Link href={section.href} />}>
                              <span>Overview</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {section.items.map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton isActive={pathname === item.href} render={<Link href={item.href} />}>
                                <span>{item.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
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
                  <SidebarMenuButton size="lg">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name ?? "Administrator"}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</span>
                    </div>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem render={<Link href="/school-setup/profile" />}>
                  <IconUser />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/password" />}>
                  <IconKey />
                  Change password
                </DropdownMenuItem>
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
