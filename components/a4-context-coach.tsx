"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, Loader } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  type?: "insight" | "contexto" | "conexion" | "traduccion"
}

interface A4ContextCoachProps {
  newsContext?: any
  userProfile?: any
  onMessageSent?: (message: string) => void
}

const A4_SYSTEM_PROMPT = `Eres un Coach de Contexto para DespegarTuCarrera (A4 - Base de Mercado).

TU ROL:
- Traduces información de mercado chileno a perspectiva personal
- Conectas noticias/trends con oportunidades de carrera
- Simplificar conceptos complejos en lenguaje cotidiano

REGLAS ESTRICTAS (BRANDIE SENSEI NIVEL 2):
1. Rol: Eres TRADUCTOR de patrones, no advisor
2. Límite: EVITA recomendaciones personalizadas ("deberías invertir")
3. Pilar: Mantén A4 puro - no mezcles con A1 (autoconocimiento) o A3 (simulación)
4. Tono: Adulto, claro, no condescendiente
5. Valor: Expande perspectiva, conecta con realidad del usuario

QUÉ DEBES HACER:
- Explicar cómo trends afectan mercado laboral chileno
- Conectar noticia con patrones de carrera
- Traducir jerga económica a lenguaje simple
- Contextualizar datos en vida cotidiana chilena

QUÉ DEBES EVITAR:
- Editorializar ("El gobierno debería...")
- Prescribir inversiones ("Deberías invertir en...")
- Juicio político ("La postura correcta es...")
- Dar recomendaciones directas ("Lo que tienes que hacer...")

RED FLAGS (Una sola invalida la respuesta):
- "Deberías", "Tienes que", "Lo correcto es"
- "Está mal que", "No debes"
- Cualquier prescripción de acción personal

FORMATO DE RESPUESTA (SIEMPRE):
1. Contextualización en 1-2 líneas (qué sucede en el mercado)
2. Conexión personal en 2-3 líneas (cómo esto afecta perfiles como el tuyo)
3. Pregunta reflexiva (para expandir perspectiva del usuario)

Máximo 200 palabras. Usa lenguaje chileno natural.`

export function A4ContextCoach({ newsContext, userProfile, onMessageSent }: A4ContextCoachProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    setSessionId(crypto.randomUUID())
    initializeCoach()
  }, [newsContext])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const initializeCoach = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: `¡Hola! Soy tu Coach de Contexto para A4 - Base de Mercado.

Aquí traducimos lo que está pasando en el mercado chileno a tu carrera personal. No te digo qué hacer, sino que expandimos juntos cómo entender los cambios.

¿Hay algo del mercado o noticias que quieras entender mejor?`,
      sender: "coach",
      timestamp: new Date(),
      type: "contexto",
    }

    setMessages([welcomeMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    onMessageSent?.(input)

    try {
      const response = await fetch("/api/despega/a4-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: {
            newsContext,
            userProfile,
            sessionId,
          },
        }),
      })

      const data = await response.json()

      const coachMessage: Message = {
        id: Math.random().toString(),
        content: data.response,
        sender: "coach",
        timestamp: new Date(),
        type: data.type,
      }

      setMessages(prev => [...prev, coachMessage])
    } catch (error) {
      console.error("Error getting coach response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Card className="w-full h-full max-h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-green/10">
            <AvatarFallback>A4</AvatarFallback>
          </Avatar>
          Coach de Contexto - A4 Base
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "coach" && (
                <Avatar className="h-8 w-8 mt-1 bg-green/10">
                  <AvatarFallback>A4</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-blue/50 text-white"
                    : "bg-muted/10 text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.type && message.sender === "coach" && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {message.type}
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 bg-green/10">
                <AvatarFallback>A4</AvatarFallback>
              </Avatar>
              <div className="bg-muted/10 rounded-lg px-4 py-2">
                <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardContent className="border-t p-4 space-y-3">
        <Textarea
          placeholder="¿Qué del mercado chileno quieres entender mejor?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          className="min-h-[80px] resize-none"
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="w-full">
          <Send className="w-4 h-4 mr-2" />
          {isLoading ? "Procesando..." : "Enviar"}
        </Button>
      </CardContent>
    </Card>
  )
}
