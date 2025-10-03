import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { NASAAPOD } from "@/components/nasa-apod"
import { NASANEO } from "@/components/nasa-neo"
import { SpaceXLaunches } from "@/components/spacex-launches"
import { SpaceQuote } from "@/components/space-quote"
import { DashboardAnalytics } from "@/components/dashboard-analytics"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10">
        <AppHeader />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-white font-bold text-3xl lg:text-4xl tracking-tight mb-3">
              Space Dashboard
            </h1>
            <p className="text-white/70 text-sm lg:text-base max-w-2xl mx-auto">
              Real-time space data, launches, and cosmic insights all in one place.
            </p>
          </div>
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* APOD - Full width on large screens */}
            <div className="lg:col-span-2">
              <NASAAPOD showRandomButton={true} />
            </div>
            
            {/* NEO and SpaceX Launches */}
            <div className="space-y-8">
              <NASANEO showUpcoming={true} daysAhead={7} />
              <SpaceXLaunches showUpcoming={true} limit={3} />
            </div>
            
            {/* Space Quote */}
            <div>
              <SpaceQuote 
                showRefreshButton={true} 
                autoRefresh={true} 
                refreshInterval={600000} // 10 minutes
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="mt-2">
            <DashboardAnalytics />
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">Real-time Data</h3>
              <p className="text-white/70 text-sm">
                All data is fetched in real-time from official NASA and SpaceX APIs, 
                ensuring you always have the latest information.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">Space Safety</h3>
              <p className="text-white/70 text-sm">
                Monitor near-Earth objects and track their potential impact on our planet 
                with detailed hazard assessments.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">Launch Updates</h3>
              <p className="text-white/70 text-sm">
                Stay informed about upcoming SpaceX launches and space missions 
                happening around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
