'use client'

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, BarChart3, Target, Video, ArrowRight, Clock, Zap as ZapIcon, Flame } from 'lucide-react'
import Link from 'next/link'
import A3ProgressDashboard from '@/components/a3-progress-dashboard'

export default function EntrenamientoIntensivePage() {
  const router = useRouter()

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
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video5456517059192072708-4x4BoFPTrPyPGPszqW0UjXCtGBOzqg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        {/* Step 1: Diagnostic Audit */}
        <div className="mb-16 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">Paso 1: Tu Diagnóstico Inicial</h2>
            <p className="text-lg text-white/85" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Antes de entrenar, necesitamos entender tu punto de partida. Una auditoría rápida de tu ambiente, presencia y pitch.
            </p>
          </div>

          <Card className="border-2 border-training/40 hover:shadow-xl transition" style={{ borderRadius: '2px', backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgb(170, 70, 170, 0.4)', borderStyle: 'none' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-white">
                <span></span> Auditoría: Tu Base Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90 text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Análisis completo de tu ambiente, iluminación, audio, presencia en cámara y pitch profesional inicial. 
                Identifica qué mejorar antes de las simulaciones intensivas.
              </p>
              <Link href="/despega/interview-0" className="block">
                <Button className="w-full font-bold text-lg py-6" style={{ backgroundColor: 'rgb(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}>
                  Comenzar Diagnóstico <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Preparation Tools */}
        <div className="space-y-6 mb-16">
          <div>
            <h2 className="text-4xl font-medium text-white mb-3">Paso 2: Prepara tu Arsenal</h2>
            <p className="text-lg text-white/85" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Optimiza tu CV, aprende metodología STAR, analiza ofertas y practica en video. Herramientas específicas para cada fase.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Tool 1: STAR Method */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px', backgroundColor: 'rgba(80, 160, 170, 0.2)', borderStyle: 'none' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  Método STAR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Aprende a estructurar respuestas: Situación → Tarea → Acción → Resultado. 
                  El estándar para respuestas profesionales claras.
                </p>
                <Link href="/despega/a3/entrenamiento-guiado" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}>
                    Aprender STAR <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tool 2: CV Optimization */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px', backgroundColor: 'rgba(80, 160, 170, 0.2)', borderStyle: 'none' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  CV Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Optimiza tu CV para sistemas ATS (Applicant Tracking Systems). 
                  Múltiples formatos y feedback instantáneo.
                </p>
                <Link href="/despega/a3/cv-ats" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgb(170, 70, 170, 0.8)', color: '#ffffff', borderRadius: '20px' }}>
                    Optimizar CV <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tool 3: Job Matching */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px', backgroundColor: 'rgba(80, 160, 170, 0.2)', borderStyle: 'none' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  Análisis de Vacante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Pega una oferta laboral y obtén: match score, CV personalizado y respuestas optimizadas. 
                  Estrategia por cada postulación.
                </p>
                <Link href="/despega/a3/ajuste-por-vacante" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}>
                    Analizar Oferta <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tool 4: Video Analysis */}
            <Card className="border hover:shadow-lg transition" style={{ borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px', backgroundColor: 'rgba(80, 160, 170, 0.2)', borderStyle: 'none' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5" style={{ color: 'rgb(170, 70, 170, 0.8)' }} />
                  Análisis Multimodal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Grábate practicando y recibe análisis de IA sobre postura, gestos, tono, claridad y contenido. 
                  Feedback detallado en 60 segundos.
                </p>
                <Link href="/despega/a3/analisis-multimodal" className="block">
                  <Button className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}>
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
            <h2 className="text-4xl font-medium text-white mb-3">Paso 3: Entrena en 4 Niveles</h2>
            <p className="text-lg text-white/85" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Progresión desde principiante hasta maestría. Cada nivel aumenta complejidad, presión y feedback profundo. Avanza cuando domines el anterior.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Level 1: Guided */}
            <Card className="rounded-[28px] border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px' }}>
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
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80" style={{ backgroundColor: 'rgba(80, 160, 170, 0.4)', color: '#71c450' }}>
                      Básico
                    </div>
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgb(170, 70, 170, 0.6)', color: '#ffffff' }}>
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
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Comenzar Nivel 1 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Level 2: Structured */}
            <Card className="rounded-[28px] border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 21H3V3h18v18z"></path>
                      <path d="M15 9l-6 6M9 9l6 6"></path>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgba(150, 150, 150)', color: '#ffffff' }}>
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
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Practicar Nivel 2 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Level 3: Challenging */}
            <Card className="rounded-[28px] border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 21H3V3h18v18z"></path>
                      <path d="M15 9l-6 6M9 9l6 6"></path>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgba(150, 150, 150)', color: '#ffffff' }}>
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
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Desafiarse Nivel 3 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Level 4: Mastery */}
            <Card className="rounded-[28px] border cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgb(170, 70, 170, 0.4)', borderRadius: '2px' }}>
              <div className="flex flex-col">
                <div className="flex items-start p-6 pt-6">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" style={{ color: 'rgba(170, 70, 170, 0.6)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <div className="inline-flex items-center rounded-[16px] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent" style={{ backgroundColor: 'rgba(150, 150, 150)', color: '#ffffff' }}>
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
                  className="w-full mt-4 font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
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
