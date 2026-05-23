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
    <Card className="w-full flex flex-col h-full bg-white dark:bg-muted-950 border border-muted/20 dark:border-muted/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue" />
          Profundización Cognitiva
        </CardTitle>
        <CardDescription>
          Explora variaciones, contextos y tensiones sin etiquetarnos
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Context Summary */}
        <div className="bg-blue/5 dark:bg-blue/30 p-4 rounded-[28px] space-y-3 border border-blue/20 dark:border-blue">
          <div className="font-medium text-blue dark:text-blue/10 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Tu Patrón en A1
          </div>
          <div className="text-sm text-blue dark:text-blue-300 leading-relaxed">{a1Pattern}</div>

          {variantContexts.length > 0 && (
            <div className="pt-2 border-t border-blue/20 dark:border-blue space-y-2">
              <div className="font-medium text-blue dark:text-blue/10 text-sm">Contextos a explorar:</div>
              <div className="flex flex-wrap gap-2">
                {variantContexts.map((context, i) => (
                  <Badge key={i} variant="secondary" className="bg-transparent text-blue dark:text-blue-200 border-blue/20 dark:border-blue">
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
          className="flex-1 space-y-3 overflow-y-auto bg-muted/5 dark:bg-transparent/50 p-4 rounded-[28px] border border-muted/20 dark:border-muted/80"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground dark:text-muted-foreground text-sm space-y-2">
                <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
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
                        ? "bg-blue dark:bg-blue text-white rounded-br-none"
                        : "bg-transparent text-muted/90 dark:text-muted/5 border border-muted/20 dark:border-muted/70 rounded-bl-none"
                    }`}
                  >
                    <div>{msg.content}</div>
                    {msg.type && (
                      <div className={`text-xs mt-1 opacity-70 ${msg.role === "coach" ? "text-blue dark:text-blue/40" : "text-blue/10"}`}>
                        {msg.type}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-transparent text-muted/90 dark:text-muted/5 border border-muted/20 dark:border-muted/70 px-4 py-3 rounded-xl rounded-bl-none">
                    <div className="flex gap-2 items-center">
                      <Loader className="w-4 h-4 animate-spin text-blue dark:text-blue/40" />
                      <span className="text-sm">El Coach reflexiona...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Alert */}
        <Alert className="bg-blue/5 dark:bg-blue/30 border-blue/20 dark:border-blue">
          <AlertCircle className="w-4 h-4 text-blue dark:text-blue/40" />
          <AlertDescription className="text-blue dark:text-blue-300 text-sm">
            A2 expande tu comprensión, no etiqueta. Tus respuestas son tuyas.
          </AlertDescription>
        </Alert>

        {/* Context Validation Error */}
        {error && (
          <Alert variant="destructive" className="border-[rgb(80,160,170)]/30 bg-[rgba(80,160,170,0.5)]/5 dark:bg-[rgba(80,160,170,0.5)]/20">
            <AlertTriangle className="h-4 w-4 text-[rgb(80,160,170)]" />
            <AlertDescription className="text-[rgb(80,160,170)] dark:text-[rgb(80,160,170)]/20 ml-2">{error}</AlertDescription>
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
            className="bg-blue/80 hover:bg-blue/70 dark:bg-blue dark:hover:bg-blue"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
