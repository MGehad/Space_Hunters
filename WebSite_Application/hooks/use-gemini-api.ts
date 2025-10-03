"use client"

import { useState, useEffect, useCallback } from "react"
import { geminiAPI, GeminiPublication, KnowledgeGap, DataIntegration } from "@/lib/gemini-api"
import { mockPublications } from "@/lib/mock-data"
import { API_CONFIG } from "@/lib/api-config"

interface UsePublicationsResult {
  publications: GeminiPublication[]
  loading: boolean
  error: string | null
  searchPublications: (query: string, category?: string) => Promise<void>
  refreshPublications: () => Promise<void>
}

interface UsePublicationDetailsResult {
  publication: GeminiPublication | null
  loading: boolean
  error: string | null
  fetchPublication: (id: string, title?: string) => Promise<void>
}

interface UseChatResult {
  messages: Array<{id: string, type: "user" | "ai", content: string, timestamp: Date}>
  loading: boolean
  error: string | null
  sendMessage: (message: string) => Promise<void>
  clearChat: () => void
}

interface UseKnowledgeGapsResult {
  knowledgeGaps: KnowledgeGap[]
  loading: boolean
  error: string | null
  refreshGaps: () => Promise<void>
}

interface UseDataIntegrationsResult {
  integrations: DataIntegration[]
  loading: boolean
  error: string | null
  refreshIntegrations: () => Promise<void>
}

// Cache implementation
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; duration: number }>()

  set(key: string, data: T, duration: number) {
    this.cache.set(key, { data, timestamp: Date.now(), duration })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.duration) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear() {
    this.cache.clear()
  }
}

const cache = new SimpleCache()

