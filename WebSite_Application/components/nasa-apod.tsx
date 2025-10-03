'use client'

import { useState, useEffect } from 'react'
import { Calendar, ExternalLink, Play, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { nasaAPODService, APODData, APODError } from '@/lib/nasa-apod-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface NASAAPODProps {
  className?: string
  showRandomButton?: boolean
  initialDate?: string
}

export function NASAAPOD({ 
  className = '', 
  showRandomButton = true, 
  initialDate 
}: NASAAPODProps) {
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAPOD = async (date?: string) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = date 
        ? await nasaAPODService.getAPODByDate(date)
        : await nasaAPODService.getTodaysAPOD()

      if ('error' in result) {
        setError(result.error.message)
        setApodData(null)
      } else {
        setApodData(result)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch APOD data')
      setApodData(null)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchAPOD()
  }

  const handleRandomAPOD = async () => {
    try {
      setError(null)
      setLoading(true)
      setIsRefreshing(true)
      
      const result = await nasaAPODService.getRandomAPOD()
      
      if ('error' in result) {
        setError(result.error.message)
        setApodData(null)
      } else {
        setApodData(result)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch random APOD')
      setApodData(null)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchAPOD(initialDate)
    }
  }, [initialDate])

  if (loading) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-white/70 text-sm">Loading today's astronomy picture...</p>
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
          <div className="mt-4 flex gap-2">
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

  if (!apodData) {
    return null
  }

  const isVideo = nasaAPODService.isVideo(apodData.media_type)
  const imageUrl = nasaAPODService.getBestImageUrl(apodData)
  const formattedDate = nasaAPODService.formatDate(apodData.date)

  return (
    <Card className={`bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-xl font-bold mb-2 line-clamp-2">
              {apodData.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <Badge 
                variant="secondary" 
                className="bg-white/10 text-white/80 border-white/20"
              >
                {isVideo ? 'Video' : 'Image'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            {showRandomButton && (
              <Button
                onClick={handleRandomAPOD}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Media Display */}
        <div className="relative rounded-xl overflow-hidden bg-black/20">
          {isVideo ? (
            <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20">
              <img
                src={apodData.thumbnail_url || apodData.url}
                alt={apodData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors cursor-pointer">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <a
                href={apodData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-white" />
              </a>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imageUrl}
                alt={apodData.title}
                className="w-full h-auto max-h-96 object-cover"
                loading="lazy"
              />
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-white" />
              </a>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm">About this image:</h4>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-6">
            {apodData.explanation}
          </p>
          <a
            href={apodData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View full resolution
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
