"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IconLayoutRows, IconHome } from "@tabler/icons-react"

const data = {
  user: {
    name: "Not signed in",
    email: "No account session",
    avatar: "",
  },
  teams: [
    {
      name: "School Admin",
      logo: <IconLayoutRows />,
      plan: "Shell",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: <IconHome />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Placeholder",
      url: "/dashboard",
      icon: <IconHome />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
