"use client"

import Link from "next/link"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { MmkLogo } from "@/components/brand/mmk-logo"
import { buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { isMenu, mainNavigation } from "@/config/navigation"
import { cn } from "cn"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link aria-label="MMK School ERP home" href="/">
          <MmkLogo />
        </Link>
        <nav aria-label="Primary" className="ml-auto hidden xl:block">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavigation.map((item) =>
                isMenu(item) ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[min(42rem,calc(100vw-2rem))] p-3">
                      <ul className="grid gap-1 sm:grid-cols-2">
                        <li className="sm:col-span-2">
                          <NavigationMenuLink href={item.href}>All {item.label}</NavigationMenuLink>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink href={child.href}>{child.label}</NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink className="h-9 px-2.5" href={item.href}>
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <Link className={cn(buttonVariants({ size: "sm" }), "ml-auto hidden sm:inline-flex xl:ml-2")} href="/book-demo">
          Book a Demo
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "xl:hidden")}
            aria-label="Open menu"
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,22rem)] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-2 px-4 pb-8">
              {mainNavigation.map((item) =>
                isMenu(item) ? (
                  <details key={item.label} className="border-b border-border py-2">
                    <summary className="cursor-pointer text-sm font-medium">{item.label}</summary>
                    <div className="mt-2 flex flex-col gap-1 pl-2">
                      <Link className="py-1 text-sm" href={item.href} onClick={() => setOpen(false)}>
                        Overview
                      </Link>
                      {item.children.map((child) => (
                        <Link className="py-1 text-sm text-muted-foreground" href={child.href} key={child.href} onClick={() => setOpen(false)}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link className="border-b border-border py-2 text-sm font-medium" href={item.href} key={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                )
              )}
              <Link className={cn(buttonVariants(), "mt-3")} href="/book-demo" onClick={() => setOpen(false)}>
                Book a Demo
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
