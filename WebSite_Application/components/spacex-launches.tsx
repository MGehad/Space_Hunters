'use client'

import { useState, useEffect } from 'react'
import { Rocket, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2, ExternalLink } from 'lucide-react'
import { spaceXService, SpaceXLaunch, SpaceXError } from '@/lib/spacex-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SpaceXLaunchesProps {
  className?: string
  showUpcoming?: boolean
  limit?: number
}

export function SpaceXLaunches({ 
  className = '', 
  showUpcoming = true, 
  limit = 5 
}: SpaceXLaunchesProps) {
  const [launches, setLaunches] = useState<SpaceXLaunch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchLaunches = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const result = showUpcoming 
        ? await spaceXService.getUpcomingLaunches(limit)
        : await spaceXService.getPastLaunches(limit)

      if ('error' in result) {
        setError(result.error.message)
        setLaunches([])
      } else {
        setLaunches(result)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch launch data')
      setLaunches([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchLaunches()
  }

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchLaunches()
    }
  }, [showUpcoming, limit])

  const getStatusIcon = (status: 'upcoming' | 'success' | 'failed' | 'tbd') => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      case 'tbd': return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-white/70 text-sm">Loading launch data...</p>
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

  if (launches.length === 0) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-8">
          <div className="text-center">
            <Rocket className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">No Launches Found</h3>
            <p className="text-white/70 text-sm">
              {showUpcoming ? 'No upcoming launches scheduled.' : 'No past launches found.'}
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
            <CardTitle className="text-white text-xl font-bold mb-1 flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              SpaceX Launches
            </CardTitle>
            <p className="text-white/60 text-sm">
              {showUpcoming ? 'Upcoming' : 'Recent'} • {launches.length} launches
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
        <div className="grid gap-4">
          {launches.map((launch) => {
            const status = spaceXService.getLaunchStatus(launch)
            const isToday = spaceXService.isToday(launch.date_utc)
            const timeUntil = spaceXService.getTimeUntilLaunch(launch.date_utc)

            return (
              <div
                key={launch.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {launch.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Clock className="h-3 w-3" />
                      <span>
                        {spaceXService.formatDate(launch.date_utc)}
                        {isToday && <span className="text-blue-400 ml-1">(Today)</span>}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${spaceXService.getStatusColor(status)} text-xs`}
                    >
                      {getStatusIcon(status)}
                      <span className="ml-1 capitalize">{status}</span>
                    </Badge>
                    {status === 'upcoming' && (
                      <span className="text-xs text-blue-400 font-medium">
                        {timeUntil}
                      </span>
                    )}
                  </div>
                </div>

                {launch.details && (
                  <p className="text-white/70 text-xs mb-3 line-clamp-2">
                    {launch.details}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span>Flight #{launch.flight_number}</span>
                    {launch.links.webcast && (
                      <a
                        href={launch.links.webcast}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Watch
                      </a>
                    )}
                  </div>
                  
                  {launch.links.patch?.small && (
                    <img
                      src={launch.links.patch.small}
                      alt={`${launch.name} patch`}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
