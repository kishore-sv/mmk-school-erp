import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "School Admin",
  description: "MMK School Admin application shell.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
      )}
      style={{ colorScheme: "light" }}
    >
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
