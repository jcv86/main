'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, Play, Clock, BarChart3, CheckCircle2, AlertCircle, Medal, Download } from 'lucide-react'
import { ModuleCompletionScreen } from '@/components/module-completion-screen'

interface SimulationStage {
  id: string
  name: string
  duration: number
  questions: string[]
  weight: number
}

const SIMULATION_STAGES: SimulationStage[] = [
  {
    id: 'intro',
    name: 'Presentación & Rapport',
    duration: 5,
    questions: [
      'Cuéntame sobre ti',
      'Por qué te interesa nuestra empresa'
    ],
    weight: 15
  },
  {
    id: 'experience',
    name: 'Experiencia Profesional',
    duration: 15,
    questions: [
      'Describe tu rol actual/anterior',
      'Cuéntame sobre tu mayor logro',
      'Desafío más grande y cómo lo resolviste'
    ],
    weight: 25
  },
  {
    id: 'competencies',
    name: 'Competencias Clave',
    duration: 15,
    questions: [
      'Conflicto que enfrentaste - cómo lo manejaste',
      'Decisión difícil que tomaste',
      'Experiencia liderando un equipo'
    ],
    weight: 25
  },
  {
    id: 'technical',
    name: 'Preguntas Técnicas/Específicas',
    duration: 10,
    questions: [
      'Preguntas sobre tu especialidad',
      'Manejo de herramientas/metodologías',
      'Casos de estudio'
    ],
    weight: 20
  },
  {
    id: 'closing',
    name: 'Cierre & Preguntas',
    duration: 5,
    questions: [
      'Preguntas para nosotros',
      'Disponibilidad y próximos pasos'
    ],
    weight: 15
  }
]

const EVALUATION_CRITERIA = [
  { criterion: 'Estructura STAR', weight: 15 },
  { criterion: 'Claridad y Comunicación', weight: 15 },
  { criterion: 'Relevancia y Ejemplos Concretos', weight: 20 },
  { criterion: 'Conexión Emocional', weight: 15 },
  { criterion: 'Respuestas Reflexivas', weight: 15 },
  { criterion: 'Presencia y Confianza', weight: 20 }
]

