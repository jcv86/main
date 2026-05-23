'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'coach'
  content: string
  timestamp: Date
}

interface A4ContextCoachProps {
  userId?: string
  topicContext?: string
  onMessageSent?: (message: string) => void
}

export function A4ContextCoach({ userId, topicContext = 'Chile news and context', onMessageSent }: A4ContextCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      content:
        '¡Hola! Soy tu Coach de Contexto. Estoy aquí para ayudarte a entender las noticias y conceptos sobre cómo funciona el sistema en Chile. Puedes preguntarme sobre economía, trabajo, noticias del día o cualquier concepto que no entiendas. No hay preguntas tontas, ¡estoy para aclarar!',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setError(null)
    onMessageSent?.(inputValue)

    // Fetch coach response
    setIsLoading(true)
    try {
      const response = await fetch('/api/despega/a4-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          context: topicContext,
          userId,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      let coachResponse = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        coachResponse += chunk

        // Update message as it streams
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.role === 'coach' && lastMessage.id.startsWith('stream-')) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: coachResponse,
              },
            ]
          }
          return [
            ...prev,
            {
              id: 'stream-' + Date.now(),
              role: 'coach',
              content: coachResponse,
              timestamp: new Date(),
            },
          ]
        })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error getting coach response'
      setError(errorMsg)
      console.error('[v0] Coach API error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-purple-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 bg-slate-800/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          Coach de Contexto
        </h2>
        <p className="text-xs text-gray-400 mt-1">Aprende cómo funciona el sistema en Chile</p>
      </div>

      {/* Messages Container */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                  : 'bg-purple-500/10 text-gray-100 border border-purple-500/20'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-xs text-gray-500 mt-1 block">{message.timestamp.toLocaleTimeString('es-CL')}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
              <Loader size={16} className="animate-spin text-purple-400" />
              <span className="text-sm text-gray-400">Coach está pensando...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-200">{error}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/20 bg-slate-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pregunta algo sobre Chile, economía, trabajo..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-slate-700 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Presiona Enter o haz clic en enviar</p>
      </div>
    </div>
  )
}
