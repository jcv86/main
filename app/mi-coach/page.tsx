'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, MessageCircle, Zap } from 'lucide-react'
import { CoachChat } from '@/components/coach-chat'
import { CoachSearch } from '@/components/coach-search'
import { CoachRecommendations } from '@/components/coach-recommendations'

// Mock user profile - in production this would come from user auth/session
const mockUserProfile = {
  discType: 'D',
  careerStage: 'A2',
  goals: 'Mejorar liderazgo y comunicación',
  painPoints: 'Gestión de equipos',
}

export default function MiCoachPage() {
  const [activeTab, setActiveTab] = useState('coaching')
  const [userProfile, setUserProfile] = useState(mockUserProfile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // In production: fetch user profile from session/database
    // const profile = await fetchUserProfile()
    // setUserProfile(profile)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tu Coach IA</h1>
          <p className="text-lg text-foreground/60">
            Tu coach personal, siempre disponible para ti. Consigue respuestas, estrategias y sugerencias basadas en tu perfil único.
          </p>
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
            <CoachChat coachType="tecnico" userProfile={userProfile} />
          </TabsContent>

          {/* TAB 2: CEREBRO INTELIGENTE */}
          <TabsContent value="cerebro">
            <CoachSearch userProfile={userProfile} />
          </TabsContent>

          {/* TAB 3: SUGERENCIAS PERSONALIZADAS */}
          <TabsContent value="insights">
            <CoachRecommendations userProfile={userProfile} />
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              Coaching 24/7
            </h3>
            <p className="text-sm text-foreground/70">
              Conversaciones ilimitadas sobre tu carrera, estrategia personal y mentoría. Tu coach está siempre disponible.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Cerebro Inteligente
            </h3>
            <p className="text-sm text-foreground/70">
              Busca de forma inteligente a través de contenido personalizado. Encuentra exactamente lo que necesitas rápidamente.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Sugerencias
            </h3>
            <p className="text-sm text-foreground/70">
              Ideas y recomendaciones personalizadas basadas en tu perfil único de El Ritual y tu progreso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
