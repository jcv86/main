'use client'

import { useState } from 'react'
import { X, ExternalLink, BookOpen, CheckCircle, AlertCircle, Lightbulb, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TaskDetail } from '@/lib/task-details'

interface TaskDetailModalProps {
  task: TaskDetail
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]))

  if (!isOpen) return null

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber)
    } else {
      newExpanded.add(stepNumber)
    }
    setExpandedSteps(newExpanded)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="bg-background border-muted/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-muted/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Día {task.day}: {task.title}
            </h2>
            <p className="text-sm text-white/60 mt-1">{task.objective}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Descripción Completa
            </h3>
            <p className="text-white/75 leading-relaxed">{task.fullDescription}</p>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Pasos a Seguir
            </h3>
            <div className="space-y-3">
              {task.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="border border-muted/40 rounded-lg overflow-hidden hover:border-muted/60 transition"
                >
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className="w-full px-4 py-3 bg-muted/20 hover:bg-muted/30 transition flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/30 text-blue-400 font-semibold text-sm">
                          {step.stepNumber}
                        </span>
                        <span className="font-semibold text-white">{step.title}</span>
                        <span className="text-xs bg-purple/30 text-white/70 px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>
                    </div>
                    <div className={`transition-transform ${expandedSteps.has(step.stepNumber) ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </button>

                  {expandedSteps.has(step.stepNumber) && (
                    <div className="px-4 py-4 bg-muted/10 border-t border-muted/30 space-y-3">
                      <p className="text-white/75">{step.description}</p>

                      {step.tips && (
                        <div className="bg-amber-500/10 border-l-2 border-amber-500/50 pl-3 py-2 rounded">
                          <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            Tips:
                          </p>
                          <ul className="text-xs text-white/70 space-y-1">
                            {step.tips.map((tip, idx) => (
                              <li key={idx}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.example && (
                        <div className="bg-green-500/10 border-l-2 border-green-500/50 pl-3 py-2 rounded">
                          <p className="text-xs font-semibold text-green-400 mb-1">Ejemplo:</p>
                          <p className="text-xs text-white/70 font-mono">{step.example}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-purple-400" />
              Recursos Recomendados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {task.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 border border-muted/40 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-purple-400 transition text-sm">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-white/60 mt-1">{resource.description}</p>
                      {resource.duration && (
                        <p className="text-xs text-white/50 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </p>
                      )}
                    </div>
                    <span className="text-xs bg-purple/30 text-white/70 px-2 py-1 rounded whitespace-nowrap">
                      {resource.type}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Expected Output */}
          {task.expectedOutput && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Resultado Esperado
              </h3>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-white/75">{task.expectedOutput}</p>
              </div>
            </div>
          )}

          {/* Success Criteria */}
          {task.successCriteria && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Criterios de Éxito
              </h3>
              <div className="space-y-2">
                {task.successCriteria.map((criterion, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-white/75 text-sm">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span>{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {task.commonMistakes && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Errores Comunes a Evitar
              </h3>
              <div className="space-y-2">
                {task.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-white/75 text-sm">
                    <span className="text-amber-400 font-bold mt-0.5">⚠</span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-muted/40">
            <Button
              onClick={onClose}
              className="bg-muted/20 hover:bg-muted/30 text-white"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
