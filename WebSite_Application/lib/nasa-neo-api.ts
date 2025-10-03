import { API_CONFIG } from './api-config'

export interface NearEarthObject {
  id: string
  name: string
  absolute_magnitude_h: number
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
    meters: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: Array<{
    close_approach_date: string
    close_approach_date_full: string
    epoch_date_close_approach: number
    relative_velocity: {
      kilometers_per_second: string
      kilometers_per_hour: string
    }
    miss_distance: {
      astronomical: string
      lunar: string
      kilometers: string
      miles: string
    }
    orbiting_body: string
  }>
  is_sentry_object: boolean
}

export interface NEOResponse {
  links: {
    next: string
    prev: string
    self: string
  }
  element_count: number
  near_earth_objects: {
    [date: string]: NearEarthObject[]
  }
}

export interface NEOError {
  error: {
    code: string
    message: string
  }
}

export class NASANEOService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = 'https://api.nasa.gov/neo/rest/v1'
    this.apiKey = API_CONFIG.NASA_APOD_API_KEY // Using the same NASA API key
  }

  private async fetchNEOData(endpoint: string): Promise<NEOResponse | NEOError> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`)
      url.searchParams.set('api_key', this.apiKey)

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
      return data as NEOResponse
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed'
        }
      }
    }
  }

  async getTodaysNEOs(): Promise<NEOResponse | NEOError> {
    const today = new Date().toISOString().split('T')[0]
    return this.fetchNEOData(`/feed?start_date=${today}&end_date=${today}`)
  }

  async getNEOsForDateRange(startDate: string, endDate: string): Promise<NEOResponse | NEOError> {
    return this.fetchNEOData(`/feed?start_date=${startDate}&end_date=${endDate}`)
  }

  async getUpcomingNEOs(days: number = 7): Promise<NEOResponse | NEOError> {
    const today = new Date()
    const endDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    const startDateStr = today.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]
    
    return this.fetchNEOData(`/feed?start_date=${startDateStr}&end_date=${endDateStr}`)
  }

  // Helper method to format distance
  formatDistance(km: string): string {
    const distance = parseFloat(km)
    if (distance >= 1000000) {
      return `${(distance / 1000000).toFixed(1)}M km`
    } else if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}K km`
    } else {
      return `${distance.toFixed(0)} km`
    }
  }

  // Helper method to format velocity
  formatVelocity(kmh: string): string {
    const velocity = parseFloat(kmh)
    if (velocity >= 100000) {
      return `${(velocity / 100000).toFixed(1)}M km/h`
    } else if (velocity >= 1000) {
      return `${(velocity / 1000).toFixed(1)}K km/h`
    } else {
      return `${velocity.toFixed(0)} km/h`
    }
  }

  // Helper method to get hazard level
  getHazardLevel(neo: NearEarthObject): 'low' | 'medium' | 'high' {
    const diameter = neo.estimated_diameter.kilometers.estimated_diameter_max
    const isHazardous = neo.is_potentially_hazardous_asteroid
    
    if (isHazardous && diameter > 0.1) return 'high'
    if (isHazardous || diameter > 0.05) return 'medium'
    return 'low'
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

// Export a singleton instance
export const nasaNEOService = new NASANEOService()
