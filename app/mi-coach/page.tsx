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
  referenceLinks?: Array<{
    title: string
    url: string
    type: string
  }>
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
        console.log('[v0] Search results received:', { count: data.books?.length, firstBook: data.books?.[0] })
        setSearchResults(data.books || [])
      } else {
        console.error('[v0] Search failed:', response.status)
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
                  <div className="bg-muted/5 dark:bg-background rounded-lg p-6 h-96 overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <p className="text-muted/50">Inicia una conversación con tu coach...</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-sm px-4 py-2 rounded-lg whitespace-pre-wrap ${
                            msg.type === 'user'
                              ? 'bg-purple text-white'
                              : 'bg-white dark:bg-card border border-muted/20'
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
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted/70 dark:text-muted/20">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Preguntas para empezar
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentPrompts.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                            className="text-left p-3 bg-muted/10 dark:bg-card border border-muted/20 dark:border-card rounded-lg hover:bg-purple/5 dark:hover:bg-purple/30 hover:border-purple/40 dark:hover:border-purple/50 transition group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-xs text-muted/90 dark:text-muted/10 group-hover:text-purple dark:group-hover:text-purple-300">{suggestion.title}</p>
                                <p className="text-xs text-muted/60 dark:text-muted/20 mt-1">{suggestion.prompt.slice(0, 40)}...</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted/40 dark:text-muted/50 group-hover:text-purple dark:group-hover:text-purple-400 flex-shrink-0 mt-0.5" />
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
                      className="bg-white dark:bg-slate-950 text-muted/90 dark:text-muted/10 placeholder:text-muted/50 dark:placeholder:text-muted/40"
                    />
                    <Button 
                      onClick={handleChatSubmit} 
                      disabled={chatLoading}
                      className="bg-purple hover:bg-purple dark:bg-purple dark:hover:bg-purple/50 text-white font-semibold px-8 flex-shrink-0 shadow-lg"
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
                      onKeyPress={(e) => e.key === 'Enter' && !searchLoading && handleSearch()}
                      disabled={searchLoading}
                      className="bg-white dark:bg-slate-950 text-muted/90 dark:text-muted/10 placeholder:text-muted/50 dark:placeholder:text-muted/40"
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={searchLoading || !searchQuery.trim()}
                      className="bg-blue hover:bg-blue dark:bg-blue dark:hover:bg-blue/50 text-white font-semibold px-6 flex-shrink-0 shadow-lg"
                    >
                      {searchLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-1" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Results */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <p className="text-muted/50 dark:text-muted/40 text-center py-8">
                        {searchQuery ? 'No se encontraron resultados' : 'Realiza una búsqueda'}
                      </p>
                    ) : (
                      searchResults.map((book) => (
                        <div key={book.id} className="border rounded-lg p-4 hover:bg-muted/5 dark:hover:bg-muted/80 transition">
                          <h3 className="font-bold text-sm text-muted/90 dark:text-muted/10">{book.title}</h3>
                          <p className="text-xs text-muted/60 dark:text-muted/40">{book.author}</p>
                          {book.description && (
                            <p className="text-xs mt-2 text-muted/70 dark:text-muted/30">{book.description.slice(0, 80)}...</p>
                          )}
                          
                          {/* Reference Links */}
                          {book.referenceLinks && book.referenceLinks.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-muted/20 dark:border-card">
                              {book.referenceLinks.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue/5 dark:bg-blue/30 text-blue dark:text-blue/40 border border-blue/20 dark:border-blue/10 rounded hover:bg-blue/10 dark:hover:bg-blue/50 transition"
                                >
                                  {link.type === 'internal' ? '📚' : link.type === 'amazon' ? '🛍️' : link.type === 'goodreads' ? '⭐' : '🔗'}
                                  {link.title}
                                </a>
                              ))}
                            </div>
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
                      <p className="text-muted/50 dark:text-muted/40 text-center py-8">No hay recomendaciones disponibles</p>
                    ) : (
                      recommendations.map((rec) => (
                        <div key={rec.id} className="border rounded-lg p-4 hover:bg-muted/5 dark:hover:bg-muted/80 transition">
                          <h3 className="font-bold text-sm text-muted/90 dark:text-muted/10">{rec.title}</h3>
                          <p className="text-xs text-muted/60 dark:text-muted/40">{rec.author}</p>
                          <p className="text-xs text-purple dark:text-purple/40 mt-2 font-medium">{rec.reason}</p>
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
                <MessageCircle className="w-5 h-5 text-purple" />
                Coaching 24/7
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted/70 dark:text-muted/20">
              Conversaciones ilimitadas sobre tu carrera, estrategia personal y mentoría.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue" />
                Cerebro Inteligente
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted/70 dark:text-muted/20">
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
            <CardContent className="text-sm text-muted/70 dark:text-muted/20">
              Ideas y recomendaciones personalizadas basadas en tu perfil.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

