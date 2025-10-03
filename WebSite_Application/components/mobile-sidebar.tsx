"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Heart, Brain, Database, Home } from "lucide-react"
import { AppLogo } from "./app-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "./ui/sidebar"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home
  },
  {
    title: "Publications",
    href: "/publications",
    icon: FileText
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart
  },
  {
    title: "Knowledge Gaps",
    href: "/knowledge-gaps",
    icon: Brain
  },
  {
    title: "Data Integrations",
    href: "/data-integrations",
    icon: Database
  }
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    // Close the sidebar when a link is clicked
    setOpenMobile(false)
  }

  return (
    <Sidebar 
      collapsible="offcanvas"
      className="bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] border-white/10"
    >
      <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e]">
        <SidebarHeader className="p-6 border-b border-white/10">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="p-4 flex-1">
          <SidebarMenu className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/15 data-[active=true]:text-white transition-colors"
                  >
                    <Link href={item.href} onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </div>
    </Sidebar>
  )
}
