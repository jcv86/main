'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHero } from '@/components/dashboard-hero'
import { DashboardMetrics } from '@/components/dashboard-metrics'
import { TransformationTimeline } from '@/components/transformation-timeline'
import { PillarCard } from '@/components/pillar-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Zap, Target, Globe, MessageCircle, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('[v0] Loading user data from dashboard endpoint')
        
        // Call the dashboard data endpoint
        const response = await fetch('/rest/dashboard-data')
        
        if (!response.ok) {
          console.error('[v0] Failed to fetch dashboard data:', response.status)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        console.log('[v0] Dashboard data loaded:', {
          name: data.name,
          progressPercent: data.progressPercent,
          hasA2Mission: !!data.a2_mission,
          trainingsCount: data.a3_trainings?.length || 0
        })
        
        setUserData(data)
      } catch (error) {
        console.error('[v0] Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow"></div>
          <p className="text-muted-foreground">Cargando tu transformación...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center space-y-4 bg-transparent border-muted/80">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Lora, serif' }}>No hay datos</h2>
          <p className="text-muted-foreground">
            Por favor, completa el onboarding primero
          </p>
          <Button onClick={() => router.push('/despega/onboarding')} className="w-full bg-yellow text-black hover:bg-yellow/90">
            Ir al Onboarding
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <DashboardHero 
          userName={userData.name}
          discProfile={userData.discProfile}
          dominantProfile={userData.dominantProfile}
          progressPercent={userData.progressPercent}
        />

        {/* Metrics */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'Lora, serif' }}>
            Tu Progreso
          </h2>
          <DashboardMetrics 
            daysCompleted={userData.progressPercent}
            trainingsCompleted={userData.a3_trainings?.length || 0}
            articlesRead={Math.floor(userData.progressPercent / 10)}
            currentStreak={Math.floor(userData.progressPercent / 15)}
          />
        </div>

        {/* Timeline */}
        <TransformationTimeline progressPercent={userData.progressPercent} />

        {/* Misión Section */}
        {userData.a2_mission ? (
          <Card className="bg-background">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-muted/90 dark:text-muted/5">
                  Tu Misión de 90 Días
                </h2>
                <h3 className="text-xl font-semibold text-blue dark:text-blue/40">
                  {userData.a2_mission.titulo}
                </h3>
                <p className="text-muted-foreground dark:text-muted/30">
                  {userData.a2_mission.objetivo}
                </p>
              </div>
              <div className="flex gap-4">
                <Button className="bg-blue hover:bg-blue">
                  Ver Detalles de Misión
                </Button>
                <Button variant="outline">
                  Ver Sprint {userData.a2_mission.sprint_actual}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-background">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-muted/90 dark:text-muted/5">
                Elige Tu Camino de Transformación
              </h2>
              <p className="text-muted-foreground dark:text-muted/30">
                Comienza eligiendo entre tu transformación personal o profesional
              </p>
              <Button className="bg-blue hover:bg-blue" size="lg">
                Comenzar Mi Misión
              </Button>
            </div>
          </Card>
        )}

        {/* Pillars Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Los 3 Pilares de Tu Transformación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PillarCard
              pillar="A1"
              pillarName="El Ritual"
              title="El Ritual"
              status="completed"
              description="Completaste tu Evaluación de Liderazgo y descubriste tu patrón"
              nextStep="-"
              href="/despega/onboarding/result"
              icon={<Zap className="w-6 h-6" />}
              color="red"
            />
            <PillarCard
              pillar="A2"
              pillarName="Exploración"
              title="Rutas"
              status={userData.a2_mission ? 'active' : 'active'}
              description="Elige tu camino y crea tu misión de 90 días personalizada"
              nextStep={userData.a2_mission ? 'Continuar sprint' : 'Elegir camino'}
              href="/despega/a2/camino"
              icon={<Target className="w-6 h-6" />}
              color="blue"
            />
            <PillarCard
              pillar="A3"
              pillarName="Entrenamiento"
              title="Entrenamientos"
              status="pending"
              description="Entrenamientos prácticos adaptados a tu tema de sprint"
              nextStep="Activa tu primer entrenamiento"
              href="/despega/a3"
              icon={<BookOpen className="w-6 h-6" />}
              color="green"
            />
            <PillarCard
              pillar="A4"
              pillarName="La Realidad"
              title="La Realidad"
              status="pending"
              description="Noticias y contexto personalizado para tu transformación"
              nextStep="Conoce el contexto de tu tema"
              href="/despega/a4/noticias"
              icon={<Globe className="w-6 h-6" />}
              color="purple"
            />
          </div>
        </div>

        {/* Coach Section */}
        <Card className="bg-background">
          <div className="flex items-start gap-6">
            <div className="text-5xl">🤖</div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-muted/90 dark:text-muted/5 mb-2">
                  Tu Coach IA: Sofía
                </h3>
                <p className="text-muted-foreground dark:text-muted/30">
                  "¡Hola María! Veo que eres AZUL, lo que significa que te guía la empatía y las relaciones. Tu transformación comenzará fortaleciendo estas cualidades naturales tuyas."
                </p>
              </div>
              <Button className="bg-yellow hover:bg-amber-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Hablar con Sofía
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-muted/90 dark:text-muted/5">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Target className="w-6 h-6" />
              <span className="text-xs text-center">Mi Sprint</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-xs text-center">Entrenamientos</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Globe className="w-6 h-6" />
              <span className="text-xs text-center">Noticias</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs text-center">Coach IA</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
