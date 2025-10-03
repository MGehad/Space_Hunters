"use client"

import Link from "next/link"
import { User, Leaf, Microscope, Cpu, Bookmark, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PublicationCardProps {
  id: string
  title: string
  category: "Humans" | "Plants" | "Microbes" | "Technology"
  year?: number
  isViewed?: boolean
  isFavorite?: boolean
  onRemoveFavorite?: () => void
}

const categoryConfig = {
  Humans: { icon: User, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  Plants: { icon: Leaf, color: "bg-green-500/20 text-green-300 border-green-500/30" },
  Microbes: { icon: Microscope, color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  Technology: { icon: Cpu, color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
}

export function PublicationCard({
  id,
  title,
  category,
  year,
  isViewed,
  isFavorite,
  onRemoveFavorite,
}: PublicationCardProps) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <Link href={`/publications/${id}`}>
      <div className="group bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 transition-all hover:translate-y-[-2px] active:translate-y-0 relative shadow-[0_6px_24px_rgba(2,6,23,0.35)]">
        {/* Category Icon */}
        <div className={`w-12 h-12 rounded-xl ${config.color} border flex items-center justify-center mb-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 tracking-tight">{title}</h3>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/20 text-xs group-hover:bg-white/15">
            {category}
          </Badge>

          <div className="flex items-center gap-2">
            {year && <span className="text-white/50 text-xs">{year}</span>}
            {isViewed && <Eye className="w-3.5 h-3.5 text-blue-400" />}
            {isFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onRemoveFavorite?.()
                }}
                className="hover:scale-110 transition-transform"
              >
                <Bookmark className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
