'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Brain, MessageCircle, Zap, Search, Plus } from 'lucide-react'

export default function MiCoachPage() {
  const [activeTab, setActiveTab] = useState('coaching')
  const [searchQuery, setSearchQuery] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '¡Hola! Soy tu Coach IA Personalizado. Puedo ayudarte en 3 áreas principales: coaching de carrera, búsqueda inteligente de contenido y sugerencias personalizadas basadas en tu perfil de El Ritual.',
      timestamp: new Date(Date.now() - 60000)
    },
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        id: chatMessages.length + 1,
        type: 'user',
        content: newMessage,
        timestamp: new Date()
      }])
      setNewMessage('')
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'assistant',
          content: 'Excelente pregunta. Este es exactamente el tipo de coaching que necesitas. Basándome en tu contexto, te recomendaria...',
          timestamp: new Date()
        }])
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tu Coach IA</h1>
          <p className="text-lg text-foreground/60">Tu coach personal, siempre disponible para ti. Consigue respuestas, estrategias y sugerencias basadas en tu perfil único.</p>
        </div>

        {/* Main Content */}
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

          {/* TAB 1: COACHING 24/7 */}
          <TabsContent value="coaching">
            <Card>
              <CardHeader>
                <CardTitle>Tu Coach Personal IA</CardTitle>
                <CardDescription>Conversación directa para coaching, estrategia y mentoría personalizada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Chat Messages */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 h-96 overflow-y-auto space-y-4">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-sm px-4 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Pregunta a tu coach..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                      Enviar
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Consejos
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Plan
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Estrategia
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Equilibrio
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
                <CardDescription>Búsqueda semántica sobre contenido personalizado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        placeholder="Busca estrategias, libros, conceptos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Buscar</Button>
                  </div>

                  {/* Search Results Placeholder */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-500 mb-4">
                      {searchQuery ? `Buscando: "${searchQuery}"` : 'Empieza a buscar contenido personalizado'}
                    </p>
                    <p className="text-sm text-slate-400">
                      El Cerebro Inteligente busca a través de libros, artículos y estrategias
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: SUGERENCIAS PERSONALIZADAS */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Sugerencias Personalizadas</CardTitle>
                <CardDescription>Ideas y recomendaciones basadas en tu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-900/50 rounded-lg p-6">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      Esta Semana
                    </h3>
                    <p className="text-foreground/80">Basado en tu perfil, te recomendamos practicar escucha activa. Dedica 30 minutos a la estrategia de comunicación.</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-6">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Recurso Recomendado
                    </h3>
                    <p className="text-foreground/80">El libro "Hábitos Atómicos" es perfectamente alineado con tu objetivo de desarrollo.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-900/50 rounded-lg p-6">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      Área de Desarrollo
                    </h3>
                    <p className="text-foreground/80">Tu perfil muestra fortaleza en decisión rápida. Ahora enfócate en desarrollar paciencia analítica.</p>
                  </div>
                </div>
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
            <CardContent className="text-sm text-foreground/70">
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
            <CardContent className="text-sm text-foreground/70">
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
            <CardContent className="text-sm text-foreground/70">
              Ideas y recomendaciones personalizadas basadas en tu perfil.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
