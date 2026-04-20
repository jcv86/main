'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Radar, Brain, BookOpen, Award, Briefcase } from 'lucide-react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { ExecutiveDashboard } from '@/components/executive-dashboard'
import { A4GamifiedTests } from '@/components/a4-gamified-tests'
import { A4Biblioteca } from '@/components/a4-biblioteca'
import { LinkedInProfileCard } from '@/components/linkedin/linkedin-profile-card'
import { JobRecommendationsCard } from '@/components/linkedin/job-recommendations-card'
import { MarketInsightsCard } from '@/components/linkedin/market-insights-card'
import { PersonalizedRadarSystem } from '@/components/personalized-radar-system'

export default function A4Page() {
  const { user, loading } = useAuthRedirect()
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    if (loading || !user?.id) return
    console.log('[v0] A4 page accessed by user:', user.id)
  }, [user?.id, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/despega">
            <Button variant="ghost" size="sm" className="hover:bg-muted/20 dark:hover:bg-muted/70">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Badge className="bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-200">
            A4: La Realidad
          </Badge>
        </div>

        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance bg-background">
            Tu Dashboard Ejecutivo
          </h1>
          <p className="text-xl text-muted-foreground dark:text-white/85 mb-2">
            Coach IA 24/7 • Contexto de Mercado • Decisiones Estratégicas
          </p>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Monitorea tu progreso, descubre oportunidades y desarrolla criterio laboral
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 gap-1 bg-background/50">
            <TabsTrigger value="dashboard" className="text-sm">
              <Award className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="oportunidades" className="text-sm">
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Oportunidades</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-sm">
              <Brain className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="text-sm">
              <Radar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="recursos" className="text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Recursos</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <ExecutiveDashboard />
          </TabsContent>

          {/* Oportunidades Tab */}
          <TabsContent value="oportunidades" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Oportunidades en el Mercado</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Tu perfil de LinkedIn sincronizado, ofertas personalizadas y análisis del mercado laboral
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <LinkedInProfileCard />
              </div>
              <div className="lg:col-span-2">
                <JobRecommendationsCard />
              </div>
            </div>

            <div className="mt-6">
              <MarketInsightsCard />
            </div>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Cultura General & Tests</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Evalúa tu conocimiento sobre historia, geografía, actualidad y cultura. Acumula puntos y desbloquea badges.
              </p>
            </div>
            <A4GamifiedTests />
          </TabsContent>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-4">
            <PersonalizedRadarSystem />
          </TabsContent>

          {/* Recursos Tab */}
          <TabsContent value="recursos" className="space-y-4">
            <A4Biblioteca />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
