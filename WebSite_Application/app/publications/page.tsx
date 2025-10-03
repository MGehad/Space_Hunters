"use client"

import { useState, useEffect } from "react"
import { Search, Bookmark, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { filterCategories } from "@/lib/mock-data"
import { getCategoryMapping } from "@/lib/category-mappings"
import { usePublications } from "@/hooks/use-gemini-api"
import { useFavorites } from "@/hooks/use-favorites"

export default function PublicationsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { publications, loading, error, searchPublications } = usePublications()
  const { isFavorite, toggleFavorite } = useFavorites()

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPublications(searchQuery, selectedFilter || "")
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedFilter, searchPublications])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 pb-8">
        <AppHeader showBackButton backHref="/" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search for publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all font-sans"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {filterCategories.map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(selectedFilter === filter.label ? null : filter.label)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedFilter === filter.label
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 backdrop-blur-md text-white/80 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-xl lg:text-2xl">
              {selectedFilter ? `Publications in ${selectedFilter}` : "All Publications"}
            </h2>
            {loading && (
              <div className="flex items-center gap-2 text-white/60">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error loading publications</span>
              </div>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publications.map((pub) => {
              const categoryMapping = getCategoryMapping(pub.category)
              const CategoryIcon = categoryMapping.icon

              return (
                <Link key={pub.id} href={`/publications/${pub.id}`}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all h-full flex flex-col">
                    {/* Category Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${categoryMapping.bgColor} ${categoryMapping.borderColor} border`}
                      >
                        <CategoryIcon className={`w-3.5 h-3.5 ${categoryMapping.color}`} />
                        <span className={`${categoryMapping.color} text-xs font-medium`}>
                          {pub.category} - {pub.subcategory}
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-white/10">
                        <span className="text-white/60 text-xs font-medium">{pub.year}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-semibold text-base leading-snug mb-4 flex-1">{pub.title}</h3>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      {pub.isViewed && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="text-blue-400 text-xs font-medium">Viewed</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(pub.id)
                        }}
                        className="ml-auto"
                      >
                        <Bookmark className={`w-5 h-5 ${isFavorite(pub.id) ? "text-orange-400 fill-orange-400" : "text-white/40"}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <MessageSquare className="w-5 h-5 text-white/40" />
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
