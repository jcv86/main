'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, Zap, Target, ArrowRight, CheckCircle2 } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 mb-6">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900 dark:text-white">Despega</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            ¡Bienvenido, <span className="text-blue-600">{userName}</span>!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Tu viaje hacia la excelencia en entrevistas comienza aquí
          </p>
        </div>

        {/* How it Works */}
        <div className="space-y-4 mb-12">
          <h2 className="text-center text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Cómo funciona Despega
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Step 1 */}
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-300">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Conozcámonos
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Responde preguntas para entender tu perfil, objetivos y contexto laboral
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-300">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Tu Plan A2
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Recibe un plan personalizado de 90 días adaptado a tu perfil
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 mb-4">
                    <span className="text-xl font-bold text-cyan-600 dark:text-cyan-300">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Entrena y Analiza
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Practica entrenamientos y obtén análisis multimodal avanzado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Lo que conseguirás
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Análisis Completo</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Feedback detallado sobre postura, tono, gestos y coherencia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Plan Personalizado</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Diseñado específicamente para tu perfil y objetivos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Entrenamientos Progresivos</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">De básico a maestría en 4 niveles de dificultad</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Contexto del Mercado</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Análisis en profundidad de tendencias y oportunidades</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-8">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Tiempo Estimado
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            Tu viaje será gradual y personalizado:
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold"
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
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
          Puedes volver a esta página en cualquier momento desde el menú de Despega
        </p>
      </div>
    </div>
  )
}
