'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Lock, CheckCircle, Play } from 'lucide-react'
import { getTestsStatus, calculateA1Progress, TESTS_INFO } from '@/lib/a1-tests-unified-logic'

interface A1HubProps {
  completedTests: Record<string, boolean>
  isPremium: boolean
}

export default function A1TestsHub({ completedTests = {}, isPremium = false }: A1HubProps) {
  const router = useRouter()
  const [testsStatus, setTestsStatus] = useState<Record<string, 'locked' | 'available' | 'completed'>>({})
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const status = getTestsStatus(completedTests)
    setTestsStatus(status)
    setProgress(calculateA1Progress(completedTests))
  }, [completedTests])

  const testOrder = [
    { key: 'cerebral', path: '/test-cerebral' },
    { key: 'inteligencia_emocional', path: '/despega/a1/tests/inteligencia-emocional' },
    { key: 'mapa_personalidad', path: '/despega/a1/tests/mapa-personalidad' },
    { key: 'cinco_dimensiones', path: '/despega/a1/tests/cinco-dimensiones' },
    { key: 'brujula_vocacional', path: '/despega/a1/tests/brujula-vocacional' },
    { key: 'competencias', path: '/despega/a1/tests/competencias' },
  ]

  const handleStartTest = (testKey: string, path: string) => {
    const status = testsStatus[testKey]
    if (status === 'locked') return
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tests Despega A1</h1>
          <p className="text-muted-foreground">Descubre tu perfil completando nuestros tests psicométricos</p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Tu progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {Object.values(completedTests).filter(Boolean).length} de {Object.keys(completedTests).length} tests completados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testOrder.map(({ key, path }) => {
            const status = testsStatus[key]
            const info = TESTS_INFO[key as keyof typeof TESTS_INFO]
            const isCompleted = status === 'completed'
            const isLocked = status === 'locked'

            return (
              <Card
                key={key}
                className={`relative transition-all ${
                  isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
                } ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{info.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{info.level}</CardDescription>
                    </div>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{info.description}</p>

                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>⏱ {info.duration}</span>
                    <span>📋 {info.questions} preguntas</span>
                  </div>

                  {isLocked && (
                    <p className="text-xs text-amber-600">Completa los tests requeridos primero</p>
                  )}

                  <Button
                    onClick={() => handleStartTest(key, path)}
                    disabled={isLocked}
                    variant={isCompleted ? 'outline' : 'default'}
                    className="w-full"
                    size="sm"
                  >
                    {isCompleted ? (
                      <>Ver Resultado</>
                    ) : isLocked ? (
                      <>Bloqueado</>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" /> Iniciar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Premium CTA */}
        {!isPremium && progress > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">Desbloquea tu Informe Completo</CardTitle>
              <CardDescription>
                Acceso a análisis detallado, comparativas y recomendaciones personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Actualizar a Premium</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
