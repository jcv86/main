'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatProps {
  coachType: 'tecnico' | 'liderazgo' | 'cerebro'
  userProfile?: any
}

export function CoachChat({ coachType, userProfile }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          coachType,
          userProfile,
        }),
      })

      if (!response.ok) throw new Error('API error')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let fullContent = ''
      const assistantId = (Date.now() + 1).toString()

      // Add empty assistant message to update as stream comes in
      setMessages(prev => [...prev, {
        id: assistantId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk

        // Update assistant message with streamed content
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
        )
      }
    } catch (error) {
      console.error('[v0] Chat error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = {
    tecnico: [
      'Consejos de Entrevista',
      'Plan de Desarrollo',
      'Estrategia Laboral',
      'Equilibrio Trabajo/Vida',
    ],
    liderazgo: [
      'Gestión de Equipos',
      'Comunicación Efectiva',
      'Estrategia Profesional',
      'Inteligencia Emocional',
    ],
    cerebro: [
      'Recursos Técnicos',
      'Libros Recomendados',
      'Estrategias de Aprendizaje',
      'Herramientas Útiles',
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {coachType === 'tecnico' && 'Coach Técnico'}
          {coachType === 'liderazgo' && 'Coach de Liderazgo'}
          {coachType === 'cerebro' && 'Cerebro Inteligente'}
        </CardTitle>
        <CardDescription>
          {coachType === 'tecnico' && 'Desarrollo técnico, carrera y productividad'}
          {coachType === 'liderazgo' && 'Liderazgo, equipos y comunicación'}
          {coachType === 'cerebro' && 'Búsqueda semántica de recursos'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chat Messages */}
          <div className="bg-muted/5 dark:bg-transparent rounded-[28px] p-6 h-96 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="text-muted-foreground mb-2">
                    {coachType === 'tecnico' && '¡Hola! Soy tu Coach Técnico'}
                    {coachType === 'liderazgo' && '¡Hola! Soy tu Coach de Liderazgo'}
                    {coachType === 'cerebro' && '¡Hola! Soy el Cerebro Inteligente'}
                  </p>
                  <p className="text-sm text-muted-foreground">Comienza a hacer una pregunta...</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm px-4 py-2 rounded-lg whitespace-pre-wrap ${
                      msg.type === 'user'
                        ? 'bg-purple text-white'
                        : 'bg-transparent border border-muted/20 dark:border-muted/70'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-transparent border border-muted/20 dark:border-muted/70 px-4 py-2 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Pregunta a tu coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-purple/80 hover:bg-purple/70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions[coachType].map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(action)
                }}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {action}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
