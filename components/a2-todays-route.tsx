'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { A2DailyTask, getA2DailyTask, A2_TASK_TYPES_INFO } from '@/lib/a2-daily-tasks'

interface TodaysRouteProps {
  dayNumber: number
  onTaskComplete?: () => void
}

export function A2TodaysRoute({ dayNumber, onTaskComplete }: TodaysRouteProps) {
  const task = getA2DailyTask(dayNumber)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  if (!task) {
    return null
  }

  const taskTypeInfo = A2_TASK_TYPES_INFO[task.type]
  const priorityColor =
    task.priority === 'high'
      ? 'bg-red-500/20 text-red-300'
      : task.priority === 'medium'
        ? 'bg-yellow-500/20 text-yellow-300'
        : 'bg-blue-500/20 text-blue-300'

  return (
    <Card className="border-[rgb(80,160,170)]/30 bg-black">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{taskTypeInfo.icon}</span>
              <Badge className={taskTypeInfo.color}>{taskTypeInfo.label}</Badge>
              <Badge className={priorityColor}>
                {task.priority === 'high' ? '🔥 High Priority' : task.priority === 'medium' ? 'Medium' : 'Low'}
              </Badge>
            </div>
            <CardTitle className="text-white text-xl">Day {task.day}: {task.title}</CardTitle>
            <p className="text-sm text-white/60">{task.description}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[rgb(80,160,170)]"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[rgb(80,160,170)]/10 rounded p-3 border border-[rgb(80,160,170)]/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[rgb(80,160,170)]" />
                <span className="text-xs text-white/60">Duration</span>
              </div>
              <p className="text-lg font-bold text-white">{task.duration}min</p>
            </div>
            <div className="bg-[rgb(170,70,170)]/10 rounded p-3 border border-[rgb(170,70,170)]/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[rgb(170,70,170)]" />
                <span className="text-xs text-white/60">XP Reward</span>
              </div>
              <p className="text-lg font-bold text-[rgb(170,70,170)]">+{task.xpReward}</p>
            </div>
            <div className="bg-blue-500/10 rounded p-3 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/60">Status</span>
              </div>
              <p className="text-lg font-bold text-blue-300">{isCompleted ? 'Done!' : 'Todo'}</p>
            </div>
          </div>

          {/* Actions/Checklist */}
          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Action Items:</h4>
                <ul className="space-y-2">
                  {task.actions.map((action, idx) => (
                    <li key={idx} className="flex gap-2">
                      <div className="w-5 h-5 rounded border border-[rgb(80,160,170)]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[rgb(80,160,170)]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{action.action}</p>
                        <p className="text-xs text-white/50">💡 {action.tip}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success Criteria */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Success Criteria:</h4>
                <ul className="space-y-1">
                  {task.successCriteria.map((criteria, idx) => (
                    <li key={idx} className="text-xs text-white/70">{criteria}</li>
                  ))}
                </ul>
              </div>

              {/* Real World Action */}
              {task.relatedRealWorldAction && (
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                  <p className="text-xs text-white/60 mb-1">Real-World Impact:</p>
                  <p className="text-sm text-green-300 font-medium">🚀 {task.relatedRealWorldAction}</p>
                </div>
              )}

              {/* Connected Module */}
              {task.connectedModule && (
                <div className="bg-[rgb(170,70,170)]/10 border border-[rgb(170,70,170)]/20 rounded p-3">
                  <p className="text-xs text-white/60 mb-1">Connected Learning Module:</p>
                  <p className="text-sm text-[rgb(170,70,170)] font-medium">📚 Open A3 module for deeper learning</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => {
                setIsCompleted(!isCompleted)
                if (!isCompleted) onTaskComplete?.()
              }}
              className={
                isCompleted
                  ? 'flex-1 bg-green-600 hover:bg-green-700 text-white'
                  : 'flex-1 bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] text-white'
              }
            >
              {isCompleted ? '✓ Completado' : 'Mark as Complete'}
            </Button>
            {task.connectedModule && (
              <Button variant="outline" className="flex-1 border-[rgb(170,70,170)]/30 text-[rgb(170,70,170)]">
                Open A3 Module
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
