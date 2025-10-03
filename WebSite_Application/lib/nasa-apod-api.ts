import { API_CONFIG } from './api-config'

export interface APODData {
  date: string
  explanation: string
  hdurl?: string
  media_type: 'image' | 'video'
  service_version: string
  title: string
  url: string
  thumbnail_url?: string
}

export interface APODError {
  error: {
    code: string
    message: string
  }
}

export class NASAAPODService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = API_CONFIG.NASA_APOD_BASE_URL
    this.apiKey = API_CONFIG.NASA_APOD_API_KEY
  }

  private async fetchAPODData(date?: string): Promise<APODData | APODError> {
    try {
      const url = new URL(this.baseUrl)
      url.searchParams.set('api_key', this.apiKey)
      
      if (date) {
        url.searchParams.set('date', date)
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          error: {
            code: response.status.toString(),
            message: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
          }
        }
      }

      const data = await response.json()
      return data as APODData
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed'
        }
      }
    }
  }

  async getTodaysAPOD(): Promise<APODData | APODError> {
    return this.fetchAPODData()
  }

  async getAPODByDate(date: string): Promise<APODData | APODError> {
    return this.fetchAPODData(date)
  }

  async getRandomAPOD(): Promise<APODData | APODError> {
    // Get a random date within the last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
    const randomTime = thirtyDaysAgo.getTime() + Math.random() * (today.getTime() - thirtyDaysAgo.getTime())
    const randomDate = new Date(randomTime)
    
    const dateString = randomDate.toISOString().split('T')[0]
    return this.fetchAPODData(dateString)
  }

  // Helper method to format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper method to check if media is a video
  isVideo(mediaType: string): boolean {
    return mediaType === 'video'
  }

  // Helper method to get the best quality image URL
  getBestImageUrl(apodData: APODData): string {
    return apodData.hdurl || apodData.url
  }
}

// Export a singleton instance
export const nasaAPODService = new NASAAPODService()
