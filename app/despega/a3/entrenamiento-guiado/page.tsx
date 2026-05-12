'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, BookAbrir, Play, Lock, CheckCircle2, Brain, Target, Video, Lightbulb, Loader2 } from 'lucide-react'
import { InteractiveTrainingSession } from '@/components/interactive-training-session'
import { SofiaWelcome } from '@/components/sofia-welcome'

const TRAINING_MODULES = [
  {
    id: 'intro-to-star',
    name: 'Intro a STAR',
    description: 'Aprende la estructura STAR para respuestas de entrevista efectivas',
    icon: Brain,
    difficulty: 'Básico',
    status: 'available',
    progress: 0,
    duration: '45 min',
    lessons: [
      { title: 'Lección 1: Intro a STAR', description: 'Por qué STAR es efectivo', completed: false },
      { title: 'Lección 2: Situación y Tarea', description: 'Cómo plantear el contexto', completed: false },
      { title: 'Lección 3: Acción y Resultado', description: 'Dónde está el impacto real', completed: false },
      { title: 'Lección 4: Dominando STAR', description: 'Poniéndolo todo junto', completed: false },
    ],
  },
]

export default function GuidedTrainingPage() {
  const router = useRouter()
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeModule, setWelcomeModule] = useState<any>(null)

  const handleComenzarModule = (module: any) => {
    if (module.status !== 'locked') {
      setWelcomeModule(module)
      setShowWelcome(true)
    }
  }

  const handleContinueFromWelcome = () => {
    if (welcomeModule) {
      router.push(`/despega/a3/entrenamiento-guiado/${welcomeModule.id}/1`)
      setShowWelcome(false)
    }
  }

  if (showWelcome && welcomeModule) {
    return (
      <SofiaWelcome 
        moduleId={welcomeModule.id}
        moduleName={welcomeModule.name}
        moduleLessonCount={welcomeModule.lessons.length}
        onContinue={handleContinueFromWelcome}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-muted/90 dark:text-white">
            Entrenamiento Guiado
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Aprende junto a tu Coach IA. Módulos progresivos que te llevan de lo básico a dominar entrevistas complejas.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6">
          {TRAINING_MODULES.map((module) => {
            const Icon = module.icon
            const isLocked = module.status === 'locked'

            return (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-training'}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-training" />
                      <div>
                        <CardTitle className="text-xl">{module.name}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{module.difficulty}</Badge>
                      {module.status === 'in-progress' && (
                        <Badge className="rounded-[20px] bg-training">En Progreso</Badge>
                      )}
                      {isLocked && <Lock className="w-5 h-5 text-training" />}
                    </div>
                  </div>

                  <Progress value={module.progress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {module.progress}% completo • {module.duration}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Lessons */}
                  <div className="space-y-2">
                    {module.lessons.map((lesson, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded">
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-training" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-muted/30 rounded-full" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-white/75">{lesson.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleComenzarModule(module)}
                    disabled={isLocked}
                    className="w-full text-white bg-training hover:bg-training/90"
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Bloqueado
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {module.status === 'in-progress' ? 'Continuar' : 'Comenzar'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
