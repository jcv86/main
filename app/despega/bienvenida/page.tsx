'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, Zap, Target, ArrowRight, CheckCircle2, Brain, BookOpen, Users, Compass } from 'lucide-react'
import { StepHeader } from '@/components/step-header'
import { PillarStatusCard } from '@/components/pillar-status-card'

export default function BienvenidaPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }
        setUserName(user.email?.split('@')[0] || 'Despega Pro')
        setLoading(false)
      } catch (err) {
        console.error('[v0] Auth error:', err)
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [supabase, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <StepHeader
          stepNumber={0}
          pillarName="Despega Tu Carrera"
          title="Bienvenido al Viaje de Transformación"
          description="Tu camino hacia la excelencia en entrevistas y desarrollo profesional está dividido en 4 pilares fundamentales. Completa cada uno en orden para desbloquear el siguiente."
          estimatedTime="90 días"
          pillarColor="blue"
        />

        {/* Pilares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Step 1 */}
          <Card className="border-0 shadow-sm bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-[20px] bg-blue/10 dark:bg-blue mb-4">
                  <span className="text-xl font-bold text-blue dark:text-blue/30">1</span>
                </div>
                <h3 className="font-semibold text-muted/90 dark:text-white mb-2">Conozcámonos</h3>
                <p className="text-sm text-muted/60 dark:text-muted/40">
                  Responde preguntas para entender tu perfil, objetivos y contexto laboral
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-0 shadow-sm bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-[20px] bg-purple/10 dark:bg-purple mb-4">
                  <span className="text-xl font-bold text-purple dark:text-purple/30">2</span>
                </div>
                <h3 className="font-semibold text-muted/90 dark:text-white mb-2">Tu Plan A2</h3>
                <p className="text-sm text-muted/60 dark:text-muted/40">
                  Recibe un plan personalizado de 90 días adaptado a tu perfil
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-0 shadow-sm bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-[20px] bg-cyan/10 dark:bg-cyan mb-4">
                  <span className="text-xl font-bold text-blue dark:text-cyan/30">3</span>
                </div>
                <h3 className="font-semibold text-muted/90 dark:text-white mb-2">Entrena y Analiza</h3>
                <p className="text-sm text-muted/60 dark:text-muted/40">
                  Practica entrenamientos y obtén análisis multimodal avanzado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-card rounded-lg shadow-sm p-8 mb-8 border border-muted/20 dark:border-card">
          <h2 className="text-lg font-semibold text-muted/90 dark:text-white mb-6">Lo que conseguirás</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-white">Análisis Completo</p>
                <p className="text-sm text-muted/60 dark:text-muted/40">Feedback detallado sobre postura, tono, gestos y coherencia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-white">Plan Personalizado</p>
                <p className="text-sm text-muted/60 dark:text-muted/40">Diseñado específicamente para tu perfil y objetivos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-white">Entrenamientos Progresivos</p>
                <p className="text-sm text-muted/60 dark:text-muted/40">De básico a maestría en 4 niveles de dificultad</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-white">Contexto del Mercado</p>
                <p className="text-sm text-muted/60 dark:text-muted/40">Análisis en profundidad de tendencias y oportunidades</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-blue/5 dark:bg-blue/30 rounded-[28px] p-6 border border-blue/30 dark:border-blue/10 mb-8">
          <h3 className="font-semibold text-muted/90 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue" />
            Tiempo Estimado
          </h3>
          <p className="text-sm text-muted/70 dark:text-muted/30 mb-3">Tu viaje será gradual y personalizado:</p>
          <ul className="space-y-2 text-sm text-muted/60 dark:text-muted/40">
            <li>• <strong>Hoy:</strong> Responderas preguntas de conocimiento (30 min)</li>
            <li>• <strong>Días 1-3:</strong> Recibirás tu plan personalizado A2 (lectura: 1 hora)</li>
            <li>• <strong>Semanas 1-12:</strong> Sigue tu plan con entrenamientos progresivos (2-3 horas/semana)</li>
            <li>• <strong>Durante:</strong> Análisis multimodal después de cada sesión</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push('/despega/conozcamonos-1')}
            className="bg-blue hover:bg-blue text-white px-8 py-6 text-base font-semibold"
          >
            Comenzar el Viaje
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/despega')}
            className="px-8 py-6 text-base"
          >
            Ir al Dashboard
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted/50 dark:text-muted/40 mt-8">
          Puedes volver a esta página en cualquier momento desde el menú de Despega
        </p>
      </div>
    </div>
  )
}
