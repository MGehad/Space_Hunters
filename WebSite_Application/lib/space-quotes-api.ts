export interface SpaceQuote {
  id: string
  content: string
  author: string
  tags: string[]
  length: number
  dateAdded: string
  dateModified: string
}

export interface QuoteError {
  error: {
    code: string
    message: string
  }
}

export class SpaceQuotesService {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.quotable.io'
  }

  private async fetchQuoteData(endpoint: string): Promise<SpaceQuote | SpaceQuote[] | QuoteError> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        return {
          error: {
            code: response.status.toString(),
            message: `HTTP ${response.status}: ${response.statusText}`
          }
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      // Handle different types of errors
      let errorMessage = 'Network request failed'
      let errorCode = 'NETWORK_ERROR'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - API may be slow or unavailable'
          errorCode = 'TIMEOUT_ERROR'
        } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = 'DNS resolution failed - API service may be down'
          errorCode = 'DNS_ERROR'
        } else if (error.message.includes('ERR_NETWORK')) {
          errorMessage = 'Network connection failed'
          errorCode = 'CONNECTION_ERROR'
        } else {
          errorMessage = error.message
        }
      }

      return {
        error: {
          code: errorCode,
          message: errorMessage
        }
      }
    }
  }

  async getRandomQuote(): Promise<SpaceQuote | QuoteError> {
    return this.fetchQuoteData('/random') as Promise<SpaceQuote | QuoteError>
  }

  async getRandomSpaceQuote(): Promise<SpaceQuote | QuoteError> {
    // Try to get a quote with space-related tags
    const spaceTags = ['space', 'science', 'exploration', 'universe', 'astronomy', 'cosmos', 'discovery']
    const randomTag = spaceTags[Math.floor(Math.random() * spaceTags.length)]
    
    return this.fetchQuoteData(`/random?tags=${randomTag}`) as Promise<SpaceQuote | QuoteError>
  }

  async getQuoteOfTheDay(): Promise<SpaceQuote | QuoteError> {
    return this.fetchQuoteData('/qotd') as Promise<SpaceQuote | QuoteError>
  }

  async getQuotesByAuthor(author: string, limit: number = 5): Promise<SpaceQuote[] | QuoteError> {
    return this.fetchQuoteData(`/quotes?author=${encodeURIComponent(author)}&limit=${limit}`) as Promise<SpaceQuote[] | QuoteError>
  }

  async getQuotesByTags(tags: string[], limit: number = 5): Promise<SpaceQuote[] | QuoteError> {
    const tagsParam = tags.join(',')
    return this.fetchQuoteData(`/quotes?tags=${tagsParam}&limit=${limit}`) as Promise<SpaceQuote[] | QuoteError>
  }

  // Fallback quotes for when API is unavailable
  getFallbackSpaceQuotes(): SpaceQuote[] {
    return [
      {
        id: 'fallback-1',
        content: "The Earth is the only world known so far to harbor life. There is nowhere else, at least in the near future, to which our species could migrate.",
        author: "Carl Sagan",
        tags: ['space', 'earth', 'life'],
        length: 156,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString()
      },
      {
        id: 'fallback-2',
        content: "Space is not just a place, it's a direction.",
        author: "Neil deGrasse Tyson",
        tags: ['space', 'exploration'],
        length: 45,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString()
      },
      {
        id: 'fallback-3',
        content: "The universe is not only queerer than we suppose, but queerer than we can suppose.",
        author: "J.B.S. Haldane",
        tags: ['universe', 'science', 'mystery'],
        length: 95,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString()
      },
      {
        id: 'fallback-4',
        content: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        author: "Albert Einstein",
        tags: ['universe', 'human', 'humor'],
        length: 108,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString()
      },
      {
        id: 'fallback-5',
        content: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
        author: "Carl Sagan",
        tags: ['cosmos', 'universe', 'human', 'connection'],
        length: 118,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString()
      }
    ]
  }

  // Helper method to get a random fallback quote
  getRandomFallbackQuote(): SpaceQuote {
    const fallbackQuotes = this.getFallbackSpaceQuotes()
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
  }

  // Helper method to format author name
  formatAuthor(author: string): string {
    // Handle cases where author might be "Unknown" or empty
    if (!author || author.toLowerCase() === 'unknown') {
      return 'Anonymous'
    }
    return author
  }

  // Helper method to truncate quote if too long
  truncateQuote(quote: string, maxLength: number = 200): string {
    if (quote.length <= maxLength) return quote
    return quote.substring(0, maxLength).trim() + '...'
  }

  // Check if the API is available
  async checkApiAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/random`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout for availability check
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Get quote with automatic fallback
  async getQuoteWithFallback(): Promise<SpaceQuote> {
    try {
      const result = await this.getRandomSpaceQuote()
      if ('error' in result) {
        console.warn('API unavailable, using fallback quote:', result.error.message)
        return this.getRandomFallbackQuote()
      }
      return result
    } catch (error) {
      console.warn('API request failed, using fallback quote:', error)
      return this.getRandomFallbackQuote()
    }
  }
}

// Export a singleton instance
export const spaceQuotesService = new SpaceQuotesService()
