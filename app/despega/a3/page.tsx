'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, BarChart3, Target, Video, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

export default function EntrenamientoIntensivePage() {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  const nextStep = {
    stepNumber: 1,
    title: 'Comenzar: Auditoría Inicial',
    description: 'Aprende técnicas fundamentales de presencia en video y auditoría de tu setup',
    action: '/despega/interview-0',
    actionLabel: 'Ir a Auditoría →'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/despega">
            <Button variant="ghost" size="sm" className="hover:bg-muted/20 dark:hover:bg-muted/70">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Volver
            </Button>
          </Link>
          <Badge className="bg-training/20 text-training border border-training/30">
            Pilar 3: Entrenamiento Intensivo
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-3" style={{ color: 'rgb(170, 70, 170)' }}>
              Domina Entrevistas en 4 Niveles
            </h1>
            <p className="text-xl text-white/85 max-w-3xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Practica con simulaciones realistas, obtén feedback multimodal inmediato de IA, y avanza de principiante a maestría.
            </p>
          </div>
        </div>

        {/* Next Step Card */}
        <Card className="mb-12 border-training/40 bg-gradient-to-r from-training/20 to-training/10" style={{ borderWidth: '0px 0px 0px 4px', borderColor: 'rgba(170, 70, 170, 0.8)' }}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-training uppercase font-semibold tracking-wider">Tu Próximo Paso</p>
                <h3 className="text-2xl font-bold text-white mt-1">{nextStep.title}</h3>
                <p className="text-white/70 mt-2">{nextStep.description}</p>
              </div>
              <Link href={nextStep.action} className="flex-shrink-0 ml-6">
                <Button className="px-6 h-12 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.8)', color: '#ffffff', borderRadius: '20px' }}>
                  {nextStep.actionLabel}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Training Levels */}
        <div className="mb-12">
          <h2 className="text-3xl font-medium text-white mb-6">Niveles de Entrenamiento</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { level: 'Guiado', color: 'text-blue-400', desc: 'Estructura con feedback paso a paso' },
              { level: 'Estructurado', color: 'text-purple-400', desc: 'Práctica con tema definido' },
              { level: 'Desafiante', color: 'text-orange-400', desc: 'Preguntas difíciles y sorpresas' },
              { level: 'Maestría', color: 'text-red-400', desc: 'Simulación de entrevista real' }
            ].map((item, i) => (
              <Card key={i} className="bg-background/50 border-white/10 hover:border-white/20 transition cursor-pointer">
                <CardContent className="p-6">
                  <Target className={`w-8 h-8 mb-3 ${item.color}`} />
                  <h3 className="font-semibold text-white">{item.level}</h3>
                  <p className="text-sm text-white/60 mt-2">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-3xl font-medium text-white mb-6">Lo Que Obtendrás</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Video, title: 'Feedback Multimodal', desc: 'IA analiza tu audio, video y lenguaje corporal' },
              { icon: Zap, title: 'Mejora Rápida', desc: 'Secciones optimizadas para tu ritmo' },
              { icon: BarChart3, title: 'Progreso Medible', desc: 'Dashboard con métricas de mejora' },
              { icon: Clock, title: 'Disponible 24/7', desc: 'Entrena cuando quieras, sin límites' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Card key={i} className="bg-background/50 border-white/10">
                  <CardContent className="p-6 flex gap-4">
                    <Icon className="w-10 h-10 text-training flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-white/60 mt-1">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
