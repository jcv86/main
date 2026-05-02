'use client'

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
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

          <div className="grid md:grid-cols-2 gap-4">
            {/* Level 1: Guided */}
            <Card className="border-2 hover:shadow-lg transition" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderRadius: '2px', borderStyle: 'none' }}>
              <CardHeader>
                <Badge className="w-fit mb-2" style={{ backgroundColor: 'rgb(170, 70, 170, 0.4)', color: 'rgb(170, 70, 170, 0.8)', border: 'none' }}>
                  Nivel 1 - Principiante
                </Badge>
                <CardTitle className="text-2xl">Guiado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Contexto:</strong> Preguntas estructuradas con guía clara. Feedback en tiempo real mientras hablas.
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Duración:</strong> 30-45 min por sesión
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Ideal para:</strong> Primera vez practicando, aprender estructura STAR
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-guiado')}
                  className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Comenzar Nivel 1 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Level 2: Structured */}
            <Card className="border-2 hover:shadow-lg transition" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderRadius: '2px', borderStyle: 'none' }}>
              <CardHeader>
                <Badge className="w-fit mb-2" style={{ backgroundColor: 'rgb(170, 70, 170, 0.4)', color: 'rgb(170, 70, 170, 0.8)', border: 'none' }}>
                  Nivel 2 - Intermedio
                </Badge>
                <CardTitle className="text-2xl">Estructurado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Contexto:</strong> Preguntas conductuales y técnicas realistas. Presión moderada.
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Duración:</strong> 45-60 min por sesión
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Ideal para:</strong> Ya conoces STAR, listo para escenarios reales
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-estructurado')}
                  className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Practicar Nivel 2 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Level 3: Challenging */}
            <Card className="border-2 hover:shadow-lg transition" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderRadius: '2px', borderStyle: 'none' }}>
              <CardHeader>
                <Badge className="w-fit mb-2" style={{ backgroundColor: 'rgb(170, 70, 170, 0.4)', color: 'rgb(170, 70, 170, 0.8)', border: 'none' }}>
                  Nivel 3 - Avanzado
                </Badge>
                <CardTitle className="text-2xl">Desafiante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Contexto:</strong> Preguntas difíciles, sin guía. Simula presión de entrevista ejecutiva.
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Duración:</strong> 60-90 min por sesión
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Ideal para:</strong> Dominas estructuras, necesitas presión real
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-desafiante')}
                  className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Desafiarse Nivel 3 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Level 4: Mastery */}
            <Card className="border-2 hover:shadow-lg transition" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderRadius: '2px', borderStyle: 'none' }}>
              <CardHeader>
                <Badge className="w-fit mb-2" style={{ backgroundColor: 'rgb(170, 70, 170, 0.4)', color: 'rgb(170, 70, 170, 0.8)', border: 'none' }}>
                  Nivel 4 - Maestría
                </Badge>
                <CardTitle className="text-2xl">Conversacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Contexto:</strong> Entrevista conversacional real con IA. Análisis multimodal completo.
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Duración:</strong> 90-120 min por sesión
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  <strong>Ideal para:</strong> Listo para tu entrevista real. Validar maestría.
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/conversational-interview')}
                  className="w-full font-semibold" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)', color: '#ffffff', borderRadius: '20px' }}
                >
                  Entrevista Final <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
