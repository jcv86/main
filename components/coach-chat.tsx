'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, MessageCircle, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CoachChatProps {
  currentStage?: 'a1' | 'a2' | 'a3' | 'a4'
  discProfile?: string
}

export function CoachChat({ currentStage = 'a1', discProfile }: CoachChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/coach-ia',
    body: {
      stage: currentStage,
      disc_profile: discProfile
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!mounted) return null

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-96 h-[600px] flex flex-col shadow-xl z-50 bg-white dark:bg-slate-950">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600">
            <div>
              <h3 className="font-bold text-white">Coach IA Despega</h3>
              <p className="text-xs text-purple-100">Aquí en {currentStage.toUpperCase()}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageCircle className="w-12 h-12 text-purple-300 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  ¡Hola! Soy tu Coach IA. Pregúntame lo que necesites sobre tu transformación.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm',
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white ml-auto'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 items-center text-slate-600 dark:text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Coach está pensando...</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
            className="p-4 border-t flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Pregunta algo..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 right-4 z-40 rounded-full p-4 shadow-lg hover:scale-110 transition-transform',
          isOpen
            ? 'bg-slate-200 dark:bg-slate-800'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  )
}
