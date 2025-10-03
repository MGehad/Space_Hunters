"use client"

import { Brain, TrendingUp, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { useKnowledgeGaps } from "@/hooks/use-gemini-api"

export default function KnowledgeGapsPage() {
  const { knowledgeGaps, loading, error, refreshGaps } = useKnowledgeGaps()
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 pb-8">
        <AppHeader showBackButton backHref="/" />

        {/* Header */}
        <div className="px-6 mt-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl">Knowledge Gaps</h1>
                <p className="text-white/60 text-sm">Areas needing more research</p>
              </div>
            </div>
            <Button
              onClick={refreshGaps}
              disabled={loading}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 mt-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/20 rounded-3xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <AlertCircle className="w-8 h-8 text-white mb-2" />
                <div className="text-3xl font-bold text-white">{knowledgeGaps.length}</div>
                <div className="text-white/60 text-xs text-center">Identified Gaps</div>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-8 h-8 text-white mb-2" />
                <div className="text-3xl font-bold text-white">
                  {knowledgeGaps.filter((g) => g.priority === "High").length}
                </div>
                <div className="text-white/60 text-xs text-center">High Priority</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-6 mt-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error loading knowledge gaps</span>
              </div>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && knowledgeGaps.length === 0 && (
          <div className="px-6 mt-8">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing knowledge gaps...</span>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Gaps List */}
        <div className="px-6 mt-8">
          <h2 className="text-white font-bold text-xl mb-4">Research Gaps</h2>
          <div className="space-y-4">
            {knowledgeGaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                    <span className="text-purple-400 text-xs font-medium">{gap.category}</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full ${
                      gap.priority === "High"
                        ? "bg-red-500/20 border border-red-500/30"
                        : "bg-yellow-500/20 border border-yellow-500/30"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${gap.priority === "High" ? "text-red-400" : "text-yellow-400"}`}
                    >
                      {gap.priority} Priority
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-base leading-snug mb-2">{gap.title}</h3>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed mb-3">{gap.description}</p>

                {/* Footer */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-blue-500/20">
                    <span className="text-blue-400 text-xs font-medium">{gap.relatedPublications} publications</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
