'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, BarChart3, Target, Video, ArrowRight, Clock, Zap as ZapIcon, Flame } from 'lucide-react'
import Link from 'next/link'
import A3ProgressDashboard from '@/components/a3-progress-dashboard'
import { TrainingProgressDashboard } from '@/components/training-progress-dashboard'

export default function EntrenamientoIntensivePage() {
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  // Determine the recommended next step based on user progress
  const getNextStep = () => {
    // This would typically come from user session data
    // For now, we'll show the first step as default
    return {
      stepNumber: 1,
      title: 'Comenzar: Auditoría Inicial',
      description: 'Aprende técnicas fundamentales de presencia en video y auditoría de tu setup',
      action: '/despega/interview-0',
      actionLabel: 'Ir a Auditoría →'
    }
  }

  const nextStep = getNextStep()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Navigation */}
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

        <div className="space-y-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-3" style={{ color: 'rgb(170, 70, 170)' }}>
              Domina Entrevistas en 4 Niveles
            </h1>
            <p className="text-xl text-white/85 max-w-3xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Practica con simulaciones realistas, obtén feedback multimodal inmediato de IA, y avanza de principiante a maestría con análisis profundo de tu desempeño.
            </p>
          </div>
        </div>

        {/* Quick Next Step Card */}
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

        {/* A3 Progress Section */}
        <div className="mb-12 space-y-4">
          <div>
            <h2 className="text-3xl font-medium text-white mb-2">Tu Progreso en Entrenamiento</h2>
            <p className="text-white/70 mb-4">
              Monitorea tu desempeño en esta sección, gana puntos y desbloquea badges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <A3ProgressDashboard />
            </div>
            <div className="flex items-center justify-center bg-background">
              <video 
                autoPlay
                loop
                muted
                playsInline
                className="w-3/4 h-auto object-contain max-h-96"
                style={{ borderRadius: '1px', borderColor: '#000000' }}
              >
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtcroket-LnbDcsYKMB3l7CjXgdufaz9Nm61op9.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Training Statistics */}
        <div className="mb-16 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">Estadísticas de Entrenamiento</h2>
            <p className="text-lg text-white/85" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Visualiza tu progreso completo: XP ganados, racha de entrenamientos, logros desbloqueados y más.
            </p>
          </div>

          <TrainingProgressDashboard />
        </div>

        {/* Step 1: Diagnostic Audit */}
        <div className="mb-16 space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl font-bold text-purple-400" style={{ color: 'rgb(170, 70, 170)' }}>1</div>
              <div>
                <h2 className="text-3xl font-bold text-white">Guía del Coach - Auditoría Inicial</h2>
              </div>
            </div>
            <p className="text-lg text-white/85 ml-24" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Tu coach te guiará a través de una auditoría completa de tu ambiente, presencia, audio y pitch. Este es el cimiento para toda tu preparación.
            </p>
          </div>

          <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgba(170, 70, 170, 0.6)', borderWidth: '0px 0px 0px 6px', backgroundColor: 'rgba(80, 160, 170, 0.1)', borderRadius: '20px' }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Video className="w-5 h-5" style={{ color: 'rgb(170, 70, 170)' }} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Preparación Inicial</CardTitle>
                    <p className="text-sm text-white/70 mt-1">Auditoría supervisada con feedback del coach</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90 text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Revisaremos: tu entorno, iluminación, audio, presencia en cámara y te ayudaremos a preparar tu pitch profesional. 
                <span className="block mt-2 font-semibold">Este es el cimiento para toda tu preparación de entrevistas.</span>
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
                <div className="flex items-start gap-2 p-2 rounded bg-white/5">
                  <span className="text-purple-400">✓</span>
                  <span className="text-white/80">Auditoría de ambiente y técnica</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded bg-white/5">
                  <span className="text-purple-400">✓</span>
                  <span className="text-white/80">Validación de presencia profesional</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded bg-white/5">
                  <span className="text-purple-400">✓</span>
                  <span className="text-white/80">Primera práctica de entrevista</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded bg-white/5">
                  <span className="text-purple-400">✓</span>
                  <span className="text-white/80">Feedback personalizado inmediato</span>
                </div>
              </div>
              <div className="pt-2 space-y-3 border-t border-white/10">
                <Link href="/despega/interview-0" className="block">
                  <Button className="w-full font-bold text-lg py-6" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}>
                    Comenzar <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-white/50 text-center">⏱ Tiempo estimado: 45-60 minutos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Preparation Tools */}
        <div className="space-y-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl font-bold text-purple-400" style={{ color: 'rgb(170, 70, 170)' }}>2</div>
              <div>
                <h2 className="text-3xl font-medium text-white">Herramientas de Preparación</h2>
              </div>
            </div>
            <p className="text-lg text-white/85 ml-24" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Optimiza tu CV, aprende metodología STAR, analiza ofertas y practica en video. Herramientas específicas con guía del coach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Tool 1: STAR Method */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgba(170, 70, 170, 0.6)', borderWidth: '0px 0px 0px 6px', backgroundColor: 'rgba(80, 160, 170, 0.1)', borderRadius: '20px' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  Método STAR
                </CardTitle>
                <CardDescription className="text-xs mt-1">Estructuración de respuestas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Tu coach te enseñará a estructurar respuestas: Situación → Tarea → Acción → Resultado. 
                  El estándar para respuestas profesionales claras y memorables.
                </p>
                <Link href="/despega/a3/entrenamiento-guiado" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.5)', color: '#ffffff', borderRadius: '20px' }}>
                    Aprender STAR <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tool 2: CV Optimization */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgba(170, 70, 170, 0.6)', borderWidth: '0px 0px 0px 6px', backgroundColor: 'rgba(80, 160, 170, 0.1)', borderRadius: '20px' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  CV Inteligente
                </CardTitle>
                <CardDescription className="text-xs mt-1">Optimización para ATS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Optimiza tu CV para sistemas ATS (Applicant Tracking Systems). 
                  El coach te guiará en formatos, palabras clave y estrategia de presentación.
                </p>
                <Link href="/despega/a3/cv-ats" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.5)', color: '#ffffff', borderRadius: '20px' }}>
                    Optimizar CV <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tool 3: Job Matching */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgba(170, 70, 170, 0.8)', borderWidth: '0px 0px 0px 6px', backgroundColor: 'rgba(80, 160, 170, 0.1)', borderRadius: '20px' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  Análisis de Vacante
                </CardTitle>
                <CardDescription className="text-xs mt-1">Estrategia por oferta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Pega una oferta laboral y obtén: match score, CV personalizado y respuestas optimizadas. 
                  Tu coach analiza cada detalle con estrategia específica por posición.
                </p>
                <Link href="/despega/a3/ajuste-por-vacante" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff', borderRadius: '20px' }}>
                    Analizar Oferta <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tool 4: Video Analysis */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgba(170, 70, 170, 0.8)', borderWidth: '0px 0px 0px 6px', backgroundColor: 'rgba(80, 160, 170, 0.1)', borderRadius: '20px' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  Análisis Multimodal
                </CardTitle>
                <CardDescription className="text-xs mt-1">Feedback del coach en video</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Grábate practicando y recibe análisis de IA con feedback personalizado del coach sobre postura, gestos, tono, claridad y contenido. 
                  Feedback detallado en 60 segundos.
                </p>
                <Link href="/despega/a3/analisis-multimodal" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff', borderRadius: '20px' }}>
                    Grabar y Analizar <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 3: Progressive Training Levels */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-5xl font-bold text-purple-400" style={{ color: 'rgb(170, 70, 170)' }}>3</div>
              <div>
                <h2 className="text-3xl font-medium text-white">Entrenamientos Progresivos</h2>
              </div>
            </div>
            <p className="text-lg text-white/85 ml-24" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              4 niveles de dificultad progresiva con feedback del coach. Progresa desde principiante hasta maestría. Avanza cuando domines cada nivel.
            </p>
          </div>

          {/* Level Progression Indicator */}
          <div className="mb-6 px-4 py-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/60">Ruta de aprendizaje:</span>
                <span className="text-training font-semibold">Guiado → Estructurado → Desafiante → Maestría</span>
              </div>
              <span className="text-white/40">Completa cada nivel para desbloquear el siguiente</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Level 1: Guided */}
            <Card className="border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', borderColor: 'rgba(170, 70, 170, 0.6)', borderWidth: '0px 0px 0px 6px', borderRadius: '20px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      Básico
                    </div>
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff' }}>
                      En Progreso
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <CardTitle className="text-2xl">Guiado</CardTitle>
                <CardDescription className="text-base mt-2">Preguntas estructuradas con guía clara. Feedback en tiempo real mientras hablas.</CardDescription>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm">30-45 min por sesión</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm">Primera vez practicando, aprender estructura STAR</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-guiado')}
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.8)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Comenzar Nivel 1 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Level 2: Structured */}
            <Card className="border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', borderColor: 'rgba(170, 70, 170, 0.6)', borderWidth: '0px 0px 0px 6px', borderRadius: '20px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 21H3V3h18v18z"></path>
                      <path d="M15 9l-6 6M9 9l6 6"></path>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: '#b2c450' }}>
                      Intermedio
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <CardTitle className="text-2xl">Estructurado</CardTitle>
                <CardDescription className="text-base mt-2">Preguntas conductuales y técnicas realistas. Presión moderada.</CardDescription>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgb(80, 160, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <path d="M16 2v4M8 2v4M3 10h18"></path>
                    </svg>
                    <span className="text-sm">45-60 min por sesión</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgb(80, 160, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm">Ya conoces STAR, listo para escenarios reales</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-estructurado')}
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.8)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Practicar Nivel 2 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Level 3: Challenging */}
            <Card className="border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', borderColor: 'rgba(170, 70, 170, 0.8)', borderWidth: '0px 0px 0px 6px', borderRadius: '20px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 21H3V3h18v18z"></path>
                      <path d="M15 9l-6 6M9 9l6 6"></path>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: '#ffde47' }}>
                      Avanzado
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <CardTitle className="text-2xl">Desafiante</CardTitle>
                <CardDescription className="text-base mt-2">Preguntas difíciles, sin guía. Simula presión de entrevista ejecutiva.</CardDescription>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="text-sm">60-90 min por sesión</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm">Dominas estructuras, necesitas presión real</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-desafiante')}
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Desafiarse Nivel 3 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Level 4: Mastery */}
            <Card className="border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', borderColor: 'rgba(170, 70, 170, 0.8)', borderWidth: '0px 0px 0px 6px', borderRadius: '20px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: '#ffb21f' }}>
                      Maestría
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <CardTitle className="text-2xl">Conversacional</CardTitle>
                <CardDescription className="text-base mt-2">Entrevista conversacional real con IA. Análisis multimodal completo.</CardDescription>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="text-sm">90-120 min por sesión</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(170, 70, 170, 0.8)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm">Listo para tu entrevista real. Validar maestría.</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/despega/a3/conversational-interview')}
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgb(170, 70, 170)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Entrevista Final <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
