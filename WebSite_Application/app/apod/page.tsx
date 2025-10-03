import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { NASAAPOD } from "@/components/nasa-apod"

export default function APODPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-10">
        <AppHeader />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-white font-bold text-3xl lg:text-4xl tracking-tight mb-3">
              Astronomy Picture of the Day
            </h1>
            <p className="text-white/70 text-sm lg:text-base max-w-2xl mx-auto">
              Discover the cosmos! Each day a different image or photograph of our fascinating universe 
              is featured, along with a brief explanation written by a professional astronomer.
            </p>
          </div>
          
          <NASAAPOD showRandomButton={true} />
        </div>
      </div>
    </div>
  )
}

