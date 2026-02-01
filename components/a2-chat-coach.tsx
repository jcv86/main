"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Send, Loader, AlertCircle } from "lucide-react"

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
  const [messages, setMessages] = useState<Array<{ role: "user" | "coach"; content: string; type?: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    // Add user message
    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setLoading(true)

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
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-600" />
            A2 – Profundización Cognitiva
          </CardTitle>
          <CardDescription>
            Exploramos matices y contextos del patrón identificado sin etiquetar
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Context Summary */}
          <div className="bg-amber-50 p-3 rounded-lg text-sm space-y-2">
            <div className="font-medium text-amber-900">Patrón de A1:</div>
            <div className="text-amber-800">{a1Pattern}</div>

            {variantContexts.length > 0 && (
              <>
                <div className="font-medium text-amber-900 mt-2">Contextos explorables:</div>
                <div className="flex flex-wrap gap-1">
                  {variantContexts.map((context, i) => (
                    <Badge key={i} variant="outline" className="bg-white">
                      {context}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Messages */}
          <div className="space-y-3 max-h-96 overflow-y-auto bg-slate-50 p-3 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-6">
                Pregunta sobre variaciones, contextos o tensiones del patrón
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-slate-900 border border-slate-200"
                    }`}
                  >
                    <div>{msg.content}</div>
                    {msg.type && (
                      <div className="text-xs mt-1 opacity-60">
                        [{msg.type}]
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-900 border border-slate-200 p-3 rounded-lg">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Coherence Warning */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              A2 busca profundizar sin etiquetar. No son diagnósticos ni definiciones de quién eres.
            </AlertDescription>
          </Alert>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Cómo se manifiesta este patrón en otros contextos?"
              disabled={loading}
              className="text-sm"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
