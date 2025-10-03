"use client"

import { ReactNode } from "react"
import { SidebarProvider } from "./ui/sidebar"
import { MobileSidebar } from "./mobile-sidebar"

interface ConditionalSidebarProviderProps {
  children: ReactNode
}

export function ConditionalSidebarProvider({ children }: ConditionalSidebarProviderProps) {
  return (
    <SidebarProvider>
      <MobileSidebar />
      <main className="w-full min-h-screen">
        {children}
      </main>
    </SidebarProvider>
  )
}
