export interface SpaceXLaunch {
  id: string
  flight_number: number
  name: string
  date_utc: string
  date_unix: number
  date_local: string
  date_precision: 'half' | 'quarter' | 'half' | 'year' | 'month' | 'day' | 'hour'
  static_fire_date_utc?: string
  static_fire_date_unix?: number
  tbd: boolean
  net: boolean
  window?: number
  rocket: string
  success?: boolean
  failures: Array<{
    time: number
    altitude?: number
    reason: string
  }>
  upcoming: boolean
  details?: string
  fairings?: {
    reused?: boolean
    recovery_attempt?: boolean
    recovered?: boolean
    ships: string[]
  }
  crew: string[]
  ships: string[]
  capsules: string[]
  payloads: string[]
  launchpad: string
  cores: Array<{
    core: string
    flight: number
    gridfins: boolean
    legs: boolean
    reused: boolean
    landing_attempt?: boolean
    landing_success?: boolean
    landing_type?: string
    landpad?: string
  }>
  links: {
    patch: {
      small?: string
      large?: string
    }
    reddit: {
      campaign?: string
      launch?: string
      media?: string
      recovery?: string
    }
    flickr: {
      small: string[]
      original: string[]
    }
    presskit?: string
    webcast?: string
    youtube_id?: string
    article?: string
    wikipedia?: string
  }
  auto_update: boolean
}

export interface SpaceXError {
  error: {
    code: string
    message: string
  }
}

export class SpaceXService {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.spacexdata.com/v5'
  }

  private async fetchSpaceXData(endpoint: string): Promise<SpaceXLaunch[] | SpaceXError> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
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
      return Array.isArray(data) ? data : [data]
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed'
        }
      }
    }
  }

  async getUpcomingLaunches(limit: number = 5): Promise<SpaceXLaunch[] | SpaceXError> {
    return this.fetchSpaceXData(`/launches/upcoming?limit=${limit}&sort=date_utc&order=asc`)
  }

  async getPastLaunches(limit: number = 5): Promise<SpaceXLaunch[] | SpaceXError> {
    return this.fetchSpaceXData(`/launches/past?limit=${limit}&sort=date_utc&order=desc`)
  }

  async getLatestLaunch(): Promise<SpaceXLaunch | SpaceXError> {
    const result = await this.fetchSpaceXData('/launches/latest')
    if ('error' in result) {
      return result
    }
    return result[0]
  }

  async getNextLaunch(): Promise<SpaceXLaunch | SpaceXError> {
    const result = await this.fetchSpaceXData('/launches/next')
    if ('error' in result) {
      return result
    }
    return result[0]
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper method to get time until launch
  getTimeUntilLaunch(dateString: string): string {
    const now = new Date()
    const launchDate = new Date(dateString)
    const diffMs = launchDate.getTime() - now.getTime()

    if (diffMs < 0) {
      return 'Launched'
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Helper method to get launch status
  getLaunchStatus(launch: SpaceXLaunch): 'upcoming' | 'success' | 'failed' | 'tbd' {
    if (launch.upcoming) return 'upcoming'
    if (launch.success === true) return 'success'
    if (launch.success === false) return 'failed'
    return 'tbd'
  }

  // Helper method to get status color
  getStatusColor(status: 'upcoming' | 'success' | 'failed' | 'tbd'): string {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'success': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'tbd': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    }
  }

  // Helper method to check if launch is today
  isToday(dateString: string): boolean {
    const today = new Date()
    const launchDate = new Date(dateString)
    return today.toDateString() === launchDate.toDateString()
  }
}

// Export a singleton instance
export const spaceXService = new SpaceXService()
