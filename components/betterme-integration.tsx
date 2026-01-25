'use client'

import { ProgressDashboard } from './progress-dashboard'
import { RecommendationEngine } from './recommendation-engine'
import { Leaderboard } from './leaderboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap, Trophy, Lightbulb, TrendingUp } from 'lucide-react'

/**
 * BetterMe Integration Component
 * Integrates all four BetterMe flows into a cohesive learning experience:
 * 1. Personalized Learning Paths (Assessment)
 * 2. Gamification (Streaks, Badges, Points)
 * 3. Adaptive Recommendations
 * 4. Progress Tracking
 */
export function BetterMeIntegration() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progreso</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Recomendaciones</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Ranking</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Aprender</span>
          </TabsTrigger>
        </TabsList>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tu Progreso de Aprendizaje</CardTitle>
              <CardDescription>
                Visualiza tu evolución en lecturas, puntos y racha diaria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Libros Recomendados Para Ti</CardTitle>
              <CardDescription>
                Seleccionados basándose en tu nivel y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationEngine />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Global</CardTitle>
              <CardDescription>
                Compite con otros usuarios por puntos y logros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Leaderboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tu Ruta de Aprendizaje Personalizada</CardTitle>
              <CardDescription>
                Comienza tu evaluación para recibir libros personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Este módulo te ayudará a crear un camino de aprendizaje personalizado basado en tu nivel actual y objetivos profesionales.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium mb-2">¿Cómo funciona?</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Responde un quiz rápido de 5-10 preguntas</li>
                    <li>El sistema detecta tu nivel (Principiante/Intermedio/Avanzado)</li>
                    <li>Recibe recomendaciones personalizadas de libros</li>
                    <li>Gana puntos y logros mientras lees</li>
                    <li>Compite en el ranking global</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
