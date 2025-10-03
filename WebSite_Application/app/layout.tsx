import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ConditionalSidebarProvider } from '@/components/conditional-sidebar-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Space Hunters',
  description: 'NASA Space Biology Explorer by Space Hunters',
  generator: 'Space Hunters',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased text-white selection:bg-purple-500/30 selection:text-white font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ConditionalSidebarProvider>
          {children}
        </ConditionalSidebarProvider>
      </body>
    </html>
  )
}
