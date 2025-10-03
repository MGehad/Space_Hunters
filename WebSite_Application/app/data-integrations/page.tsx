"use client"

import { Database, ExternalLink, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { useDataIntegrations } from "@/hooks/use-gemini-api"

export default function DataIntegrationsPage() {
  const { integrations, loading, error, refreshIntegrations } = useDataIntegrations()
  
  const connectedCount = integrations.filter((d) => d.status === "connected").length
  const totalDatasets = integrations.reduce((sum, d) => sum + d.datasets, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 pb-8">
        <AppHeader showBackButton backHref="/" />

        {/* Header */}
        <div className="px-6 mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl">Data Integrations</h1>
                <p className="text-white/60 text-sm">Connected data sources</p>
              </div>
            </div>
            <Button
              onClick={refreshIntegrations}
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
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/20 rounded-3xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-white mb-2" />
                <div className="text-3xl font-bold text-white">{connectedCount}</div>
                <div className="text-white/60 text-xs text-center">Connected</div>
              </div>
              <div className="flex flex-col items-center">
                <Database className="w-8 h-8 text-white mb-2" />
                <div className="text-3xl font-bold text-white">{totalDatasets}</div>
                <div className="text-white/60 text-xs text-center">Total Datasets</div>
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
                <span className="font-medium">Error loading integrations</span>
              </div>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && integrations.length === 0 && (
          <div className="px-6 mt-8">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading data integrations...</span>
              </div>
            </div>
          </div>
        )}

        {/* Integrations List */}
        <div className="px-6 mt-8">
          <h2 className="text-white font-bold text-xl mb-4">Available Integrations</h2>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{integration.name}</h3>
                    <p className="text-white/60 text-xs">{integration.fullName}</p>
                  </div>
                  {integration.status === "connected" ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                      <span className="text-white/60 text-xs font-medium">Available</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-4">{integration.description}</p>

                {/* Stats */}
                {integration.status === "connected" && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80 text-sm">{integration.datasets} datasets</span>
                    </div>
                    {integration.lastSync && (
                      <div className="text-white/50 text-xs">Last sync: {integration.lastSync}</div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl h-10"
                  onClick={() => window.open(integration.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {integration.status === "connected" ? "View Data Source" : "Connect Integration"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
