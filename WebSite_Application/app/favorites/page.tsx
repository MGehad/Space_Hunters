"use client"

import { useState, useEffect } from "react"
import { Bookmark, Eye, LayoutGrid, MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { getCategoryMapping } from "@/lib/category-mappings"
import { usePublications } from "@/hooks/use-gemini-api"
import { useFavorites } from "@/hooks/use-favorites"
import { GeminiPublication } from "@/lib/gemini-api"

export default function FavoritesPage() {
  const { publications, loading } = usePublications()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const [favorites, setFavorites] = useState<GeminiPublication[]>([])

  useEffect(() => {
    const favoritePublications = publications.filter((p) => favoriteIds.has(p.id))
    setFavorites(favoritePublications)
  }, [publications, favoriteIds])

  const removeFavorite = (id: string) => {
    toggleFavorite(id)
  }

  const totalFavorites = favorites.length
  const alreadyRead = favorites.filter((f) => f.isViewed).length
  const uniqueCategories = new Set(favorites.map((f) => f.category)).size

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 pb-8">
        <AppHeader showBackButton backHref="/" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl lg:text-3xl">My Favorites</h1>
              <p className="text-white/60 text-sm">{totalFavorites} Saved Publications</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-400/20 rounded-3xl p-6 lg:p-8">
            <div className="grid grid-cols-3 gap-4 lg:gap-8">
              <div className="flex flex-col items-center">
                <Bookmark className="w-8 h-8 lg:w-10 lg:h-10 text-white mb-2" />
                <div className="text-3xl lg:text-4xl font-bold text-white">{totalFavorites}</div>
                <div className="text-white/60 text-xs lg:text-sm text-center">Total</div>
              </div>
              <div className="flex flex-col items-center">
                <Eye className="w-8 h-8 lg:w-10 lg:h-10 text-white mb-2" />
                <div className="text-3xl lg:text-4xl font-bold text-white">{alreadyRead}</div>
                <div className="text-white/60 text-xs lg:text-sm text-center">Already Read</div>
              </div>
              <div className="flex flex-col items-center">
                <LayoutGrid className="w-8 h-8 lg:w-10 lg:h-10 text-white mb-2" />
                <div className="text-3xl lg:text-4xl font-bold text-white">{uniqueCategories}</div>
                <div className="text-white/60 text-xs lg:text-sm text-center">Categories</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-xl lg:text-2xl">Favorite Publications</h2>
            {loading && (
              <div className="flex items-center gap-2 text-white/60">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((pub) => {
                const categoryMapping = getCategoryMapping(pub.category)
                const CategoryIcon = categoryMapping.icon

                return (
                  <Link key={pub.id} href={`/publications/${pub.id}`}>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all h-full flex flex-col">
                      {/* Category Tag */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-3 self-start">
                        <CategoryIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-medium">
                          {pub.category} - {pub.subcategory}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-semibold text-base leading-snug mb-4 flex-1">{pub.title}</h3>

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        {pub.isViewed && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-xs font-medium">Viewed</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            removeFavorite(pub.id)
                          }}
                          className="ml-auto"
                        >
                          <Bookmark className="w-5 h-5 text-orange-400 fill-orange-400" />
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No favorites yet</h3>
              <p className="text-white/60 text-sm text-center max-w-[250px]">
                Start exploring publications and save your favorites for quick access
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
