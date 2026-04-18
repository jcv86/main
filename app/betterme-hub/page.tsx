'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressDashboard } from '@/components/progress-dashboard'
import { RecommendationEngine } from '@/components/recommendation-engine'
import { Leaderboard } from '@/components/leaderboard'
import { BookOpen, TrendingUp, Trophy, Lightbulb } from 'lucide-react'

export default function BetterMeHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Tu Centro de Aprendizaje Personalizado</h1>
          <p className="text-lg text-muted-foreground">
            Aprende a tu ritmo con recomendaciones inteligentes, seguimiento de progreso y comunidad competitiva
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <BookOpen className="w-6 h-6 mb-2 text-blue/50" />
              <p className="text-sm text-muted-foreground">Libros en Progreso</p>
              <p className="text-2xl font-bold">2</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <TrendingUp className="w-6 h-6 mb-2 text-green" />
              <p className="text-sm text-muted-foreground">Racha Actual</p>
              <p className="text-2xl font-bold">12 días</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <Trophy className="w-6 h-6 mb-2 text-orange" />
              <p className="text-sm text-muted-foreground">Posición</p>
              <p className="text-2xl font-bold">#47</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <Lightbulb className="w-6 h-6 mb-2 text-purple/50" />
              <p className="text-sm text-muted-foreground">Próx. Meta</p>
              <p className="text-2xl font-bold">+1 nivel</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Mi Progreso</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
            <TabsTrigger value="next">Próximos Pasos</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6 mt-6">
            <RecommendationEngine />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="next" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu Ruta Personalizada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-green pl-4 py-2">
                    <p className="font-semibold">✓ Paso 1: Completa tu Perfil</p>
                    <p className="text-sm text-muted-foreground">Define tus intereses y objetivos</p>
                  </div>
                  <div className="border-l-4 border-blue/50 pl-4 py-2">
                    <p className="font-semibold">→ Paso 2: Lee el Primer Libro</p>
                    <p className="text-sm text-muted-foreground">Comienza con una recomendación personalizada</p>
                  </div>
                  <div className="border-l-4 border-orange pl-4 py-2">
                    <p className="font-semibold">→ Paso 3: Mantén tu Racha</p>
                    <p className="text-sm text-muted-foreground">Lee todos los días para subir en el ranking</p>
                  </div>
                  <div className="border-l-4 border-purple/50 pl-4 py-2">
                    <p className="font-semibold">→ Paso 4: Desbloquea Logros</p>
                    <p className="text-sm text-muted-foreground">Completa retos y sube de nivel</p>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Comenzar mi Viaje de Aprendizaje
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
