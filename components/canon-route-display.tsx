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
      case 'easy': return 'bg-green/10 text-green'
      case 'medium': return 'bg-yellow/10 text-yellow'
      case 'hard': return 'bg-red/10 text-red'
      default: return 'bg-muted/10 text-muted/80'
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
          <p className="text-lg text-muted/30">Generada especialmente para ti basada en tus respuestas</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(missionsByPhase).map(([phase, phaseMissions]) => (
            <Card key={phase} className="bg-muted/80 border-muted/70">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue/40 mb-2">{phaseMissions.length}</div>
                  <p className="text-sm text-muted/40">Misiones Día {phase}</p>
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
      <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-purple">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Cómo se generó tu ruta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted/10 text-sm">
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
                className="bg-muted/80 border-muted/70 hover:border-muted/60 transition-all cursor-pointer"
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
                        <Badge variant="outline" className="text-muted/30">
                          Día {mission.day}
                        </Badge>
                        <Badge variant="outline" className="text-muted/30">
                          {mission.estimatedHours}h
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">{mission.title}</CardTitle>
                      <CardDescription className="text-muted/40 mt-1">{mission.description}</CardDescription>
                    </div>
                    <div className="ml-4">
                      {expandedMissions.has(mission.missionId) ? (
                        <ChevronUp className="w-5 h-5 text-muted/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted/40" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expandable Traceability Section */}
                {expandedMissions.has(mission.missionId) && (
                  <CardContent className="border-t border-muted/70 pt-4">
                    <div className="space-y-4 bg-muted/90 rounded-[28px] p-4">
                      <div>
                        <h4 className="text-sm font-semibold text-blue/40 mb-2">¿Por qué esta misión?</h4>
                        <p className="text-sm text-muted/30">
                          Generada por la regla: <span className="font-semibold text-yellow/40">{mission.sourceRule}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-blue/40">Tus respuestas que la generaron:</h4>
                        {mission.sourceResponses.map((response, idx) => (
                          <div key={idx} className="bg-muted/80 rounded p-3 border-l-4 border-blue/50">
                            <p className="text-xs text-muted/40 mb-1">Tu respuesta a:</p>
                            <p className="text-sm text-white font-medium mb-2">{response.questionText}</p>
                            <div className="bg-muted/70 rounded p-2 mb-2">
                              <p className="text-sm text-muted/20 italic">"{response.userAnswer}"</p>
                            </div>
                            <p className="text-xs text-muted/30">
                              <span className="text-green/40">→</span> {response.ruleLogic}
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
      <Card className="bg-muted/80 border-muted/70">
        <CardHeader>
          <CardTitle className="text-white">Tu Progreso</CardTitle>
          <CardDescription>Completarás esta ruta en 90 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-muted/30">Misiones totales</span>
                <span className="text-sm font-medium text-blue/40">{missions.length}</span>
              </div>
              <Progress value={(missions.filter(m => m.phase === '30').length / missions.length) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue/40">{missionsByPhase['30'].length}</p>
                <p className="text-xs text-muted/40">Días 1-30</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple/40">{missionsByPhase['60'].length}</p>
                <p className="text-xs text-muted/40">Días 31-60</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{missionsByPhase['90'].length}</p>
                <p className="text-xs text-muted/40">Días 61-90</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
