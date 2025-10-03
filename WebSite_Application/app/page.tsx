import { Search } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { AIChat } from "@/components/ai-chat"
import { getCategoryMapping } from "@/lib/category-mappings"

export default function Home() {
  const featuredCategories = [
    { key: "mechanobiology", href: "/publications?category=mechanobiology" },
    { key: "human health", href: "/publications?category=human health" },
    { key: "mars research", href: "/publications?category=mars research" },
    { key: "covid-19", href: "/publications?category=covid-19" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 pb-8">
        <AppHeader />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 text-center">
          <p className="text-white/60 text-sm mb-2">Welcome to</p>
          <h2 className="text-white font-bold text-3xl lg:text-5xl tracking-tight mb-3">Space Hunters Group App</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-sm lg:text-base">
            Discover NASA space biology publications, explore themes, and chat with an AI copilot.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link href="/publications">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search for publications..."
                className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all font-sans shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                readOnly
              />
            </div>
          </Link>
        </div>

        

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
          <h3 className="text-white font-bold text-xl lg:text-2xl mb-4">Quick Access</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Publications Library Card */}
            <Link href="/publications">
              <div className="relative overflow-hidden rounded-3xl group border border-white/10 bg-[linear-gradient(120deg,rgba(59,130,246,0.18),rgba(168,85,247,0.18))] backdrop-blur-xl shadow-[0_10px_40px_rgba(2,6,23,0.35)]">
                <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-blue-400/30 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-purple-400/30 blur-2xl" />
                <div className="relative p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center shadow-[0_4px_20px_rgba(2,6,23,0.4)]">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg tracking-tight">Publications Library</h4>
                      <p className="text-white/80 text-sm">Explore the latest research</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Dashboard Card */}
            <Link href="/dashboard">
              <div className="relative overflow-hidden rounded-3xl group border border-white/10 bg-[linear-gradient(120deg,rgba(34,197,94,0.18),rgba(59,130,246,0.18))] backdrop-blur-xl shadow-[0_10px_40px_rgba(2,6,23,0.35)]">
                <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-green-400/30 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-400/30 blur-2xl" />
                <div className="relative p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center shadow-[0_4px_20px_rgba(2,6,23,0.4)]">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg tracking-tight">Space Dashboard</h4>
                      <p className="text-white/80 text-sm">Real-time space data</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Favorites Card */}
            <Link href="/favorites">
              <div className="relative overflow-hidden rounded-3xl group border border-white/10 bg-[linear-gradient(120deg,rgba(251,146,60,0.18),rgba(239,68,68,0.18))] backdrop-blur-xl shadow-[0_10px_40px_rgba(2,6,23,0.35)]">
                <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-orange-400/30 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-rose-400/30 blur-2xl" />
                <div className="relative p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center shadow-[0_4px_20px_rgba(2,6,23,0.4)]">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg tracking-tight">Favorites</h4>
                      <p className="text-white/80 text-sm">Your saved publications</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
          <h3 className="text-white font-bold text-xl lg:text-2xl mb-4">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCategories.map(({ key, href }) => {
              const mapping = getCategoryMapping(key)
              const Icon = mapping.icon
              return (
                <Link key={key} href={href}>
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Icon className={`w-10 h-10 ${mapping.color}`} />
                      </div>
                      <span className={`${mapping.color} font-semibold text-center capitalize text-sm`}>{key}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Chat Component - closed by default; opened via floating button */}
      <AIChat initiallyOpen={false} />
    </div>
  )
}
