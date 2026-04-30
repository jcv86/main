'use client'

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, BarChart3, Target, Video, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function A3DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 flex items-center gap-4">
              <span className="text-5xl">💪</span> Entrenamiento Intensivo
            </h1>
            <p className="text-xl text-white/85 max-w-3xl leading-relaxed">
              Prepárate para entrevistas reales con práctica guiada, feedback de IA en tiempo real y análisis profundo de tu desempeño.
            </p>
          </div>
        </div>

        {/* Base Foundation Section */}
        <div className="mb-16 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">Tu Base Profesional</h2>
            <p className="text-lg text-white/85">
              Comienza aquí: prepara tu presencia, pitch y documentación antes de las simulaciones.
            </p>
          </div>

          <Card className="border-2 border-cyan/40 hover:shadow-xl transition bg-gradient-to-br from-cyan/10 to-blue/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-white">
                <span className="text-3xl">🔍</span> Auditoría: Tu Base Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90 text-lg leading-relaxed">
                Auditoría completa de tu entorno, presencia, audio y pitch inicial. Identifica qué mejorar antes de practicar simulaciones.
              </p>
              <Link href="/despega/interview-0" className="block">
                <Button className="w-full bg-cyan hover:bg-cyan/90 text-black font-bold text-lg py-6">
                  Comenzar Auditoría <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Preparation Modules Section */}
        <div className="space-y-6 mb-16">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">Módulos de Entrenamiento</h2>
            <p className="text-lg text-white/85">
              Elige tu modalidad y comienza a simular entrevistas reales con feedback de IA inmediato.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Module 1: Guided Training */}
            <Card className="border border-blue/30 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue" />
                  Entrenamiento Guiado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Aprende el método STAR: Situación, Tarea, Acción, Resultado. Respuestas estructuradas y claras.
                </p>
                <Link href="/despega/a3/entrenamiento-guiado" className="block">
                  <Button className="w-full bg-blue hover:bg-cyan text-white">
                    Comenzar <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Module 2: CV for ATS */}
            <Card className="border border-cyan/30 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan" />
                  CV Inteligente para ATS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Optimiza tu CV para sistemas de seguimiento de candidatos. Múltiples formatos profesionales.
                </p>
                <Link href="/despega/a3/cv-ats" className="block">
                  <Button className="w-full bg-cyan hover:bg-cyan text-black">
                    Optimizar CV <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Module 3: Job Matching */}
            <Card className="border border-green/30 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green" />
                  Preparación por Vacante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Pega una vacante y obtén análisis de match, CV personalizado y respuestas optimizadas.
                </p>
                <Link href="/despega/a3/ajuste-por-vacante" className="block">
                  <Button className="w-full bg-green hover:bg-emerald-600 text-white">
                    Analizar Vacante <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Module 4: Video Analysis */}
            <Card className="border border-purple/30 hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple" />
                  Análisis en Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Grabate practicando y recibe análisis multimodal de lenguaje corporal, tono y claridad.
                </p>
                <Link href="/despega/a3/analisis-multimodal" className="block">
                  <Button className="w-full bg-purple hover:bg-violet-600 text-white">
                    Analizar Video <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Training Levels Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Entrenamientos por Nivel</h2>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Practica en 4 niveles de dificultad con feedback inmediato de IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border border-muted/30 hover:shadow-lg transition">
              <CardHeader>
                <Badge className="w-fit bg-blue/20 text-blue mb-2">Básico</Badge>
                <CardTitle>Entrenamiento Guiado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Preguntas con guía paso a paso. Feedback en tiempo real mientras practicas.
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-guiado')}
                  className="w-full bg-blue hover:bg-cyan text-white"
                >
                  Comenzar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-muted/30 hover:shadow-lg transition">
              <CardHeader>
                <Badge className="w-fit bg-cyan/20 text-cyan mb-2">Intermedio</Badge>
                <CardTitle>Entrenamiento Estructurado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Entrenamientos conductuales y técnicos con presión moderada.
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-estructurado')}
                  className="w-full bg-cyan hover:bg-cyan text-black"
                >
                  Practicar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-muted/30 hover:shadow-lg transition">
              <CardHeader>
                <Badge className="w-fit bg-green/20 text-green mb-2">Avanzado</Badge>
                <CardTitle>Entrenamiento Desafiante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Preguntas difíciles sin guía. Simula presión de entrevista ejecutiva.
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/entrenamiento-desafiante')}
                  className="w-full bg-green hover:bg-emerald-600 text-white"
                >
                  Desafiarse <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-muted/30 hover:shadow-lg transition">
              <CardHeader>
                <Badge className="w-fit bg-purple/20 text-purple mb-2">Maestría</Badge>
                <CardTitle>Entrevista Conversacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Entrevista real con IA. Análisis multimodal completo con feedback profundo.
                </p>
                <Button 
                  onClick={() => router.push('/despega/a3/conversational-interview')}
                  className="w-full bg-purple hover:bg-violet-600 text-white"
                >
                  Comenzar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