// Hook for managing publications
export function usePublications(): UsePublicationsResult {
  const [publications, setPublications] = useState<GeminiPublication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchPublications = useCallback(async (query: string = "", category: string = "") => {
    setLoading(true)
    setError(null)

    try {
      const cacheKey = `publications_${query}_${category}`
      const cached = cache.get(cacheKey)
      
      if (cached) {
        setPublications(cached as GeminiPublication[])
        setLoading(false)
        return
      }

      let results: GeminiPublication[] = []
      
      if (API_CONFIG.USE_MOCK_DATA) {
        // Prefer NASA local JSON when in mock mode
        async function loadFromNasaJson(): Promise<GeminiPublication[]> {
          try {
            const res = await fetch("/nasa_data.json", { cache: "no-store" })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            if (!Array.isArray(data)) return []

            const publications = (data as Array<any>).map((item, index) => {
              const categoryText = String(item.category || "")
              const [primaryCategory, subcategoryRaw] = categoryText.split(" - ")
              const category = (primaryCategory || "Space biology").trim()
              const subcategory = (subcategoryRaw || "general").trim()
              const year = typeof item.year === "number" ? item.year : 0
              const title = String(item.title || "Untitled Publication")
              const link = String(item.link || "")
              const id = `${year}-${index}-${Math.abs(hashString(title + link))}`

              const pub: GeminiPublication = {
                id,
                title,
                category,
                subcategory,
                year,
                abstract: "",
                authors: ["Unknown Author"],
                journal: "",
                doi: "",
                relatedStudies: [],
              }
              return pub
            })
            return publications
          } catch {
            return []
          }
        }

        function hashString(input: string): number {
          let hash = 0
          for (let i = 0; i < input.length; i++) {
            const chr = input.charCodeAt(i)
            hash = (hash << 5) - hash + chr
            hash |= 0
          }
          return hash
        }

        let nasaResults = await loadFromNasaJson()
        if (!nasaResults.length) {
          // Fallback to bundled mock publications
          nasaResults = mockPublications.map(pub => ({
            ...pub,
            abstract: pub.abstract || "No abstract available.",
            authors: pub.authors || ["Unknown Author"],
            journal: pub.journal || "Unknown Journal",
            doi: pub.doi || "10.0000/unknown",
            relatedStudies: pub.relatedStudies || []
          })) as GeminiPublication[]
        }

        const q = query.toLowerCase()
        const cat = (category || "").toLowerCase()
        const filtered = nasaResults.filter(p => {
          const t = (p.title || "").toLowerCase()
          const c = (p.category || "").toLowerCase()
          const s = (p.subcategory || "").toLowerCase()
          const matchesQuery = !q || t.includes(q) || c.includes(q) || s.includes(q)
          const matchesCategory = !cat || c.includes(cat)
          return matchesQuery && matchesCategory
        })

        const limit = Number(API_CONFIG.DEFAULT_PUBLICATION_LIMIT) || 20
        results = filtered.slice(0, limit)
      } else {
        const apiResults = await geminiAPI.searchPublications(query, category, Number(API_CONFIG.DEFAULT_PUBLICATION_LIMIT) || 20)
        results = Array.isArray(apiResults) ? apiResults : []
      }
      
      cache.set(cacheKey, results, API_CONFIG.CACHE_DURATION.PUBLICATIONS)
      setPublications(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch publications")
      console.error("Error in searchPublications:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshPublications = useCallback(async () => {
    cache.clear()
    await searchPublications()
  }, [searchPublications])

  // Initial load
  useEffect(() => {
    searchPublications()
  }, [searchPublications])

  return {
    publications,
    loading,
    error,
    searchPublications,
    refreshPublications
  }
}

// Hook for managing publication details
export function usePublicationDetails(): UsePublicationDetailsResult {
  const [publication, setPublication] = useState<GeminiPublication | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPublication = useCallback(async (id: string, title?: string) => {
    setLoading(true)
    setError(null)

    try {
      const cacheKey = `publication_${id}`
      const cached = cache.get(cacheKey)
      
      if (cached) {
        setPublication(cached as GeminiPublication)
        setLoading(false)
        return
      }

      let result: GeminiPublication | null
      
      if (API_CONFIG.USE_MOCK_DATA) {
        // Try to reconstruct publication from nasa_data.json first
        try {
          const res = await fetch('/nasa_data.json', { cache: 'no-store' })
          if (res.ok) {
            const items = await res.json()
            if (Array.isArray(items)) {
              const all: GeminiPublication[] = items.map((item: any, index: number) => {
                const categoryText = String(item.category || "")
                const [primaryCategory, subcategoryRaw] = categoryText.split(" - ")
                const category = (primaryCategory || "Space biology").trim()
                const subcategory = (subcategoryRaw || "general").trim()
                const year = typeof item.year === 'number' ? item.year : 0
                const titleText = String(item.title || "Untitled Publication")
                const link = String(item.link || "")
                const computedId = `${year}-${index}-${Math.abs(hashString(titleText + link))}`
                return {
                  id: computedId,
                  title: titleText,
                  category,
                  subcategory,
                  year,
                  abstract: "",
                  authors: ["Unknown Author"],
                  journal: "",
                  doi: "",
                  relatedStudies: [],
                } as GeminiPublication
              })
              result = all.find(p => p.id === id) || null
            } else {
              result = null
            }
          } else {
            result = null
          }
        } catch {
          result = null
        }

        // Fallback to bundled mock data if not found
        if (!result) {
          const mockPub = mockPublications.find(p => p.id === id)
          result = mockPub ? {
            ...mockPub,
            abstract: mockPub.abstract || "No abstract available.",
            authors: mockPub.authors || ["Unknown Author"],
            journal: mockPub.journal || "Unknown Journal", 
            doi: mockPub.doi || "10.0000/unknown",
            relatedStudies: mockPub.relatedStudies || []
          } as GeminiPublication : null
        }
      } else {
        result = await geminiAPI.getPublicationDetails(id, title || "")
      }
      
      if (result) {
        cache.set(cacheKey, result, API_CONFIG.CACHE_DURATION.PUBLICATIONS)
        setPublication(result)
      } else {
        setError("Publication not found")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch publication details")
      console.error("Error in fetchPublication:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  function hashString(input: string): number {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const chr = input.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0
    }
    return hash
  }

  return {
    publication,
    loading,
    error,
    fetchPublication
  }
}

// Hook for managing chat functionality
export function useChat(publicationTitle: string, publicationAbstract: string): UseChatResult {
  const [messages, setMessages] = useState<Array<{id: string, type: "user" | "ai", content: string, timestamp: Date}>>([
    {
      id: "1",
      type: "ai",
      content: `Hello! I'm your AI assistant. I can help you understand this publication: "${publicationTitle}". What would you like to know?`,
      timestamp: new Date(),
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: message.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      let response: string
      
      // Always call Gemini API using the latest conversation history
      const conversationHistory = [...messages, userMessage]
        .slice(-API_CONFIG.MAX_CHAT_HISTORY)
        .map(m => ({ type: m.type, content: m.content }))
      response = await geminiAPI.generateChatResponse(
        publicationTitle,
        publicationAbstract,
        message,
        conversationHistory
      )

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate response")
      console.error("Error in sendMessage:", err)
    } finally {
      setLoading(false)
    }
  }, [messages, publicationTitle, publicationAbstract])

  const clearChat = useCallback(() => {
    setMessages([{
      id: "1",
      type: "ai",
      content: `Hello! I'm your AI assistant. I can help you understand this publication: "${publicationTitle}". What would you like to know?`,
      timestamp: new Date(),
    }])
    setError(null)
  }, [publicationTitle])

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat
  }
}

// Hook for managing knowledge gaps
export function useKnowledgeGaps(): UseKnowledgeGapsResult {
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshGaps = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const cacheKey = "knowledge_gaps"
      const cached = cache.get(cacheKey)
      
      if (cached) {
        setKnowledgeGaps(cached as KnowledgeGap[])
        setLoading(false)
        return
      }

      let results: KnowledgeGap[]
      
      if (API_CONFIG.USE_MOCK_DATA) {
        results = getMockKnowledgeGaps()
      } else {
        results = await geminiAPI.identifyKnowledgeGaps()
      }
      
      cache.set(cacheKey, results, API_CONFIG.CACHE_DURATION.KNOWLEDGE_GAPS)
      setKnowledgeGaps(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch knowledge gaps")
      console.error("Error in refreshGaps:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshGaps()
  }, [refreshGaps])

  return {
    knowledgeGaps,
    loading,
    error,
    refreshGaps
  }
}

// Hook for managing data integrations
export function useDataIntegrations(): UseDataIntegrationsResult {
  const [integrations, setIntegrations] = useState<DataIntegration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshIntegrations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const cacheKey = "data_integrations"
      const cached = cache.get(cacheKey)
      
      if (cached) {
        setIntegrations(cached as DataIntegration[])
        setLoading(false)
        return
      }

      let results: DataIntegration[]
      
      if (API_CONFIG.USE_MOCK_DATA) {
        results = getMockDataIntegrations()
      } else {
        results = await geminiAPI.getDataIntegrations()
      }
      
      cache.set(cacheKey, results, API_CONFIG.CACHE_DURATION.DATA_INTEGRATIONS)
      setIntegrations(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data integrations")
      console.error("Error in refreshIntegrations:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshIntegrations()
  }, [refreshIntegrations])

  return {
    integrations,
    loading,
    error,
    refreshIntegrations
  }
}

// Mock response functions for fallback
function getMockChatResponse(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("main findings") || lowerQuery.includes("findings")) {
    return "The main findings show significant physiological adaptations to microgravity conditions. The study tracked key biomarkers and identified important changes in cellular processes that could impact long-duration spaceflight missions."
  }

  if (lowerQuery.includes("methods") || lowerQuery.includes("methodology")) {
    return "The research methodology involved controlled experiments with proper statistical analysis. The study design included appropriate controls and followed established protocols for space biology research."
  }

  if (lowerQuery.includes("knowledge gaps") || lowerQuery.includes("gaps")) {
    return "Key knowledge gaps identified include long-term effects, individual variation in responses, and optimal countermeasure protocols. Further research is needed to address these limitations."
  }

  if (lowerQuery.includes("future") || lowerQuery.includes("applications")) {
    return "These findings have important implications for future space missions and could inform the development of countermeasures for astronaut health during long-duration flights."
  }

  return "This research contributes valuable insights to our understanding of space biology. The findings help advance our knowledge of how biological systems adapt to the space environment. Is there a specific aspect you'd like to explore further?"
}

function getMockKnowledgeGaps(): KnowledgeGap[] {
  return [
    {
      id: "1",
      title: "Long-term effects of cosmic radiation on neural tissue",
      category: "Radiation biology",
      priority: "High",
      relatedPublications: 12,
      description: "Limited data on cumulative radiation exposure effects beyond 18 months in space.",
    },
    {
      id: "2", 
      title: "Plant reproduction in partial gravity environments",
      category: "Plant biology",
      priority: "Medium",
      relatedPublications: 8,
      description: "Insufficient studies on plant breeding cycles in Mars-like gravity conditions.",
    },
    {
      id: "3",
      title: "Microbiome changes during extended spaceflight",
      category: "Space biology", 
      priority: "High",
      relatedPublications: 15,
      description: "Gap in understanding gut microbiome adaptation over multi-year missions.",
    },
    {
      id: "4",
      title: "Bone density recovery protocols post-mission",
      category: "Bone biology",
      priority: "Medium", 
      relatedPublications: 10,
      description: "Need more data on optimal recovery timelines and interventions.",
    },
  ]
}

function getMockDataIntegrations(): DataIntegration[] {
  return [
    {
      id: "osdr",
      name: "NASA OSDR",
      fullName: "Open Science Data Repository",
      description: "Access to spaceflight and space-relevant omics data",
      status: "connected",
      datasets: 245,
      lastSync: "2 hours ago",
      url: "https://osdr.nasa.gov",
    },
    {
      id: "genelab",
      name: "GeneLab", 
      fullName: "NASA GeneLab Data System",
      description: "Omics database for spaceflight and analog experiments",
      status: "connected",
      datasets: 189,
      lastSync: "5 hours ago",
      url: "https://genelab.nasa.gov",
    },
    {
      id: "taskbook",
      name: "Task Book",
      fullName: "NASA Task Book", 
      description: "Research tasks and project information",
      status: "connected",
      datasets: 312,
      lastSync: "1 day ago",
      url: "https://taskbook.nasaprs.com",
    },
    {
      id: "pubmed",
      name: "PubMed",
      fullName: "PubMed Central",
      description: "Biomedical literature database", 
      status: "available",
      datasets: 0,
      lastSync: null,
      url: "https://pubmed.ncbi.nlm.nih.gov",
    },
  ]
}

