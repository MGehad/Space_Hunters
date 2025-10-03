import { API_CONFIG } from "./api-config"
import { Publication } from "./mock-data"

// REST endpoint base
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta"

async function generateContentREST(prompt: string): Promise<string> {
  const url = `${GEMINI_BASE}/models/${API_CONFIG.GEMINI_MODEL}:generateContent`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_CONFIG.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`Gemini error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
}

export interface GeminiPublication extends Publication {
  abstract: string
  authors: string[]
  journal: string
  doi: string
  osdrId?: string
  taskBookId?: string
  relatedStudies: string[]
}

export interface KnowledgeGap {
  id: string
  title: string
  category: string
  priority: "High" | "Medium" | "Low"
  relatedPublications: number
  description: string
  suggestedResearch?: string[]
}

export interface DataIntegration {
  id: string
  name: string
  fullName: string
  description: string
  status: "connected" | "available" | "error"
  datasets: number
  lastSync: string | null
  url: string
  apiEndpoint?: string
}

export class GeminiAPIService {
  private static instance: GeminiAPIService

  private constructor() {}

  public static getInstance(): GeminiAPIService {
    if (!GeminiAPIService.instance) {
      GeminiAPIService.instance = new GeminiAPIService()
    }
    return GeminiAPIService.instance
  }

  // Generate publications based on search query and filters
  async searchPublications(
    query: string = "",
    category: string = "",
    limit: number = 20
  ): Promise<GeminiPublication[]> {
    try {
      const prompt = `Generate ${limit} realistic space biology research publications based on the following criteria:
      - Search query: "${query}"
      - Category filter: "${category}"
      
      Each publication should include:
      - Unique ID (string)
      - Realistic title related to space biology research
      - Category (one of: "Space biology", "Plant biology", "Radiation biology", "Bone biology", "Mechanobiology", "Human health", "Mars research", "COVID-19")
      - Subcategory (specific research area within the category)
      - Publication year (2010-2024)
      - Abstract (2-3 sentences describing the research)
      - Authors (2-4 realistic names)
      - Journal name
      - DOI (realistic format)
      - Optional OSDR ID
      - Optional Task Book ID
      - Related study IDs (2-3 IDs that could reference other publications)
      - Random isViewed and isFavorite boolean flags
      
      Return as a JSON array of publications. Make the content scientifically accurate and relevant to NASA space biology research.`

      const text = await generateContentREST(prompt)
      
      // Parse the JSON response
      try {
        const json = extractFirstJson(text)
        const publications = JSON.parse(json)
        return Array.isArray(publications) ? publications : []
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError)
        return []
      }
    } catch (error) {
      console.error("Error fetching publications from Gemini:", error)
      return []
    }
  }

  // Get detailed information about a specific publication
  async getPublicationDetails(publicationId: string, title: string): Promise<GeminiPublication | null> {
    try {
      const prompt = `Generate detailed information for a space biology research publication with the following:
      - ID: "${publicationId}"
      - Title: "${title}"
      
      Provide a complete publication object with:
      - All basic fields (id, title, category, subcategory, year)
      - Detailed abstract (4-5 sentences)
      - Complete author list with affiliations
      - Journal information
      - DOI
      - OSDR ID if applicable
      - Task Book ID if applicable
      - 3-5 related study IDs
      - Realistic metadata
      
      Return as a single JSON object representing the publication.`

      const text = await generateContentREST(prompt)
      
      try {
        const json = extractFirstJson(text)
        const publication = JSON.parse(json)
        return publication
      } catch (parseError) {
        console.error("Failed to parse publication details:", parseError)
        return null
      }
    } catch (error) {
      console.error("Error fetching publication details:", error)
      return null
    }
  }

  // Generate chat responses for publication discussions
  async generateChatResponse(
    publicationTitle: string,
    publicationAbstract: string,
    userMessage: string,
    conversationHistory: Array<{type: "user" | "ai", content: string}>
  ): Promise<string> {
    try {
      const historyText = conversationHistory
        .map(msg => `${msg.type.toUpperCase()}: ${msg.content}`)
        .join("\n")

      const prompt = `You are an AI assistant specialized in space biology research. You're discussing the publication:
      Title: "${publicationTitle}"
      Abstract: "${publicationAbstract}"
      
      Conversation history:
      ${historyText}
      
      User's current message: "${userMessage}"
      
      Provide a helpful, scientifically accurate response about this publication. Be conversational but informative. If the user asks about specific aspects like methodology, findings, implications, or knowledge gaps, provide detailed insights based on the publication context.`

      const text = await generateContentREST(prompt)
      return text
    } catch (error) {
      console.error("Error generating chat response:", error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    }
  }

  // Identify knowledge gaps in space biology research
  async identifyKnowledgeGaps(): Promise<KnowledgeGap[]> {
    try {
      const prompt = `Identify 8-12 current knowledge gaps in space biology research that NASA should prioritize. For each gap, provide:
      - Unique ID
      - Clear, specific title
      - Category (matching space biology research areas)
      - Priority level (High/Medium/Low)
      - Number of related publications (realistic count)
      - Description explaining why this is a gap
      - Suggested research directions (optional array)
      
      Focus on realistic gaps such as:
      - Long-term effects of space radiation
      - Plant reproduction in partial gravity
      - Microbiome changes during extended missions
      - Bone density recovery protocols
      - Neural adaptation mechanisms
      - Pharmaceutical stability in space
      - Closed-loop life support systems
      
      Return as a JSON array of knowledge gap objects.`

      const text = await generateContentREST(prompt)
      
      try {
        const json = extractFirstJson(text)
        const gaps = JSON.parse(json)
        return Array.isArray(gaps) ? gaps : []
      } catch (parseError) {
        console.error("Failed to parse knowledge gaps:", parseError)
        return []
      }
    } catch (error) {
      console.error("Error identifying knowledge gaps:", error)
      return []
    }
  }

  // Get data integration status and information
  async getDataIntegrations(): Promise<DataIntegration[]> {
    try {
      const prompt = `Generate information about NASA space biology data integration sources. Include both real and potential integrations:
      
      Real sources to include:
      - NASA OSDR (Open Science Data Repository)
      - GeneLab (NASA GeneLab Data System)
      - NASA Task Book
      - PubMed Central
      
      Additional potential sources:
      - ESA Life Sciences Data
      - JAXA Biological Research Data
      - ISS Research Integration Office
      
      For each integration, provide:
      - Unique ID
      - Name and full name
      - Description of what data it provides
      - Status (connected/available/error)
      - Number of datasets (realistic)
      - Last sync time (or null if not connected)
      - URL
      - Optional API endpoint
      
      Return as a JSON array of data integration objects.`

      const text = await generateContentREST(prompt)
      
      try {
        const json = extractFirstJson(text)
        const integrations = JSON.parse(json)
        return Array.isArray(integrations) ? integrations : []
      } catch (parseError) {
        console.error("Failed to parse data integrations:", parseError)
        return []
      }
    } catch (error) {
      console.error("Error fetching data integrations:", error)
      return []
    }
  }

  // Get recently viewed publications (simulated based on user behavior)
  async getRecentlyViewed(): Promise<GeminiPublication[]> {
    try {
      const prompt = `Generate 5 recently viewed space biology publications that would be typical for a researcher. Include diverse topics:
      - Human health effects in space
      - Plant growth experiments
      - Microbial behavior studies
      - Neural adaptation research
      - DNA/genetic studies
      
      Each should have complete publication data including abstracts, authors, and metadata.
      Return as a JSON array.`

      const text = await generateContentREST(prompt)
      
      try {
        const json = extractFirstJson(text)
        const publications = JSON.parse(json)
        return Array.isArray(publications) ? publications : []
      } catch (parseError) {
        console.error("Failed to parse recently viewed:", parseError)
        return []
      }
    } catch (error) {
      console.error("Error fetching recently viewed:", error)
      return []
    }
  }

  // Get category-specific publications for the home page
  async getFeaturedPublications(categories: string[]): Promise<{[key: string]: GeminiPublication[]}> {
    try {
      const prompt = `Generate featured publications for the following categories: ${categories.join(", ")}
      
      For each category, provide 3-4 high-quality, representative publications.
      Return as a JSON object where keys are category names and values are arrays of publications.`

      const text = await generateContentREST(prompt)
      
      try {
        const json = extractFirstJson(text)
        const featured = JSON.parse(json)
        return featured || {}
      } catch (parseError) {
        console.error("Failed to parse featured publications:", parseError)
        return {}
      }
    } catch (error) {
      console.error("Error fetching featured publications:", error)
      return {}
    }
  }

  // Generate general chat responses for space biology topics
  async generateGeneralChatResponse(
    userMessage: string,
    conversationHistory: Array<{type: "user" | "ai", content: string}>
  ): Promise<string> {
    try {
      // Format conversation history for better context
      const historyText = conversationHistory
        .filter(msg => msg.content.trim()) // Remove empty messages
        .map(msg => `${msg.type.toUpperCase()}: ${msg.content}`)
        .join("\n")

      // Create a comprehensive prompt with full conversation context
      const prompt = `You are an AI assistant specialized in NASA space biology research. You are an expert in space biology, astrobiology, microgravity effects, space medicine, and related fields.

IMPORTANT: Use the full conversation history below to provide contextual, relevant responses. Reference previous parts of the conversation when appropriate. Avoid repeating information unless specifically asked.

FULL CONVERSATION HISTORY:
${historyText}

CURRENT USER MESSAGE: "${userMessage}"

Guidelines for your response:
1. Consider the entire conversation context when responding
2. Provide specific, detailed answers based on the user's question
3. If this follows up on a previous topic, build upon that discussion
4. Use scientific accuracy and cite NASA research when relevant
5. Be conversational but informative
6. If asked for examples, provide specific ones from space biology research
7. Reference previous messages in the conversation when relevant

Topics you excel at:
- Microgravity effects on biological systems
- Space radiation biology and protection
- Plant biology and agriculture in space
- Human physiology in space environments
- Bone and muscle health in space
- Cardiovascular changes in microgravity
- Psychological aspects of space missions
- Mars mission biology challenges
- ISS experiments and findings
- NASA GeneLab and OSDR data
- Space medicine countermeasures
- Astrobiology and life detection
- Closed-loop life support systems

Respond naturally and contextually based on the conversation flow:`

      const text = await generateContentREST(prompt)
      return text
    } catch (error) {
      console.error("Error generating general chat response:", error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    }
  }
}

// Export singleton instance
export const geminiAPI = GeminiAPIService.getInstance()

// Utility: extract first valid JSON substring, stripping code fences if present
function extractFirstJson(text: string): string {
  const cleaned = text
    .replace(/^```(json)?/gi, "")
    .replace(/```$/g, "")
    .trim()

  // Fast path: already valid JSON object/array
  if ((cleaned.startsWith("{") && cleaned.endsWith("}")) || (cleaned.startsWith("[") && cleaned.endsWith("]"))) {
    return cleaned
  }

  // Find first JSON object or array by balancing braces/brackets
  const candidates: Array<{start: number; end: number}> = []
  const openers = ['{', '[']
  const closers: Record<string, string> = { '{': '}', '[': ']' }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (openers.includes(ch)) {
      const closer = closers[ch]
      let depth = 0
      for (let j = i; j < text.length; j++) {
        const cj = text[j]
        if (cj === ch) depth++
        if (cj === closer) {
          depth--
          if (depth === 0) {
            candidates.push({ start: i, end: j + 1 })
            break
          }
        }
      }
    }
  }
  if (candidates.length > 0) {
    return text.slice(candidates[0].start, candidates[0].end)
  }
  return text
}

