'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { StepHeader } from '@/components/step-header'

export default function A3IntroPage() {
  const [authOk, setAuthOk] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      let userId = user?.id
      if (!user) {
        const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null
        if (demoUserStr) {
          try {
            const demoUser = JSON.parse(demoUserStr)
            userId = demoUser.id
            console.log('[v0] Demo user found for a3-intro:', demoUser.email)
          } catch (e) {
            console.error('[v0] Error parsing demo user:', e)
            router.push('/auth/signin')
            return
          }
        } else {
          router.push('/auth/signin')
          return
        }
      }
      
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: userId,
          a3_intro_seen: true,
          a3_intro_seen_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (updateError) {
        console.error('[v0] Error marking A3 intro seen:', updateError)
      }
      
      setAuthOk(true)
    }
    check()
  }, [supabase, router])

  if (!authOk) {
    return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-training/20 via-transparent to-training/10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-training/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-training/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <StepHeader
          stepNumber={3}
          pillarName="Entrenamiento Intensivo"
          title="Prepárate para Entrevistas Reales"
          description="Simulaciones prácticas con feedback de IA. Transforma conocimiento en confianza bajo presión real."
          estimatedTime="~60-90 min"
          pillarColor="purple"
        />

        <div className="space-y-12">
          {/* Hero section */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
              Del Conocimiento a la Confianza
            </h2>
            <p className="text-xl text-white/80 max-w-3xl leading-relaxed">
              Has aprendido las herramientas. Ahora es hora de entrenar bajo condiciones reales. Simula entrevistas, recibe feedback de IA, ajusta tu desempeño y repite hasta dominar.
            </p>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: '1',
                title: 'Responde',
                description: 'Simulación completa de entrevista bajo presión de tiempo real.',
                icon: '🎤'
              },
              {
                number: '2',
                title: 'Analiza',
                description: 'Recibe feedback detallado de IA sobre tu desempeño y áreas de mejora.',
                icon: '📊'
              },
              {
                number: '3',
                title: 'Mejora',
                description: 'Ajusta tu técnica y repite hasta alcanzar nivel profesional.',
                icon: '⚡'
              }
            ].map((step, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-training/30 bg-gradient-to-br from-training/15 to-training/5 p-8 hover:border-training/60 transition-all duration-300 hover:shadow-lg hover:shadow-training/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-training/0 via-training/10 to-training/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="text-5xl font-black text-transparent bg-gradient-to-r from-training to-training/60 bg-clip-text">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Three modalities */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Tres Modalidades de Entrenamiento</h2>
            
            <div className="space-y-4">
              {[
                {
                  level: 1,
                  title: 'Simulación Guiada',
                  description: 'Con hints y orientación. Perfecto para aprender nuevas técnicas.',
                  color: 'from-training/30 to-training/20'
                },
                {
                  level: 2,
                  title: 'Simulación Estructurada',
                  description: 'Preguntas realistas sin ayuda. Te prepara para escenarios reales.',
                  color: 'from-training/40 to-training/25'
                },
                {
                  level: 3,
                  title: 'Simulación Desafiante',
                  description: 'Preguntas difíciles bajo presión de tiempo. Máxima dificultad.',
                  color: 'from-training/50 to-training/35'
                }
              ].map((mode, i) => (
                <div
                  key={i}
                  className={`group relative overflow-hidden rounded-2xl border border-training/40 bg-gradient-to-r ${mode.color} p-6 hover:border-training/70 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-training/30`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-training/60 text-white font-bold text-lg">
                        {mode.level}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-white">{mode.title}</h3>
                      <p className="text-white/80">{mode.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll practice */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Lo que Practicarás</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Respuestas estructuradas con STAR',
                'Manejo de presión y límite de tiempo',
                'Comunicación clara y concisa',
                'Técnicas de cierre y contrapreguntas',
                'Gestión de nervios y confianza',
                'Adaptación a preguntas inesperadas'
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-training/30 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-training flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why it works */}
          <div className="relative overflow-hidden rounded-2xl border border-training/40 bg-gradient-to-br from-training/20 to-training/5 p-10">
            <div className="absolute inset-0 bg-gradient-to-r from-training/20 via-transparent to-training/10 opacity-50"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-bold text-white">Por qué Funciona</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-training">Presión Real</div>
                  <p className="text-white/80">Simula las condiciones exactas de una entrevista verdadera. Sin presión, no hay crecimiento.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-training">Feedback Inmediato</div>
                  <p className="text-white/80">Análisis detallado de cada respuesta. Sabes exactamente qué mejorar en cada aspecto.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-training">Iteración Rápida</div>
                  <p className="text-white/80">Practica múltiples veces. Cada ciclo te acerca más a la excelencia.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-training">Confianza Progresiva</div>
                  <p className="text-white/80">Ver tu evolución en números. Sientes el progreso, no solo lo crees.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white">Listo para Entrenar?</h2>
              <p className="text-lg text-white/80">Accede al dashboard y comienza tu primera simulación ahora.</p>
            </div>
            
            <Button
              onClick={() => router.push('/despega/a3')}
              className="inline-flex bg-gradient-to-r from-training to-training/80 hover:shadow-lg hover:shadow-training/50 transition-all transform hover:scale-105 text-white px-10 py-6 text-lg font-bold rounded-full"
            >
              Ir a Entrenamiento Intensivo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
