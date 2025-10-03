'use client'

import { useState, useEffect } from 'react'
import { Quote, RefreshCw, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import { spaceQuotesService, SpaceQuote, QuoteError } from '@/lib/space-quotes-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SpaceQuoteProps {
  className?: string
  showRefreshButton?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function SpaceQuote({ 
  className = '', 
  showRefreshButton = true,
  autoRefresh = false,
  refreshInterval = 300000 // 5 minutes
}: SpaceQuoteProps) {
  const [quote, setQuote] = useState<SpaceQuote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchQuote = async (useFallback = false) => {
    try {
      setError(null)
      setLoading(true)
      
      if (useFallback) {
        const result = spaceQuotesService.getRandomFallbackQuote()
        setQuote(result)
        setUsingFallback(true)
        setError(null)
      } else {
        // Check if API is available first
        const isApiAvailable = await spaceQuotesService.checkApiAvailability()
        
        if (!isApiAvailable) {
          // API is not available, use fallback
          const result = spaceQuotesService.getRandomFallbackQuote()
          setQuote(result)
          setUsingFallback(true)
          setError(null)
        } else {
          // API is available, try to get live quote
          const result = await spaceQuotesService.getRandomSpaceQuote()
          
          if ('error' in result) {
            // API returned an error, use fallback
            const fallbackResult = spaceQuotesService.getRandomFallbackQuote()
            setQuote(fallbackResult)
            setUsingFallback(true)
            setError(null)
          } else {
            // Successfully got live quote
            setQuote(result)
            setUsingFallback(false)
            setError(null)
          }
        }
      }
    } catch (err) {
      // If everything fails, use fallback
      console.warn('Unexpected error, using fallback quotes:', err)
      setQuote(spaceQuotesService.getRandomFallbackQuote())
      setUsingFallback(true)
      setError(null)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchQuote()
  }

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchQuote()
    }
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || typeof window === 'undefined') return

    const interval = setInterval(() => {
      fetchQuote()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  if (loading) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${className}`}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-white/70 text-sm">Finding inspiration...</p>
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
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!quote) {
    return null
  }

  return (
    <Card className={`bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
            <Quote className="h-5 w-5" />
            Space Quote
          </CardTitle>
          {showRefreshButton && (
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quote Content */}
        <div className="relative">
          <div className="absolute -top-2 -left-2 text-purple-400/30">
            <Quote className="h-8 w-8" />
          </div>
          <blockquote className="text-white/90 text-base leading-relaxed pl-6 italic">
            "{spaceQuotesService.truncateQuote(quote.content, 300)}"
          </blockquote>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
            <span className="text-purple-400 font-medium text-sm">
              — {spaceQuotesService.formatAuthor(quote.author)}
            </span>
            {usingFallback && (
              <span className="text-xs text-yellow-400/70 bg-yellow-400/10 px-2 py-1 rounded-full">
                Offline
              </span>
            )}
          </div>
          
          {quote.tags && quote.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-white/60">
                {quote.tags.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center pt-2">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-purple-400/40 rounded-full"></div>
            <div className="w-1 h-1 bg-purple-400/60 rounded-full"></div>
            <div className="w-1 h-1 bg-purple-400/40 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
