"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useContextValidation } from "@/lib/hooks/use-context-validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Send, Loader, AlertCircle, AlertTriangle } from "lucide-react"

interface A2ChatCoachProps {
  a1Pattern: string
  variantContexts?: string[]
  internalTensions?: string[]
}

export function A2ChatCoach({
  a1Pattern,
  variantContexts = [],
  internalTensions = [],
}: A2ChatCoachProps) {
  const { validateContextRelevance, validationError, clearError } = useContextValidation()
  const [messages, setMessages] = useState<Array<{ role: "user" | "coach"; content: string; type?: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('[data-messages-container]')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    try {
      setLoading(true)
      clearError()

      // Validate that response is contextually relevant to A1 pattern and A2 context
      const coachContext = `A1 Pattern: ${a1Pattern}. Variant Contexts: ${variantContexts.join(', ')}. Internal Tensions: ${internalTensions.join(', ')}. La respuesta debe ser relevante al patrón A1 y contextos mencionados.`
      const validation = await validateContextRelevance(
        coachContext,
        input,
        'a2-chat-coach'
      )

      if (!validation.isRelevant) {
        setError(validation.reason || 'Tu respuesta no está relacionada con tu patrón A1 o contexto A2. Por favor, profundiza en ello.')
        setLoading(false)
        return
      }

      // Add user message
      const userMessage = input.trim()
      setMessages((prev) => [...prev, { role: "user", content: userMessage }])
      setInput("")

    try {
      const response = await fetch("/api/despega/a2-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: {
            a1Pattern,
            variantContexts,
            internalTensions,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from A2 coach")
      }

      const data = await response.json()

      // Add coach message
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          content: data.response,
          type: data.type,
        },
      ])

      // Show coherence warnings if needed
      if (!data.coherenceCheck.isValid) {
        console.warn("A2 Coach coherence warning:", data.coherenceCheck)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          content: "Disculpa, hubo un error. Intenta nuevamente.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Card className="w-full flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Profundización Cognitiva
        </CardTitle>
        <CardDescription>
          Explora variaciones, contextos y tensiones sin etiquetarnos
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Context Summary */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg space-y-3 border border-blue-200 dark:border-blue-800">
          <div className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Tu Patrón en A1
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{a1Pattern}</div>

          {variantContexts.length > 0 && (
            <div className="pt-2 border-t border-blue-200 dark:border-blue-800 space-y-2">
              <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">Contextos a explorar:</div>
              <div className="flex flex-wrap gap-2">
                {variantContexts.map((context, i) => (
                  <Badge key={i} variant="secondary" className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    {context}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div 
          data-messages-container
          className="flex-1 space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-600 dark:text-slate-400 text-sm space-y-2">
                <MessageCircle className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                <p>Inicia con una pregunta sobre variaciones o contextos de tu patrón</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-700 rounded-bl-none"
                    }`}
                  >
                    <div>{msg.content}</div>
                    {msg.type && (
                      <div className={`text-xs mt-1 opacity-70 ${msg.role === "coach" ? "text-blue-600 dark:text-blue-400" : "text-blue-100"}`}>
                        {msg.type}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl rounded-bl-none">
                    <div className="flex gap-2 items-center">
                      <Loader className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                      <span className="text-sm">El Coach reflexiona...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Alert */}
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            A2 expande tu comprensión, no etiqueta. Tus respuestas son tuyas.
          </AlertDescription>
        </Alert>

        {/* Context Validation Error */}
        {error && (
          <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-200 ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Cómo se manifiesta en otros contextos?"
            disabled={loading}
            className="text-sm"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
