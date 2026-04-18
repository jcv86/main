"use client"

import { useState, useEffect, useRef } from "react"
import { useContextValidation } from "@/lib/hooks/use-context-validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Sparkles, Loader, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  type?: "insight" | "question" | "suggestion"
}

interface A1CoachProps {
  a1Results: any
  pilarActive: string
  missionsCompleted: number
  missionsTotal: number
}

export function A1Coach({ a1Results, pilarActive, missionsCompleted, missionsTotal }: A1CoachProps) {
  const { validateContextRelevance, validationError, clearError } = useContextValidation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSessionId(crypto.randomUUID())
    initializeCoach()
  }, [a1Results, pilarActive])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const initializeCoach = () => {
    const coachName = Math.random() > 0.5 ? "Sofia" : "Dani"
    const pilarName = pilarActive === "energia" ? "Energía" :
                      pilarActive === "enfoque" ? "Enfoque" :
                      pilarActive === "relaciones" ? "Relaciones" : "Plan Ejecutivo"
    
    const welcomeMessage: Message = {
      id: "welcome",
      content: `¡Hola! Soy ${coachName}, tu coach personal. Veo que estás trabajando en ${pilarName}. 

He revisado tu diagnóstico A1 y tengo algunas recomendaciones personalizadas para ti. ¿Qué área te gustaría abordar primero? Podemos hablar sobre:
- Cómo implementar los hábitos
- Estrategias específicas para tu situación
- Cómo mantener la consistencia
- Cualquier desafío que estés enfrentando`,
      sender: "coach",
      timestamp: new Date(),
      type: "insight",
    }
    
    setMessages([welcomeMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    try {
      clearError()
      
      // Validate that response is contextually relevant to A1 diagnosis and pilar
      const pilarName = pilarActive === "energia" ? "Energía" :
                        pilarActive === "enfoque" ? "Enfoque" :
                        pilarActive === "relaciones" ? "Relaciones" : "Plan Ejecutivo"
      const coachContext = `Usuario está trabajando en el pilar de ${pilarName}. Sus resultados A1 indican: ${JSON.stringify(a1Results).substring(0, 200)}. La respuesta debe ser relevante a su diagnóstico y pilar.`
      
      const validation = await validateContextRelevance(
        coachContext,
        input,
        'a1-coach-interactive'
      )

      if (!validation.isRelevant) {
        setError(validation.reason || 'Tu respuesta no está relacionada con tu diagnóstico A1 o el pilar que estás trabajando. Por favor, profundiza en ello.')
        return
      }

      const userMessage: Message = {
        id: Math.random().toString(),
        content: input,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      // Call AI coach endpoint
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: {
            a1Results,
            pilarActive,
            missionsCompleted,
            missionsTotal,
            sessionId,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const coachMessage: Message = {
          id: Math.random().toString(),
          content: data.response,
          sender: "coach",
          timestamp: new Date(),
          type: data.type || "suggestion",
        }
        setMessages(prev => [...prev, coachMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: Math.random().toString(),
        content: "Disculpa, tuve un problema. Intenta de nuevo.",
        sender: "coach",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue/10 text-blue">
                {messages.length > 0 && messages[0].sender === "coach" 
                  ? messages[0].content.includes("Sofia") ? "SF" : "DN"
                  : "🤖"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-base">Tu Coach Personal</div>
              <div className="text-xs text-muted-foreground">
                Misiones: {missionsCompleted}/{missionsTotal}
              </div>
            </div>
          </div>
          <Badge variant="secondary">En vivo</Badge>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-purple text-purple-foreground"
                    : "bg-muted text-foreground border"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.type && message.sender === "coach" && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {message.type === "insight" && "💡 Insight"}
                    {message.type === "suggestion" && "✨ Sugerencia"}
                    {message.type === "question" && "❓ Pregunta"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4 space-y-2">
        {error && (
          <Alert variant="destructive" className="border-red-300 bg-red/5 dark:bg-red/20">
            <AlertTriangle className="h-4 w-4 text-red" />
            <AlertDescription className="text-red dark:text-red/20 ml-2">{error}</AlertDescription>
          </Alert>
        )}

        <Textarea
          placeholder="Pregunta sobre tu progreso, desafíos, o cualquier cosa..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSendMessage()
            }
          }}
          className="resize-none"
          rows={2}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Enviar
        </Button>
      </div>
    </Card>
  )
}
