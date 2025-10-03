"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePublicationDetails, useChat } from "@/hooks/use-gemini-api"

const quickSuggestions = ["Main findings", "Research methods", "Knowledge gaps", "Future applications"]

export default function ChatPage({ params }: { params: { id: string } }) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { publication, loading: publicationLoading, error: publicationError, fetchPublication } = usePublicationDetails()
  const { messages, loading: chatLoading, error: chatError, sendMessage } = useChat(
    publication?.title || "",
    publication?.abstract || ""
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    fetchPublication(params.id)
  }, [params.id, fetchPublication])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return
    await sendMessage(content)
    setInputValue("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  if (publicationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden flex flex-col">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col h-screen">
          <AppHeader showBackButton backHref={`/publications/${params.id}`} />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading publication...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (publicationError || !publication) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden flex flex-col">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col h-screen">
          <AppHeader showBackButton backHref={`/publications/${params.id}`} />
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 max-w-md">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error loading publication</span>
              </div>
              <p className="text-red-300">{publicationError || "Publication not found"}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#2d1b4e] relative overflow-hidden flex flex-col">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col h-screen">
        <AppHeader showBackButton backHref={`/publications/${params.id}`} />

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                {message.type === "ai" && (
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/logo.png" alt="Space Hunters" className="w-6 h-6 rounded-full border border-white/20" />
                    <span className="text-white/60 text-xs">Space Hunters</span>
                  </div>
                )}

                <div
                  className={`rounded-2xl p-4 ${
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

          {chatLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/logo.png" alt="Space Hunters" className="w-6 h-6 rounded-full border border-white/20" />
                  <span className="text-white/60 text-xs">Space Hunters</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
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
          <div className="px-6 pb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full text-xs whitespace-nowrap"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {chatError && (
          <div className="px-6 pb-3">
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{chatError}</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 pb-6 pt-3 bg-gradient-to-t from-[#0a1628] to-transparent">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }
              }}
              placeholder="Ask a question about this publication…"
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || chatLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 w-10 p-0 flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
