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

export default function EjecucionContinuaPage() {
  const { user, loading } = useAuthRedirect()
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    if (loading || !user?.id) return
    console.log('[v0] Ejecución Continua page accessed by user:', user.id)
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
          <Badge 
            className="border-none"
            style={{ 
              backgroundColor: "rgba(225, 120, 130, 0.2)",
              color: "rgba(225, 120, 130, 0.9)"
            }}
          >
            Pilar 4: Ejecución Continua
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 
            className="text-5xl md:text-6xl font-medium mb-4 text-balance"
            style={{ color: "rgba(225, 120, 130, 0.6)" }}
          >
            Ejecución Continua
          </h1>
          <p className="text-xl text-muted-foreground dark:text-white/85 mb-3">
            Colocación laboral y acompañamiento permanente
          </p>
          <p 
            className="text-base max-w-2xl mx-auto"
            style={{ color: "rgb(150, 150, 150)" }}
          >
            Aquí es donde tu aprendizaje se transforma en acción. Monitoreamos tu progreso, conectamos oportunidades reales, 
            ofrecemos coaching IA 24/7 y te proporcionamos contexto de mercado para que tomes decisiones estratégicas con criterio laboral.
          </p>
          
          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
            <div 
              className="rounded-lg p-4"
              style={{ backgroundColor: "rgba(225, 120, 130, 0.2)" }}
            >
              <div className="text-2xl mb-2"></div>
              <h3 
                className="font-medium mb-1"
                style={{ color: "rgba(225, 120, 130)" }}
              >
                Dashboard Ejecutivo
              </h3>
              <p className="text-sm text-muted-foreground">Visualiza tu desempeño y avance en tiempo real</p>
            </div>
            <div 
              className="rounded-lg p-4"
              style={{ backgroundColor: "rgba(225, 120, 130, 0.2)" }}
            >
              <div className="text-2xl mb-2"></div>
              <h3 
                className="font-medium mb-1"
                style={{ color: "rgba(225, 120, 130)" }}
              >
                Oportunidades Reales
              </h3>
              <p className="text-sm text-muted-foreground">Acceso a ofertas laborales personalizadas del mercado</p>
            </div>
            <div 
              className="rounded-lg p-4"
              style={{ backgroundColor: "rgba(225, 120, 130, 0.2)" }}
            >
              <div className="text-2xl mb-2"></div>
              <h3 
                className="font-medium mb-1"
                style={{ color: "rgba(225, 120, 130)" }}
              >
                Aprendizaje Continuo
              </h3>
              <p className="text-sm text-muted-foreground">Recursos, tests y análisis para crecer profesionalmente</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 gap-1 bg-background/50 border-2 border-red/20">
            <TabsTrigger 
              value="dashboard" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-[rgba(225,120,130,0.9)]"
              style={{}}
            >
              <Award className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Mi Progreso</span>
            </TabsTrigger>
            <TabsTrigger 
              value="oportunidades" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-[rgba(225,120,130,0.9)]"
              style={{}}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Empleos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tests" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-[rgba(225,120,130,0.9)]"
              style={{}}
            >
              <Brain className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Conocimiento</span>
            </TabsTrigger>
            <TabsTrigger 
              value="radar" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-[rgba(225,120,130,0.9)]"
              style={{}}
            >
              <Radar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Análisis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recursos" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-[rgba(225,120,130,0.9)]"
              style={{}}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Biblioteca</span>
            </TabsTrigger>
          </TabsList>

          {/* Mi Progreso - Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="mb-6 border-l-4 border-l-red pl-6">
              <h2 className="text-3xl font-bold mb-2 text-red">Tu Desempeño Ejecutivo</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Visualiza tu progreso integral en el programa, métricas clave de desempeño y recomendaciones personalizadas
              </p>
            </div>
            <ExecutiveDashboard />
          </TabsContent>

          {/* Empleos - Oportunidades */}
          <TabsContent value="oportunidades" className="space-y-6">
            <div className="mb-6 border-l-4 border-l-red pl-6">
              <h2 className="text-3xl font-bold mb-2 text-red">Conecta con Oportunidades Reales</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Tu perfil profesional sincronizado con LinkedIn, ofertas laborales personalizadas según tu perfil e insights del mercado laboral chileno en tiempo real
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

          {/* Conocimiento - Tests */}
          <TabsContent value="tests" className="space-y-6">
            <div className="mb-6 border-l-4 border-l-red pl-6">
              <h2 className="text-3xl font-bold mb-2 text-red">Desarrolla Criterio Laboral</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Tests sobre historia, economía, tecnología, actualidad y cultura general. Mejora tu conocimiento contextual, acumula puntos DTC y desbloquea badges de experto
              </p>
            </div>
            <A4GamifiedTests />
          </TabsContent>

          {/* Análisis - Radar */}
          <TabsContent value="radar" className="space-y-6">
            <div className="mb-6 border-l-4 border-l-red pl-6">
              <h2 className="text-3xl font-bold mb-2 text-red">Radar Estratégico de Mercado</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Análisis en profundidad de tendencias del mercado laboral, señales débiles de cambio y contexto estratégico para tu posicionamiento profesional
              </p>
            </div>
            <PersonalizedRadarSystem />
          </TabsContent>

          {/* Biblioteca - Recursos */}
          <TabsContent value="recursos" className="space-y-6">
            <div className="mb-6 border-l-4 border-l-red pl-6">
              <h2 className="text-3xl font-bold mb-2 text-red">Biblioteca de Recursos</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Acceso a libros, artículos, cursos y herramientas curadas para fortalecer tu desarrollo profesional continuo
              </p>
            </div>
            <A4Biblioteca />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
