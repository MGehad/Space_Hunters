"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Bookmark, ChevronRight, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCategoryMapping } from "@/lib/category-mappings"
import { usePublicationDetails, usePublications } from "@/hooks/use-gemini-api"
import { useFavorites } from "@/hooks/use-favorites"

export default function PublicationDetailsPage({ params }: { params: { id: string } }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [externalLink, setExternalLink] = useState<string | null>(null)
  const { publication, loading, error, fetchPublication } = usePublicationDetails()
  const { publications: allPublications } = usePublications()
  const { isFavorite: isFav, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetchPublication(params.id)
  }, [params.id, fetchPublication])

  // Look up external link from nasa_data.json by matching title (and year if available)
  useEffect(() => {
    async function loadLink() {
      try {
        if (!publication?.title) return
        const res = await fetch("/nasa_data.json")
        const items: Array<{ title: string; link?: string; year?: number }> = await res.json()
        const match = items.find((i) => i.title === publication.title || (i.year === publication.year && i.title.toLowerCase().includes(publication.title.toLowerCase().slice(0, 20))))
        if (match?.link) setExternalLink(match.link)
        else setExternalLink(null)
      } catch {
        setExternalLink(null)
      }
    }
    loadLink()
  }, [publication])

  const relatedStudies = publication?.relatedStudies
    ? allPublications.filter((p) => publication.relatedStudies?.includes(p.id))
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
        <SpaceBackground />
        <div className="relative z-10 pb-8">
          <AppHeader showBackButton backHref="/publications" />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading publication details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const publicationFromList = !publication ? allPublications.find((p) => p.id === params.id) : null
  const pub = publication || publicationFromList || null

  if (!pub) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
        <SpaceBackground />
        <div className="relative z-10 pb-8">
          <AppHeader showBackButton backHref="/publications" />
          <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error loading publication</span>
              </div>
              <p className="text-red-300">{error || "Publication not found"}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const categoryMapping = getCategoryMapping(pub.category)
  const CategoryIcon = categoryMapping.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 pb-8">
          <AppHeader showBackButton backHref="/publications" />

        <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-3">
            <CategoryIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              {pub.category} - {pub.subcategory}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <h1 className="text-white font-bold text-2xl lg:text-3xl leading-tight flex-1">{pub.title}</h1>
            <div className="px-3 py-1 rounded-full bg-white/10 flex-shrink-0 self-start">
              <span className="text-white/60 text-sm font-medium">{pub.year}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/publications/${pub.id}/chat`}>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 font-semibold">
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask about this study
              </Button>
            </Link>
            <Button
              onClick={() => {
                if (pub) {
                  toggleFavorite(pub.id)
                  setIsFavorite(isFav(pub.id))
                }
              }}
              variant="outline"
              className={`w-full rounded-xl h-12 border-white/20 ${
                isFavorite
                  ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isFav(pub.id) ? "fill-orange-300" : ""}`} />
              {isFav(pub.id) ? "Saved" : "Save"}
            </Button>
            {externalLink && (
              <a href={externalLink} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full rounded-xl h-12 border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open article
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Abstract Section */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-8">
          <h2 className="text-white font-bold text-xl lg:text-2xl mb-4">Abstract</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <p className="text-white/80 leading-relaxed">{pub.abstract || "Abstract not available for this record."}</p>
          </div>
        </div>

        {/* Publication Details */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-8">
          <h2 className="text-white font-bold text-xl lg:text-2xl mb-4">Publication Details</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Authors</h3>
              <p className="text-white/70">{pub.authors?.join(", ") || "Unknown authors"}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Journal</h3>
              <p className="text-white/70">{pub.journal || "Unknown journal"}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">DOI</h3>
              <p className="text-white/70 font-mono text-sm">{pub.doi || "Not available"}</p>
            </div>
            {pub.osdrId && (
              <div>
                <h3 className="text-white font-medium mb-2">OSDR ID</h3>
                <p className="text-white/70 font-mono text-sm">{pub.osdrId}</p>
              </div>
            )}
            {pub.taskBookId && (
              <div>
                <h3 className="text-white font-medium mb-2">Task Book ID</h3>
                <p className="text-white/70 font-mono text-sm">{pub.taskBookId}</p>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-8">
          <h2 className="text-white font-bold text-xl lg:text-2xl mb-4">Related Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedStudies.map((study) => {
              const studyMapping = getCategoryMapping(study.category)
              const StudyIcon = studyMapping.icon

              return (
                <Link key={study.id} href={`/publications/${study.id}`}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                    <h3 className="text-white font-medium text-sm leading-snug mb-2">{study.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StudyIcon className={`w-3.5 h-3.5 ${studyMapping.color}`} />
                        <span className="text-white/50 text-xs">
                          {study.category} - {study.subcategory}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40" />
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
