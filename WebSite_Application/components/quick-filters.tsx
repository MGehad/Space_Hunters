"use client"

import { useState } from "react"
import { User, Leaf, Microscope, Cpu } from "lucide-react"

const filters = [
  { id: "humans", label: "Humans", icon: User },
  { id: "plants", label: "Plants", icon: Leaf },
  { id: "microbes", label: "Microbes", icon: Microscope },
  { id: "technology", label: "Technology", icon: Cpu },
]

export function QuickFilters() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  return (
    <div className="px-6 mt-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = activeFilter === filter.id

          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(isActive ? null : filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/10 backdrop-blur-sm text-white/80 border border-white/20 hover:bg-white/15"
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
