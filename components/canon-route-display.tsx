'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Link2 } from "lucide-react"
import { useState } from "react"

interface TraceabilityItem {
  missionId: string
  title: string
  description: string
  day: number
  phase: '30' | '60' | '90'
  sourceRule: string
  sourceResponses: {
    questionText: string
    userAnswer: string
    ruleLogic: string
  }[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedHours: number
}

interface CanonRouteDisplayProps {
  missions: TraceabilityItem[]
  userProfile: {
    name: string
    dominantProfile: string
    c1Responses: Record<string, string>
    c2Phase1Responses: Record<string, string>
  }
}

export function CanonRouteDisplay({ missions, userProfile }: CanonRouteDisplayProps) {
  const [expandedMissions, setExpandedMissions] = useState<Set<string>>(new Set())

  const toggleExpand = (missionId: string) => {
    const newExpanded = new Set(expandedMissions)
    if (newExpanded.has(missionId)) {
      newExpanded.delete(missionId)
    } else {
      newExpanded.add(missionId)
    }
    setExpandedMissions(newExpanded)
  }

  const missionsByPhase = {
    '30': missions.filter(m => m.phase === '30'),
    '60': missions.filter(m => m.phase === '60'),
    '90': missions.filter(m => m.phase === '90')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getRuleIcon = (rule: string) => {
    if (rule.includes('productividad')) return '⚡'
    if (rule.includes('miedo')) return '🛡️'
    if (rule.includes('tiempo')) return '⏱️'
    if (rule.includes('ambición')) return '🚀'
    return '📌'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Tu Ruta de Transformación</h1>
          <p className="text-lg text-slate-300">Generada especialmente para ti basada en tus respuestas</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(missionsByPhase).map(([phase, phaseMissions]) => (
            <Card key={phase} className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{phaseMissions.length}</div>
                  <p className="text-sm text-slate-400">Misiones Día {phase}</p>
                  <div className="mt-3 text-2xl">
                    {phase === '30' ? '🎯' : phase === '60' ? '🔥' : '🏆'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* WOW Moment Explanation */}
      <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Cómo se generó tu ruta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-100 text-sm">
            Cada misión que ves a continuación fue generada basada en tus respuestas específicas.
            Haz clic en cualquier misión para ver exactamente qué respondiste y por qué apareció aquí.
          </p>
        </CardContent>
      </Card>

      {/* Missions by Phase */}
      {(['30', '60', '90'] as const).map((phase) => (
        <div key={phase}>
          <h2 className="text-2xl font-bold text-white mb-4">
            {phase === '30' ? '🎯 Fase 1: Primeros 30 Días' : phase === '60' ? '🔥 Fase 2: Días 31-60' : '🏆 Fase 3: Días 61-90'}
          </h2>
          
          <div className="space-y-3">
            {missionsByPhase[phase as keyof typeof missionsByPhase].map((mission, idx) => (
              <Card 
                key={mission.missionId}
                className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                onClick={() => toggleExpand(mission.missionId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getRuleIcon(mission.sourceRule)}</span>
                        <Badge className={`${getDifficultyColor(mission.difficulty)}`}>
                          {mission.difficulty === 'easy' ? 'Fácil' : mission.difficulty === 'medium' ? 'Medio' : 'Desafiante'}
                        </Badge>
                        <Badge variant="outline" className="text-slate-300">
                          Día {mission.day}
                        </Badge>
                        <Badge variant="outline" className="text-slate-300">
                          {mission.estimatedHours}h
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">{mission.title}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{mission.description}</CardDescription>
                    </div>
                    <div className="ml-4">
                      {expandedMissions.has(mission.missionId) ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expandable Traceability Section */}
                {expandedMissions.has(mission.missionId) && (
                  <CardContent className="border-t border-slate-700 pt-4">
                    <div className="space-y-4 bg-slate-900 rounded-lg p-4">
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">¿Por qué esta misión?</h4>
                        <p className="text-sm text-slate-300">
                          Generada por la regla: <span className="font-semibold text-yellow-400">{mission.sourceRule}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-blue-400">Tus respuestas que la generaron:</h4>
                        {mission.sourceResponses.map((response, idx) => (
                          <div key={idx} className="bg-slate-800 rounded p-3 border-l-4 border-blue-500">
                            <p className="text-xs text-slate-400 mb-1">Tu respuesta a:</p>
                            <p className="text-sm text-white font-medium mb-2">{response.questionText}</p>
                            <div className="bg-slate-700 rounded p-2 mb-2">
                              <p className="text-sm text-slate-200 italic">"{response.userAnswer}"</p>
                            </div>
                            <p className="text-xs text-slate-300">
                              <span className="text-green-400">→</span> {response.ruleLogic}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Progress Tracking */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tu Progreso</CardTitle>
          <CardDescription>Completarás esta ruta en 90 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Misiones totales</span>
                <span className="text-sm font-medium text-blue-400">{missions.length}</span>
              </div>
              <Progress value={(missions.filter(m => m.phase === '30').length / missions.length) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-400">{missionsByPhase['30'].length}</p>
                <p className="text-xs text-slate-400">Días 1-30</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{missionsByPhase['60'].length}</p>
                <p className="text-xs text-slate-400">Días 31-60</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{missionsByPhase['90'].length}</p>
                <p className="text-xs text-slate-400">Días 61-90</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
