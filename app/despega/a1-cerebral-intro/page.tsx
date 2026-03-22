'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, CheckCircle2, Zap } from 'lucide-react'

export default function A1CerebralIntroPage() {
  const [authOk, setAuthOk] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }
      setAuthOk(true)
    }
    check()
  }, [supabase, router])

  if (!authOk) {
    return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Análisis Cerebral - A1
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Descubre tu perfil DISC y entiende tu estilo de comunicación
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is DISC */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                ¿Qué es el Análisis DISC?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                El test DISC es un análisis de comportamiento que identifica tu estilo de comunicación y trabajo basado en cuatro dimensiones:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-900 dark:text-red-100 mb-1">D - Dominancia</p>
                  <p className="text-sm text-red-800 dark:text-red-200">Decisivo, competitivo, orientado a resultados</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">I - Influencia</p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">Comunicativo, entusiasta, orientado a personas</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-1">S - Estabilidad</p>
                  <p className="text-sm text-green-800 dark:text-green-200">Cooperativo, paciente, orientado al equipo</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">C - Conciencia</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Analítico, detallista, orientado a calidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                ¿Cómo funciona el test?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">20 preguntas</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Responde 20 preguntas simples</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Dos selecciones por pregunta</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Para cada pregunta, selecciona la opción que más y menos te describe</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Análisis automático</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Obtendrás tu perfil DISC personalizado con recomendaciones</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Question */}
          <Card className="border-0 shadow-lg bg-slate-50 dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Ejemplo de Pregunta</CardTitle>
              <CardDescription>Así verás cada pregunta en el test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  En una situación de trabajo, yo soy más...
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span className="font-semibold">Selecciona lo que MÁS te describe:</span>
                  </p>
                  <div className="p-3 border-2 border-blue-600 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-slate-900 dark:text-white">Directo y decisivo en mis acciones</p>
                  </div>
                  <div className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-slate-400 dark:hover:border-slate-500">
                    <p className="text-slate-700 dark:text-slate-300">Entusiasta y motivador con otros</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-300 dark:border-slate-600 pt-6">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span className="font-semibold">Selecciona lo que MENOS te describe:</span>
                  </p>
                  <div className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-slate-400 dark:hover:border-slate-500">
                    <p className="text-slate-700 dark:text-slate-300">Paciente y receptivo con las ideas</p>
                  </div>
                  <div className="p-3 border-2 border-red-600 bg-red-50 dark:bg-red-950 rounded-lg mt-3">
                    <p className="text-slate-900 dark:text-white">Analítico y perfeccionista en detalles</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
                ¿Por qué es importante?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-blue-900 dark:text-blue-100">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Entiende tu estilo de comunicación natural</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Identifica tus fortalezas en situaciones de entrevista</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Reconoce áreas de desarrollo personal</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Adapta tu comunicación según el contexto laboral</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center mt-12">
            <Button
              onClick={() => router.push('/despega/a1-cerebral')}
              size="lg"
              className="px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Comenzar Test DISC
            </Button>
            <Button
              onClick={() => router.push('/despega')}
              size="lg"
              variant="outline"
              className="px-8 text-lg"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
