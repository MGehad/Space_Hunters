'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, Zap, Calendar, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { nasaNEOService, NearEarthObject, NEOResponse, NEOError } from '@/lib/nasa-neo-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface NASANEOProps {
  className?: string
  showUpcoming?: boolean
  daysAhead?: number
}

export function NASANEO({ 
  className = '', 
  showUpcoming = true, 
  daysAhead = 7 
}: NASANEOProps) {
  const [neoData, setNeoData] = useState<NearEarthObject[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchNEOs = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const result = showUpcoming 
        ? await nasaNEOService.getUpcomingNEOs(daysAhead)
        : await nasaNEOService.getTodaysNEOs()

      if ('error' in result) {
        setError(result.error.message)
        setNeoData([])
      } else {
        // Flatten all NEOs from all dates
        const allNEOs = Object.values(result.near_earth_objects).flat()
        setNeoData(allNEOs)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NEO data')
      setNeoData([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchNEOs()
  }

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchNEOs()
    }
  }, [showUpcoming, daysAhead])

  const getHazardColor = (hazardLevel: 'low' | 'medium' | 'high') => {
    switch (hazardLevel) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
    }
  }

  const getHazardIcon = (hazardLevel: 'low' | 'medium' | 'high') => {
    switch (hazardLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Shield className="h-4 w-4" />
      case 'low': return <Zap className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-white/70 text-sm">Scanning for near-Earth objects...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-6">
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (neoData.length === 0) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">All Clear!</h3>
            <p className="text-white/70 text-sm">
              No near-Earth objects detected for the selected time period.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl font-bold mb-1">
              Near-Earth Objects
            </CardTitle>
            <p className="text-white/60 text-sm">
              {showUpcoming ? `Next ${daysAhead} days` : 'Today'} • {neoData.length} objects detected
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {neoData.slice(0, 10).map((neo) => {
            const hazardLevel = nasaNEOService.getHazardLevel(neo)
            const nextApproach = neo.close_approach_data[0]
            const diameter = neo.estimated_diameter.kilometers.estimated_diameter_max

            return (
              <div
                key={neo.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {neo.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {nextApproach ? nasaNEOService.formatDate(nextApproach.close_approach_date) : 'Unknown date'}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getHazardColor(hazardLevel)} text-xs`}
                  >
                    {getHazardIcon(hazardLevel)}
                    <span className="ml-1 capitalize">{hazardLevel}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/60">Diameter:</span>
                    <div className="text-white font-medium">
                      {diameter.toFixed(2)} km
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Distance:</span>
                    <div className="text-white font-medium">
                      {nextApproach ? nasaNEOService.formatDistance(nextApproach.miss_distance.kilometers) : 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Velocity:</span>
                    <div className="text-white font-medium">
                      {nextApproach ? nasaNEOService.formatVelocity(nextApproach.relative_velocity.kilometers_per_hour) : 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/60">Hazardous:</span>
                    <div className="text-white font-medium">
                      {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {neoData.length > 10 && (
          <div className="text-center pt-2">
            <p className="text-white/60 text-xs">
              Showing 10 of {neoData.length} objects
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
