'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, Play, Trophy, Zap, Lock, CheckCircle } from 'lucide-react'

const LEARNING_MODULES = [
  {
    id: 'economia-basica',
    title: 'Economía Básica',
    description: 'Conceptos fundamentales de mercados, inflación, tasa de interés y ciclos económicos.',
    difficulty: 'Principiante',
    icon: '💰',
    duration: '15 min',
    points: 50,
    completed: false,
    locked: false,
  },
  {
    id: 'industrias-chile',
    title: 'Industrias en Chile',
    description: 'Análisis de los sectores principales: minería, retail, tecnología, servicios financieros.',
    difficulty: 'Intermedio',
    icon: '🏭',
    duration: '20 min',
    points: 75,
    completed: false,
    locked: false,
  },
  {
    id: 'tendencias-laborales',
    title: 'Tendencias Laborales 2024-2025',
    description: 'Remote work, automatización, upskilling y transformación digital de las empresas.',
    difficulty: 'Intermedio',
    icon: '📈',
    duration: '18 min',
    points: 75,
    completed: false,
    locked: false,
  },
  {
    id: 'comunicacion-empresarial',
    title: 'Comunicación Empresarial',
    description: 'Cómo funcionan las comunicaciones, branding, posicionamiento y narrativas en empresas.',
    difficulty: 'Intermedio',
    icon: '💬',
    duration: '22 min',
    points: 100,
    completed: false,
    locked: false,
  },
  {
    id: 'liderazgo-moderno',
    title: 'Liderazgo Moderno',
    description: 'Estilos de liderazgo, gestión de equipos remotos, inteligencia emocional en empresas.',
    difficulty: 'Avanzado',
    icon: '👑',
    duration: '25 min',
    points: 125,
    completed: false,
    locked: true,
  },
  {
    id: 'innovacion-disrupcion',
    title: 'Innovación y Disrupción',
    description: 'Startups vs corporativos, modelos de negocio, transformación digital y agile.',
    difficulty: 'Avanzado',
    icon: '🚀',
    duration: '30 min',
    points: 150,
    completed: false,
    locked: true,
  },
]

export default function A4AprendePage() {
  const [modules, setModules] = useState(LEARNING_MODULES)
  const [userPoints, setUserPoints] = useState(0)
  const [completedModules, setCompletedModules] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadUserProgress()
  }, [])

  const loadUserProgress = async () => {
    // Calculate from modules
    const completed = modules.filter(m => m.completed).length
    const points = modules
      .filter(m => m.completed)
      .reduce((sum, m) => sum + m.points, 0)

    setCompletedModules(completed)
    setUserPoints(points)
  }

  const handleStartModule = async (moduleId: string) => {
    console.log('Starting module:', moduleId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega/a4" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a A4
          </Link>
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Cultura General Profesional</h1>
              <p className="text-muted-foreground">Tests gamificados sobre economía, industrias, tendencias y liderazgo. Aprende mientras ganas puntos.</p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-blue-500/5 backdrop-blur-sm mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Módulos Completados</p>
                <p className="text-3xl font-bold">{completedModules}/{modules.length}</p>
                <Progress value={(completedModules / modules.length) * 100} className="mt-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Puntos Totales</p>
                <p className="text-3xl font-bold flex items-center gap-2">
                  {userPoints} <Trophy className="w-6 h-6 text-amber-500" />
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Racha Actual</p>
                <p className="text-3xl font-bold">7 días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`group border-0 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                module.locked
                  ? 'bg-muted/30 opacity-60 cursor-not-allowed'
                  : 'bg-card/70 hover:bg-card hover:shadow-md cursor-pointer'
              }`}
            >
              <CardHeader className={`pb-3 ${module.locked ? 'bg-muted/10' : ''}`}>
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{module.icon}</span>
                  <div className="flex gap-2">
                    {module.completed && (
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completado
                      </Badge>
                    )}
                    {module.locked && (
                      <Badge variant="outline" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Bloqueado
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {module.points} pts
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl mt-3">{module.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{module.difficulty}</span>
                  <span>{module.duration}</span>
                </div>

                {!module.locked && (
                  <Button
                    onClick={() => handleStartModule(module.id)}
                    disabled={module.completed}
                    className="w-full"
                    variant={module.completed ? 'secondary' : 'default'}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {module.completed ? 'Repetir' : 'Comenzar'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unlock Hint */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm mt-8">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Los últimos módulos se desbloquean al completar los anteriores.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
