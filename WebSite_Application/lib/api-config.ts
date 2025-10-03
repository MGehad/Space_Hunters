// API Configuration
export const API_CONFIG = {
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  NASA_APOD_API_KEY: process.env.NEXT_PUBLIC_NASA_APOD_API_KEY || "M7slMeItjmXMZsjjVdeE9hOdKDE17McxelM3iHcZ",
  
  // Fallback to mock data if API key is not provided
  USE_MOCK_DATA: !process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  
  // API endpoints and settings
  GEMINI_MODEL: process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-1.5-flash-latest",
  NASA_APOD_BASE_URL: "https://api.nasa.gov/planetary/apod",
  
  // Default limits
  DEFAULT_PUBLICATION_LIMIT: 100,
  MAX_CHAT_HISTORY: 10,
  
  // Cache settings (in milliseconds)
  CACHE_DURATION: {
    PUBLICATIONS: 5 * 60 * 1000, // 5 minutes
    KNOWLEDGE_GAPS: 30 * 60 * 1000, // 30 minutes
    DATA_INTEGRATIONS: 60 * 60 * 1000, // 1 hour
  }
}

// Environment validation
export function validateEnvironment(): { isValid: boolean; missing: string[] } {
  const missing: string[] = []
  
  if (!API_CONFIG.GEMINI_API_KEY) {
    missing.push("NEXT_PUBLIC_GEMINI_API_KEY")
  }
  
  return {
    isValid: missing.length === 0,
    missing
  }
}

