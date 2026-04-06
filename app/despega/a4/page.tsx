'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Radar, Brain, BookOpen, Award } from 'lucide-react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { ExecutiveDashboard } from '@/components/executive-dashboard'
import { RadarEstrategico } from '@/components/radar-estrategico-system'
import { A4GamifiedTests } from '@/components/a4-gamified-tests'
import { A4Biblioteca } from '@/components/a4-biblioteca'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/despega">
            <Button variant="ghost" size="sm" className="hover:bg-slate-200 dark:hover:bg-slate-700">
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
            Tu Dashboard Ejecutivo
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-2">
            Coach IA 24/7 • Contexto de Mercado • Decisiones Estratégicas
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            Monitorea tu progreso, descubre oportunidades y desarrolla criterio laboral
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 gap-1 bg-background/50">
            <TabsTrigger value="dashboard" className="text-sm">
              <Award className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
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

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Cultura General & Tests</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Evalúa tu conocimiento sobre historia, geografía, actualidad y cultura. Acumula puntos y desbloquea badges.
              </p>
            </div>
            <A4GamifiedTests />
          </TabsContent>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-4">
            <RadarEstrategico />
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