export default function SimulacionRealPage() {
  const [simulationStarted, setSimulationStarted] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [stageScores, setStageScores] = useState<Record<string, number>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const totalDuration = SIMULATION_STAGES.reduce((sum, stage) => sum + stage.duration, 0)
  const currentStage = SIMULATION_STAGES[currentStageIndex]
  const progress = ((currentStageIndex + 1) / SIMULATION_STAGES.length) * 100

  const startSimulation = () => {
    setSimulationStarted(true)
    setCurrentStageIndex(0)
    setElapsedTime(0)
    setSimulationComplete(false)
    setStageScores({})
  }

  const completeStage = () => {
    const stageScore = Math.floor(Math.random() * 20) + 80
    const newScores = { ...stageScores, [currentStage.id]: stageScore }
    setStageScores(newScores)

    if (currentStageIndex < SIMULATION_STAGES.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1)
    } else {
      const overall = Math.round(
        Object.values(newScores).reduce((sum, score) => sum + score, 0) / Object.values(newScores).length
      )
      setFinalScore(overall)
      setSimulationComplete(true)
    }
  }

  const resetSimulation = () => {
    setSimulationStarted(false)
    setCurrentStageIndex(0)
    setElapsedTime(0)
    setSimulationComplete(false)
    setFinalScore(0)
    setStageScores({})
  }

  if (simulationStarted && !simulationComplete) {
  if (isCompleted) {
    // Module 10 is the last module - only show dashboard button (no "Continuar Práctica")
    return <ModuleCompletionScreen moduleId="simulacion-real" moduleName="Simulación Real" xpEarned={40} />
  }

  return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-black/50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Simulación Real de Entrevista</h1>
              <Button
                onClick={resetSimulation}
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Etapa</p>
                <p className="font-semibold">{currentStageIndex + 1} de {SIMULATION_STAGES.length}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Tiempo Total</p>
                <p className="font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {totalDuration} minutos
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Progreso</p>
                <Progress value={progress} className="h-2 bg-black/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Stage Content */}
        <div className="flex-1 overflow-auto max-w-6xl mx-auto w-full px-6 py-8">
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-purple-500/20 text-purple-300">
                Etapa {currentStageIndex + 1}: {currentStage.name}
              </Badge>
              <h2 className="text-3xl font-bold mb-2">{currentStage.name}</h2>
              <p className="text-white/60">Duración: {currentStage.duration} minutos</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-purple-300 mb-4">Preguntas en esta etapa:</h3>
              <div className="space-y-3">
                {currentStage.questions.map((q, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-purple-400 font-bold flex-shrink-0">{idx + 1}.</span>
                    <p className="text-white/70">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-black border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-300">Instrucciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white/70">
                <p>
                  Responde cada pregunta como si fuera en una entrevista real. Intenta mantener:
                </p>
                <ul className="space-y-2 ml-4">
                  {EVALUATION_CRITERIA.map((criterion, idx) => (
                    <li key={idx} className="text-sm flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{criterion.criterion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black border-purple-500/30">
              <CardContent className="pt-6">
                <textarea
                  placeholder="Escribe o práctica tu respuesta aquí..."
                  className="w-full bg-black border border-purple-500/30 rounded-lg p-4 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none min-h-32"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-purple-500/20 bg-black/50 p-6">
          <div className="max-w-6xl mx-auto flex gap-3 justify-end">
            <Button
              onClick={completeStage}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {currentStageIndex === SIMULATION_STAGES.length - 1 ? 'Finalizar Simulación' : 'Siguiente Etapa'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (simulationComplete) {
    const stagesList = SIMULATION_STAGES.map(stage => ({
      ...stage,
      score: stageScores[stage.id] || 0
    }))

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="border-b border-green-500/20 bg-black/50">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Medal className="w-8 h-8 text-green-500" />
              Simulación Completada
            </h1>
            <p className="text-white/60">Análisis detallado de tu desempeño</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Overall Score */}
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Puntuación General</span>
                <div className="text-5xl font-bold text-green-400">{finalScore}/100</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={finalScore} className="h-3 bg-black/50" />
              <p className="text-white/70 text-sm mt-3">
                {finalScore >= 85 ? '🎉 Excelente desempeño. Listo para entrevista real.' : 
                 finalScore >= 75 ? '✓ Buen desempeño. Sigue practicando.' : 
                 '→ Continúa mejorando con más práctica.'}
              </p>
            </CardContent>
          </Card>

          {/* Stage Breakdown */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Desempeño por Etapa</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stagesList.map((stage) => (
                <Card key={stage.id} className="bg-black border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{stage.name}</span>
                      <span className="text-2xl font-bold text-purple-400">{stage.score}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={stage.score} className="h-2 bg-black/50" />
                    <p className="text-xs text-white/50 mt-2">Ponderación: {stage.weight}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          <Card className="bg-black border-purple-500/30">
            <CardHeader>
              <CardTitle>Criterios de Evaluación Utilizados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {EVALUATION_CRITERIA.map((criterion, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                  <p className="text-white/70">{criterion.criterion}</p>
                  <Badge className="bg-purple-500/20 text-purple-300">{criterion.weight}% peso</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-300">Próximos Pasos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Revisa la grabación</p>
                  <p className="text-white/60 text-sm">Mira dónde podrías mejorar en presencia y claridad</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Repite etapas débiles</p>
                  <p className="text-white/60 text-sm">Enfócate en las etapas con puntuaciones más bajas</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Práctica mock interviews</p>
                  <p className="text-white/60 text-sm">Busca a alguien para hacer mock interviews antes de la entrevista real</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions - Module 10: Special Completion with Full Rewards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎉</span>
                <h3 className="text-xl font-bold text-yellow-300">¡TOUR COMPLETADO!</h3>
              </div>
              <p className="text-white/80 text-sm">
                Has completado los 10 módulos del entrenamiento. Se han desbloqueado premios y beneficios especiales.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => window.location.href = '/despega/a3/rewards'}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              >
                Ver Premios y Recompensas
              </Button>
              <Button
                onClick={resetSimulation}
                variant="outline"
                className="border-purple-500/30 text-white hover:bg-purple-500/10"
              >
                Intentar de Nuevo
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/30 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Reporte
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/despega/a3" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Camino de Aprendizaje
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <Play className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Simulación Real</h1>
              <p className="text-white/60 mt-1">Entrevista simulada completa: aproxímate {totalDuration} minutos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Info Cards */}
          <Card className="bg-black border-purple-500/30">
            <CardContent className="pt-6">
              <p className="text-white/60 text-sm mb-2">Duración Total</p>
              <p className="text-3xl font-bold">{totalDuration} min</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-purple-500/30">
            <CardContent className="pt-6">
              <p className="text-white/60 text-sm mb-2">Etapas</p>
              <p className="text-3xl font-bold">{SIMULATION_STAGES.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-purple-500/30">
            <CardContent className="pt-6">
              <p className="text-white/60 text-sm mb-2">Preguntas Totales</p>
              <p className="text-3xl font-bold">{SIMULATION_STAGES.reduce((sum, s) => sum + s.questions.length, 0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Stages Overview */}
        <h2 className="text-2xl font-bold mb-6">Etapas de la Simulación</h2>
        <div className="space-y-3 mb-8">
          {SIMULATION_STAGES.map((stage, idx) => (
            <Card key={stage.id} className="bg-black border-purple-500/30 hover:border-purple-500/60 transition-colors">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1">Etapa {idx + 1}: {stage.name}</p>
                  <p className="text-sm text-white/60">{stage.questions.length} preguntas • {stage.duration} minutos</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-purple-500/20 text-purple-300 mb-2 block">{stage.weight}% peso</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="bg-blue-500/10 border-blue-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-blue-300">Tips para la Simulación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-200/70 text-sm">
            <p>✓ Prepárate como si fuera una entrevista real</p>
            <p>✓ Responde todas las preguntas completamente</p>
            <p>✓ Recuerda usar la estructura STAR cuando sea relevante</p>
            <p>✓ Mantén buena postura y contacto visual (si tienes cámara)</p>
            <p>✓ Tómate tiempo para pensar antes de responder</p>
          </CardContent>
        </Card>

        {/* Start Button */}
        <Button
          onClick={startSimulation}
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Simulación Real
        </Button>
      </div>

      {/* Navigation */}
      <div className="border-t border-purple-500/20 bg-black/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between">
          <Link href="/despega/a3/entrenamiento-conversacional">
            <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior: Entrenamiento Conversacional
            </Button>
          </Link>
          <Link href="/despega/a3">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Terminar & Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
