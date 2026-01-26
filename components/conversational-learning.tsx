'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, BookOpen, Target, Brain, ArrowRight, Lightbulb } from 'lucide-react'
import { useSession } from '@/components/session-wrapper'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  id: string
  content: string
  sender: 'user' | 'coach'
  timestamp: Date
  type?: 'message' | 'recommendation' | 'insight' | 'options'
  options?: Array<{
    id: string
    label: string
    description: string
  }>
  selectedOptionId?: string
}

const PHASE_INFO = {
  greeting: {
    title: 'Bienvenido',
    description: 'Conozcámonos',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
  },
  exploration: {
    title: 'Explorando',
    description: 'Descubriendo tus intereses',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
  },
  recommendations: {
    title: 'Recomendaciones',
    description: 'Personalizadas para ti',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
  },
  planning: {
    title: 'Plan de Aprendizaje',
    description: 'Tu ruta personalizada',
    icon: Target,
    color: 'from-orange-500 to-red-500',
  },
}

export function ConversationalLearning() {
  const { user } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState<'greeting' | 'exploration' | 'recommendations' | 'planning'>('greeting')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        content: 'Hola 👋 Soy tu Coach de Aprendizaje Personalizado. En lugar de hacer preguntas tradicionales, vamos a tener una conversación natural sobre tus intereses, metas y estilo de aprendizaje.\n\n¿Por qué no comenzamos? Cuéntame... ¿hay algún área específica de desarrollo o crecimiento en la que te gustaría enfocarte?',
        sender: 'coach',
        timestamp: new Date(),
        type: 'message'
      }
      setMessages([greeting])
    }
  }, [])

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
  }, [messages])

  const parseOptionsFromContent = (content: string): { text: string; options: Message['options'] } => {
    const optionPattern = /\*\s*(?:Opción|Option)\s+([A-Z]):\s*(.+?)(?=\n\*\s*(?:Opción|Option)|$)/gs
    const matches = [...content.matchAll(optionPattern)]
    
    if (matches.length >= 3) {
      const firstOptionIndex = content.indexOf('*')
      const mainText = content.substring(0, firstOptionIndex).trim()
      const options = matches.map((match, idx) => ({
        id: `option-${String.fromCharCode(65 + idx)}`,
        label: `Opción ${String.fromCharCode(65 + idx)}`,
        description: match[2].trim()
      }))
      return { text: mainText, options }
    }
    
    return { text: content, options: undefined }
  }

  const handleOptionSelected = async (optionId: string, messageId: string, description: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, selectedOptionId: optionId }
        : msg
    ))

    const selectionMessage = `He elegido: ${description}`
    const userMessage: Message = {
      id: (Date.now() + 100).toString(),
      content: selectionMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/conversational-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: selectionMessage,
          conversationHistory: [...messages, userMessage],
          userId: user?.id || 'demo',
          email: user?.email,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch response')
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const coachMessageId = (Date.now() + 101).toString()
      let fullContent = ''

      const coachMessage: Message = {
        id: coachMessageId,
        content: '',
        sender: 'coach',
        timestamp: new Date(),
        type: 'message',
      }
      setMessages(prev => [...prev, coachMessage])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullContent += chunk
        const { text, options } = parseOptionsFromContent(fullContent)
        setMessages(prev => prev.map(msg =>
          msg.id === coachMessageId
            ? {
                ...msg,
                content: text,
                type: options ? 'options' : 'message',
                options
              }
            : msg
        ))
      }
    } catch (error) {
      console.error('Error processing option:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('[v0] Sending message to API:', { userMessage: input.substring(0, 50), messagesCount: messages.length })

      const response = await fetch('/api/conversational-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: input,
          conversationHistory: messages,
          userId: user?.id || 'demo',
          email: user?.email,
        }),
      })

      console.log('[v0] Response received:', { status: response.status, ok: response.ok })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[v0] Response error:', errorText)
        throw new Error(`Failed to fetch response (${response.status}): ${errorText}`)
      }
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const coachMessageId = (Date.now() + 1).toString()
      let fullContent = ''

      const coachMessage: Message = {
        id: coachMessageId,
        content: '',
        sender: 'coach',
        timestamp: new Date(),
        type: 'message',
      }
      setMessages(prev => [...prev, coachMessage])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullContent += chunk
        const { text, options } = parseOptionsFromContent(fullContent)
        setMessages(prev => prev.map(msg =>
          msg.id === coachMessageId
            ? {
                ...msg,
                content: text,
                type: options ? 'options' : 'message',
                options
              }
            : msg
        ))
      }

      const newMessageCount = messages.filter((m: any) => m.sender === 'user').length + 1
      let nextPhase: typeof selectedPhase = 'greeting'
      if (newMessageCount >= 1) nextPhase = 'exploration'
      if (newMessageCount >= 3) nextPhase = 'recommendations'
      if (newMessageCount >= 5) nextPhase = 'planning'
      setSelectedPhase(nextPhase)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Disculpa, hubo un error. Por favor intenta de nuevo.',
        sender: 'coach',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const phaseData = PHASE_INFO[selectedPhase]
  const PhaseIcon = phaseData.icon

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header con fase actual */}
      <div className={`bg-gradient-to-r ${phaseData.color} text-white p-4 md:p-6 shadow-lg`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PhaseIcon className="w-6 h-6 md:w-8 md:h-8" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{phaseData.title}</h1>
              <p className="text-white/80 text-sm md:text-base">{phaseData.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs md:text-sm">Mensajes: {messages.length}</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {message.sender === 'coach' && (
                <div className="flex gap-3 max-w-xs md:max-w-md lg:max-w-lg w-full">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-2xl p-4 md:p-5 ${
                      message.type === 'recommendation'
                        ? 'bg-emerald-50 border-2 border-emerald-200'
                        : 'bg-white/80 border border-primary/20 shadow-sm'
                    } backdrop-blur-sm`}>
                      <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>

                    {/* Opciones */}
                    {message.type === 'options' && message.options && (
                      <div className="mt-4 space-y-2">
                        {message.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelected(option.id, message.id, option.description)}
                            disabled={isLoading || message.selectedOptionId !== undefined}
                            className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 ${
                              message.selectedOptionId === option.id
                                ? 'bg-emerald-100 border-emerald-400 shadow-md'
                                : message.selectedOptionId
                                ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-primary/30 hover:border-primary hover:shadow-md cursor-pointer'
                            }`}
                          >
                            <div className="font-semibold text-xs md:text-sm text-primary mb-1">{option.label}</div>
                            <div className="text-xs md:text-sm text-foreground">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {message.sender === 'user' && (
                <div className="max-w-xs md:max-w-md lg:max-w-lg">
                  <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white p-4 md:p-5 shadow-lg">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
                </div>
                <div className="bg-white/80 rounded-2xl p-4 md:p-5 shadow-sm backdrop-blur-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-primary/10 p-4 md:p-6 shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e as any)
              }
            }}
            placeholder="Cuéntame qué te gustaría aprender..."
            className="min-h-12 md:min-h-14 resize-none border-primary/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl h-12 md:h-14 px-4 md:px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
