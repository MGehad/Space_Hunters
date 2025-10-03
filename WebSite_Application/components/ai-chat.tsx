"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, AlertCircle, Minimize2, MessageCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { geminiAPI } from "@/lib/gemini-api"
import { API_CONFIG } from "@/lib/api-config"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface AIChatProps {
  className?: string
  initiallyOpen?: boolean
}

export function AIChat({ className = "", initiallyOpen = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI assistant for space biology research. I can help you understand NASA research, find publications, discuss knowledge gaps, and much more. What would you like to explore?",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(!initiallyOpen)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateChatResponse = async (userMessage: string, fullConversationHistory: Message[]): Promise<string> => {
    // In mock mode, use local generator immediately
    if (API_CONFIG.USE_MOCK_DATA) {
      return Promise.resolve(getMockResponse(userMessage, fullConversationHistory))
    }

    try {
      // Convert Message[] to the format expected by the API
      const conversationForAPI = fullConversationHistory
        .slice(-API_CONFIG.MAX_CHAT_HISTORY)
        .map(msg => ({ type: msg.type, content: msg.content }))

      const response = await geminiAPI.generateGeneralChatResponse(userMessage, conversationForAPI)
      return response
    } catch (error) {
      console.error("Error generating chat response:", error)
      // Fallback to local mock response if API fails
      return getMockResponse(userMessage, fullConversationHistory)
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message.trim(),
      timestamp: new Date(),
    }

    // Update messages with user message first
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue("")
    setLoading(true)
    setError(null)

    try {
      // Pass the complete conversation history including the new user message
      const response = await generateChatResponse(userMessage.content, updatedMessages)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response,
        timestamp: new Date(),
      }

        // Add AI response to the conversation
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate response")
      console.error("Error in sendMessage:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    sendMessage(inputValue)
  }

  const clearConversation = () => {
    setMessages([{
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI assistant for space biology research. I can help you understand NASA research, find publications, discuss knowledge gaps, and much more. What would you like to explore?",
      timestamp: new Date(),
    }])
    setError(null)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  // Dynamic quick suggestions based on conversation
  const getQuickSuggestions = () => {
    if (messages.length <= 2) {
      return [
        "What is space biology?",
        "Effects of microgravity on plants",
        "Mars mission research", 
        "Human health in space"
      ]
    }
    
    // Context-aware follow-up suggestions
    const lastUserMessage = messages.filter(m => m.type === "user").slice(-1)[0]?.content.toLowerCase() || ""
    
    if (lastUserMessage.includes("microgravity")) {
      return ["Tell me more about bone loss", "Plant growth experiments", "Muscle atrophy effects"]
    }
    if (lastUserMessage.includes("mars")) {
      return ["Radiation on Mars", "Mars analog studies", "Life support systems"]
    }
    if (lastUserMessage.includes("plant")) {
      return ["VEGGIE experiment", "Oxygen production", "Food security in space"]
    }
    if (lastUserMessage.includes("health") || lastUserMessage.includes("human")) {
      return ["Exercise countermeasures", "Radiation effects", "Psychological impacts"]
    }
    
    return ["Tell me more", "Related research", "What are the challenges?", "Future applications"]
  }

  const quickSuggestions = getQuickSuggestions()

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}>
      <div className="w-[calc(100vw-1.5rem)] h-[70vh] sm:w-96 sm:h-[600px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
              <img src="/logo.png" alt="Space Hunters" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Space Hunters</h3>
              <p className="text-white/60 text-xs">Space Biology Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={clearConversation}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setIsMinimized(true)}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
              title="Minimize chat"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                {message.type === "ai" && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                      <img src="/logo.png" alt="Space Hunters" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white/60 text-xs">Space Hunters</span>
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3 ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 backdrop-blur-md border border-white/20 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${message.type === "user" ? "text-white/70" : "text-white/50"} text-right`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                    <img src="/logo.png" alt="Space Hunters" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white/60 text-xs">Space Hunters</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full text-xs whitespace-nowrap"
                  disabled={loading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="px-4 pb-2">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 flex items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask about space biology..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-8 w-8 p-0 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced mock response function for fallback with conversation awareness
function getMockResponse(query: string, conversationHistory?: Message[]): string {
  const lowerQuery = query.toLowerCase()

  // Check if this is a follow-up question based on conversation history
  const previousTopics = conversationHistory
    ?.filter(msg => msg.type === "user")
    .map(msg => msg.content.toLowerCase())
    .join(" ") || ""

  // Context-aware responses
  if (lowerQuery.includes("more") || lowerQuery.includes("tell me more") || lowerQuery.includes("elaborate")) {
    if (previousTopics.includes("microgravity")) {
      return "Building on our discussion of microgravity: The absence of gravitational force causes fascinating adaptations. For example, in the VEGGIE experiment on the ISS, plants showed altered root growth patterns and different gene expression compared to Earth controls. Astronauts also experience fluid shifts that cause facial puffiness and potential vision changes called SANS (Spaceflight Associated Neuro-ocular Syndrome)."
    }
    if (previousTopics.includes("mars")) {
      return "Continuing our Mars discussion: The reduced gravity (38% of Earth's) presents unique challenges. NASA's Mars analog studies show that this partial gravity might help retain some bone and muscle mass compared to microgravity, but long-term effects remain unknown. Additionally, the radiation environment on Mars requires biological shielding strategies."
    }
    return "I'd be happy to elaborate! Could you specify which aspect of space biology you'd like me to expand on from our previous discussion?"
  }

  // Original topic-based responses with enhancements
  if (lowerQuery.includes("what is space biology") || lowerQuery.includes("space biology")) {
    return "Space biology is the study of how living organisms respond to and survive in the space environment. It encompasses research on microgravity effects, radiation exposure, and the adaptation of plants, animals, and humans to spaceflight conditions. NASA's space biology research includes experiments on the ISS, ground-based analogs, and preparation for deep space missions."
  }

  if (lowerQuery.includes("microgravity") || lowerQuery.includes("weightless")) {
    return "Microgravity profoundly affects biological systems at cellular and systemic levels. Plants exhibit altered gravitropism, bones lose 1-2% density per month, muscles atrophy (especially postural muscles), and cardiovascular deconditioning occurs. NASA's research includes the Tissue Chips in Space initiative and studies on protein crystal growth that could lead to better pharmaceuticals."
  }

  if (lowerQuery.includes("mars") || lowerQuery.includes("red planet")) {
    return "Mars research is critical for future human missions. Key biological challenges include: 38% gravity effects on human physiology, radiation exposure from cosmic rays and solar events, psychological isolation effects, and developing closed-loop life support systems. NASA studies extremophiles and tests equipment in Mars analog environments like the desert research stations."
  }

  if (lowerQuery.includes("plant") || lowerQuery.includes("vegetation") || lowerQuery.includes("agriculture")) {
    return "Plant research in space serves multiple purposes: food production, oxygen generation, CO2 removal, and psychological benefits. Key experiments include VEGGIE (growing lettuce and tomatoes), Advanced Plant Habitat studies, and research on plant gravitropism. Future Mars missions will likely depend on plant-based life support systems."
  }

  if (lowerQuery.includes("human health") || lowerQuery.includes("astronaut") || lowerQuery.includes("health")) {
    return "Human health in space faces multiple challenges: bone loss (1-2% per month), muscle atrophy, cardiovascular deconditioning, radiation exposure, immune system changes, and psychological stress. NASA develops countermeasures including exercise equipment (ARED, treadmill), nutritional supplements, and medical monitoring systems."
  }

  if (lowerQuery.includes("radiation") || lowerQuery.includes("cosmic")) {
    return "Space radiation is a major concern for long-duration missions. Sources include galactic cosmic rays, solar particle events, and trapped radiation belts. Biological effects include DNA damage, increased cancer risk, and potential cognitive impacts. NASA studies radiation shielding, biological countermeasures, and monitoring systems."
  }

  if (lowerQuery.includes("bone") || lowerQuery.includes("muscle")) {
    return "Bone and muscle loss are significant challenges in microgravity. Astronauts lose 1-2% bone density per month, particularly in weight-bearing bones. Muscle atrophy affects postural muscles most severely. Countermeasures include the Advanced Resistive Exercise Device (ARED), bisphosphonate medications, and nutritional interventions."
  }

  // Default contextual response
  return `That's an excellent question about space biology! ${conversationHistory && conversationHistory.length > 2 ? "Building on our conversation, " : ""}NASA conducts extensive research on how living organisms adapt to the space environment. This includes studies on microgravity effects, radiation biology, and developing technologies for long-duration space missions. Would you like to explore a specific aspect in more detail?`
}
