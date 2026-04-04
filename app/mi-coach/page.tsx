'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Brain, MessageCircle, Zap, Search, Loader2, Lightbulb, ArrowRight } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  rating?: number
  difficulty?: string
  source?: string
}

interface Recommendation {
  id: string
  title: string
  author: string
  reason: string
  rating?: number
}

export default function MiCoachPage() {
  const [activeTab, setActiveTab] = useState('coaching')
  const [mounted, setMounted] = useState(false)

  // Coaching tab state
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant'; content: string }>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Recommendations tab state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recsLoading, setRecsLoading] = useState(true)

  // Mock user profile
  const userProfile = {
    discType: 'D',
    careerStage: 'A2',
    goals: 'Mejorar liderazgo',
  }

  // Sugerencias de preguntas para mejorar según perfil DISC
  const coachPrompts = {
    D: [
      { title: 'Estrategia Rápida', prompt: '¿Cuál es el siguiente paso que debo dar hoy para acelerar mi carrera?' },
      { title: 'Gestión de Equipos', prompt: '¿Cómo puedo ser un mejor líder siendo decisivo pero escuchando a mi equipo?' },
      { title: 'Metas 30 Días', prompt: '¿Cuáles son 3 metas específicas que puedo lograr en 30 días?' },
      { title: 'Resolver Conflictos', prompt: '¿Cómo puedo resolver un conflicto con autoridad pero sin perder relaciones?' },
    ],
    I: [
      { title: 'Influencia Personal', prompt: '¿Cómo puedo desarrollar más influencia en mi organización?' },
      { title: 'Comunicación Efectiva', prompt: '¿Cuáles son las técnicas clave para persuadir y motivar a otros?' },
      { title: 'Red de Contactos', prompt: '¿Cómo puedo construir una red de contactos estratégica?' },
      { title: 'Presentaciones Impactantes', prompt: '¿Cómo hago presentaciones más impactantes y memorables?' },
    ],
    S: [
      { title: 'Trabajo en Equipo', prompt: '¿Cómo puedo contribuir mejor a mis equipos siendo empático?' },
      { title: 'Estabilidad Laboral', prompt: '¿Cómo logro crecimiento sin sacrificar relaciones sólidas?' },
      { title: 'Apoyo a Otros', prompt: '¿Cómo puedo ser un mejor mentor o soporte para mi equipo?' },
      { title: 'Balance Vida-Trabajo', prompt: '¿Cómo mantengo relaciones fuertes mientras avanzo en mi carrera?' },
    ],
    C: [
      { title: 'Excelencia', prompt: '¿Cómo garantizo la máxima calidad en mis entregas?' },
      { title: 'Análisis Estratégico', prompt: '¿Cuáles son los datos clave que debo analizar para tomar mejores decisiones?' },
      { title: 'Mejora Continua', prompt: '¿Cuál es mi plan de mejora personal para los próximos 3 meses?' },
      { title: 'Planificación Detallada', prompt: '¿Cuál es la mejor estrategia para alcanzar mis objetivos a largo plazo?' },
    ],
  }

  const currentPrompts = coachPrompts[userProfile.discType as keyof typeof coachPrompts] || coachPrompts.D

  useEffect(() => {
    setMounted(true)
    // Load recommendations on mount
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      setRecsLoading(true)
      const response = await fetch(`/api/mi-coach/recommendations?profile=${userProfile.discType}&limit=6`)
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('[v0] Error loading recommendations:', error)
    } finally {
      setRecsLoading(false)
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    setChatInput(prompt)
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return

    const userMessage = chatInput
    setChatInput('')
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setChatLoading(true)

    try {
      const response = await fetch('/api/mi-coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          userProfile,
        }),
      })

      if (!response.ok) throw new Error('Chat error')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      let fullContent = ''
      const decoder = new TextDecoder()
      let hasAssistantMessage = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk

        if (!hasAssistantMessage) {
          hasAssistantMessage = true
          setMessages(prev => [...prev, { type: 'assistant', content: fullContent }])
        } else {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { type: 'assistant', content: fullContent }
            return updated
          })
        }
      }
    } catch (error) {
      console.error('[v0] Chat error:', error)
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearchLoading(true)
      const response = await fetch(`/api/mi-coach/search?query=${encodeURIComponent(searchQuery)}&discProfile=${userProfile.discType}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.books || [])
      }
    } catch (error) {
      console.error('[v0] Search error:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tu Coach IA</h1>
          <p className="text-lg text-foreground/60">
            Tu coach personal, siempre disponible. Consigue respuestas, estrategias y sugerencias personalizadas.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="coaching" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Coaching 24/7</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="cerebro" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Cerebro Inteligente</span>
              <span className="sm:hidden">Búsqueda</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Sugerencias</span>
              <span className="sm:hidden">Ideas</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: COACHING */}
          <TabsContent value="coaching">
            <Card>
              <CardHeader>
                <CardTitle>Coaching 24/7</CardTitle>
                <CardDescription>Conversación con tu coach personal de IA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Messages */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 h-96 overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <p className="text-slate-500">Inicia una conversación con tu coach...</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-sm px-4 py-2 rounded-lg whitespace-pre-wrap ${
                            msg.type === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick Suggestions - Mostrar solo si no hay mensajes */}
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Preguntas para empezar
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentPrompts.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                            className="text-left p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-300">{suggestion.title}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-200 mt-1">{suggestion.prompt.slice(0, 40)}...</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex-shrink-0 mt-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2 pt-2">
                    <Input
                      placeholder="Pregunta a tu coach..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !chatLoading && handleChatSubmit()}
                      disabled={chatLoading}
                      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                    <Button 
                      onClick={handleChatSubmit} 
                      disabled={chatLoading}
                      className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-semibold px-8 flex-shrink-0 shadow-lg"
                    >
                      {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: CEREBRO INTELIGENTE */}
          <TabsContent value="cerebro">
            <Card>
              <CardHeader>
                <CardTitle>Cerebro Inteligente</CardTitle>
                <CardDescription>Búsqueda semántica de recursos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Search */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Busca libros, conceptos, estrategias..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                    <Button onClick={handleSearch} disabled={searchLoading} className="bg-blue-600 hover:bg-blue-700">
                      {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Results */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                        {searchQuery ? 'No se encontraron resultados' : 'Realiza una búsqueda'}
                      </p>
                    ) : (
                      searchResults.map((book) => (
                        <div key={book.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{book.title}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{book.author}</p>
                          {book.description && (
                            <p className="text-xs mt-2 text-slate-700 dark:text-slate-300">{book.description.slice(0, 80)}...</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: SUGERENCIAS */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Sugerencias Personalizadas</CardTitle>
                <CardDescription>Basadas en tu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                {recsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recommendations.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">No hay recomendaciones disponibles</p>
                    ) : (
                      recommendations.map((rec) => (
                        <div key={rec.id} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{rec.title}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{rec.author}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">{rec.reason}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Coaching 24/7
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-200">
              Conversaciones ilimitadas sobre tu carrera, estrategia personal y mentoría.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Cerebro Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-200">
              Busca de forma inteligente a través de contenido personalizado.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Sugerencias
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-200">
              Ideas y recomendaciones personalizadas basadas en tu perfil.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

