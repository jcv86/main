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
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold text-white">Tu Entrenamiento A3</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Prepárate para entrevistas con práctica guiada, feedback de IA y análisis profundo.
          </p>
        </div>

        {/* Base Foundation Section */}
        <div className="mb-16 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Tu Base Profesional</h2>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Comienza aquí: prepara tu presencia, pitch y documentación.
            </p>
          </div>

          <Card className="border border-blue/30 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-xl">Entrevista 0: Tu Base Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Auditoría completa de tu entorno, presencia, audio y pitch inicial. Identifica qué mejorar antes de practicar.
              </p>
              <Link href="/despega/interview-0" className="block">
                <Button className="w-full bg-blue hover:bg-cyan text-white">
                  Comenzar Auditoría <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Preparation Modules Section */}
        <div className="space-y-4 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Módulos de Preparación</h2>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Construye tu base profesional completa antes de practicar entrevistas simuladas.
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
