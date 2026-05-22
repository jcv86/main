'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, Lock, CheckCircle2 } from 'lucide-react'

interface TrainingLevel {
  id: 'basico' | 'intermedio' | 'avanzado'
  title: string
  description: string
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado'
  questionsCount: number
  estimatedTime: string
  focus: string[]
  nextSkills: string[]
  icon: React.ReactNode
  color: string
  bgColor: string
  isLocked?: boolean
}

interface A3TrainingLevelsProps {
  userProgress?: {
    basico: { completed: number; score: number }
    intermedio: { completed: number; score: number }
    avanzado: { completed: number; score: number }
  }
}

export function A3TrainingLevels({ userProgress }: A3TrainingLevelsProps) {
  const levels: TrainingLevel[] = [
    {
      id: 'basico',
      title: 'Nivel Guiado',
      description: 'Comienza con preguntas fundacionales. Recibe guía paso a paso y retroalimentación en tiempo real.',
      difficulty: 'Básico',
      questionsCount: 3,
      estimatedTime: '15-20 min',
      focus: ['Claridad', 'Presencia', 'Estructura'],
      nextSkills: ['Respiración', 'Contacto visual', 'Tono'],
      icon: <Zap className="w-6 h-6" />,
      color: 'text-blue dark:text-blue/40',
      bgColor: 'bg-blue/5 dark:bg-blue/20',
      isLocked: false
    },
    {
      id: 'intermedio',
      title: 'Nivel Estructurado',
      description: 'Preguntas situacionales más desafiantes. Demuestra tu capacidad de análisis y toma de decisiones.',
      difficulty: 'Intermedio',
      questionsCount: 3,
      estimatedTime: '20-25 min',
      focus: ['Análisis', 'Decisiones', 'Impacto'],
      nextSkills: ['Storytelling', 'Métricas', 'Liderazgo'],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-purple dark:text-purple/40',
      bgColor: 'bg-purple/5 dark:bg-purple/20',
      isLocked: !userProgress?.basico?.completed || userProgress.basico.completed === 0
    },
    {
      id: 'avanzado',
      title: 'Nivel Desafiante',
      description: 'Preguntas estratégicas de alto nivel. Muestra pensamiento ejecutivo y capacidad de innovación.',
      difficulty: 'Avanzado',
      questionsCount: 3,
      estimatedTime: '25-30 min',
      focus: ['Estrategia', 'Innovación', 'Visión'],
      nextSkills: ['Pensamiento sistémico', 'Adaptabilidad', 'Maestría'],
      icon: <Zap className="w-6 h-6" />,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      isLocked: !userProgress?.intermedio?.completed || userProgress.intermedio.completed === 0
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {levels.map((level) => (
        <Card
          key={level.id}
          className={`relative overflow-hidden transition-all hover:shadow-lg ${`}
            level.isLocked ? 'opacity-60' : 'hover:border-muted/40'`}
          }`}
        >
          {/* Status Badge */}
          {level.isLocked && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Bloqueado
              </Badge>
            </div>
          )}
          {userProgress?.[level.id]?.completed && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(170, 70, 170)' }} />
                Completado
              </Badge>
            </div>
          )}

          <CardHeader>
            <div className={`w-12 h-12 rounded-lg ${level.bgColor} flex items-center justify-center mb-4 ${level.color}`}>
              {level.icon}
            </div>
            <CardTitle className="text-xl">{level.title}</CardTitle>
            <CardDescription>{level.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Level Stats */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 rounded-[28px] bg-muted/5 dark:bg-transparent">
                <p className="font-semibold text-muted/90 dark:text-white">{level.questionsCount}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">Preguntas</p>
              </div>
              <div className="text-center p-2 rounded-[28px] bg-muted/5 dark:bg-transparent">
                <p className="font-semibold text-muted/90 dark:text-white">{level.estimatedTime}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">Tiempo</p>
              </div>
              <div className="text-center p-2 rounded-[28px] bg-muted/5 dark:bg-transparent">
                <p className="font-semibold text-muted/90 dark:text-white">{level.difficulty}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">Nivel</p>
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground uppercase mb-2">Enfoque</p>
              <div className="flex flex-wrap gap-2">
                {level.focus.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>

            {/* User Progress */}
            {userProgress?.[level.id]?.completed && (
              <div className="p-3 rounded-[28px] bg-green/5 dark:bg-green/20 border border-green/20 dark:border-green">
                <p className="text-sm font-semibold text-green dark:text-green/20">
                  Score: {userProgress[level.id].score}
                </p>
                <p className="text-xs text-green dark:text-green/30">
                  {userProgress[level.id].completed} intento{userProgress[level.id].completed !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <Button
              asChild
              disabled={level.isLocked}
              className="w-full gap-2"
              style={{
                backgroundColor: level.isLocked ? 'rgba(219, 217, 215, 0.7)' : 'rgba(170, 70, 170, 0.6)',
                borderRadius: '20px',
                opacity: level.isLocked ? 0.5 : 1,
                cursor: level.isLocked ? 'not-allowed' : 'pointer'
              }}
            >
              <Link href={`/despega/a3/conversational-interview?level=${level.id}`}>
                {level.isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Completa nivel anterior
                  </>
                ) : userProgress?.[level.id]?.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(170, 70, 170)' }} />
                    Practicar de Nuevo
                  </>
                ) : (
                  <>
                    <span>Comenzar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
