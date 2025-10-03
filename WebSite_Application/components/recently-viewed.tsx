"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { getCategoryMapping } from "@/lib/category-mappings"
import { usePublications } from "@/hooks/use-gemini-api"
import { GeminiPublication } from "@/lib/gemini-api"
import Link from "next/link"

export function RecentlyViewed() {
  const { publications, loading } = usePublications()
  const [recentPublications, setRecentPublications] = useState<GeminiPublication[]>([])

  useEffect(() => {
    // Filter recently viewed publications (those marked as viewed)
    const recent = publications.filter(pub => pub.isViewed).slice(0, 5)
    setRecentPublications(recent)
  }, [publications])
  return (
    <div className="mt-8">
      <div className="px-6 mb-4">
        <h2 className="text-white font-bold text-lg font-sans">Recently Viewed</h2>
        <p className="text-white/50 text-sm mt-0.5">Continue your research</p>
      </div>

      {loading && recentPublications.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-white/60">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading recent publications...</span>
          </div>
        </div>
      ) : recentPublications.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
          {recentPublications.map((pub) => {
            const categoryMapping = getCategoryMapping(pub.category)
            const Icon = categoryMapping.icon

            return (
              <Link key={pub.id} href={`/publications/${pub.id}`}>
                <div
                  className="flex-shrink-0 w-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all cursor-pointer group"
                  style={{
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${categoryMapping.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${categoryMapping.color}`} />
                  </div>

                  <h3 className="text-white font-semibold text-base leading-snug mb-3 line-clamp-2 font-sans">
                    {pub.title}
                  </h3>

                  <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/70 text-xs font-medium">
                    {pub.category}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="px-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center">
            <p className="text-white/60">No recently viewed publications yet. Start exploring to see them here!</p>
          </div>
        </div>
      )}
    </div>
  )
}
