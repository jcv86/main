'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, BookOpen, Wrench, Users, ClipboardList, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TaskDetailModal } from '@/components/task-detail-modal'
import { getTaskDetail } from '@/lib/task-details'

export interface Task {
  day: number
  title: string
  description: string
  type: 'learning' | 'practice' | 'networking' | 'planning' | 'milestone'
  timeEstimate: number
  resources?: string[]
  prerequisite?: boolean
}

interface TaskCardProps {
  task: Task
  completed?: boolean
  onComplete?: (taskId: string) => void
  taskId: string
}

const taskTypeIcons = {
  learning: { icon: <BookOpen className="w-6 h-6" />, label: 'Aprender', color: 'text-blue/40' },
  practice: { icon: <Wrench className="w-6 h-6" />, label: 'Practicar', color: 'text-yellow-400' },
  networking: { icon: <Users className="w-6 h-6" />, label: 'Conectar', color: 'text-pink-400' },
  planning: { icon: <ClipboardList className="w-6 h-6" />, label: 'Planificar', color: 'text-purple/40' },
  milestone: { icon: <Trophy className="w-6 h-6" />, label: 'Hito', color: 'text-emerald-400' },
}

const taskTypeEmojis = {
  learning: '📚',
  practice: '🛠️',
  networking: '🤝',
  planning: '📋',
  milestone: '🏆',
}

export function TaskCard({ task, completed = false, onComplete, taskId }: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(completed)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const taskDetail = getTaskDetail(task.day)
  const typeInfo = taskTypeIcons[task.type]
  const emoji = taskTypeEmojis[task.type]

  const handleComplete = () => {
    setIsCompleted(!isCompleted)
    onComplete?.(taskId)
  }

  const hours = Math.round(task.timeEstimate / 60)
  const minutes = task.timeEstimate % 60

  return (
    <>
      <div className={`transition-all duration-200 ${isCompleted ? 'opacity-60' : ''}`}>
        <div 
          className={`bg-muted/20 border-2 ${
            isCompleted ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-muted/40'
          } rounded-[28px] p-4 hover:border-muted/60 transition group cursor-pointer`}
          onClick={() => taskDetail && setShowDetailModal(true)}
        >
          <div className="flex items-start gap-3">
            {/* Completion checkbox */}
            <button
              onClick={handleComplete}
              className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <Circle className="w-6 h-6 text-muted/60 group-hover:text-white/80" />
              )}
            </button>

            {/* Task content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">{emoji}</span>
                  <h4 className={`font-semibold text-sm transition-all ${
                    isCompleted ? 'text-white/60 line-through' : 'text-white'
                  }`}>
                    Día {task.day}: {task.title}
                  </h4>
                  <Badge className="bg-purple/30 text-white/90 text-xs whitespace-nowrap">
                    {typeInfo.label}
                  </Badge>
                </div>

                {/* Time estimate */}
                <span className="text-xs bg-purple/30 text-white/90 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mt-2 transition-all ${
                isCompleted ? 'text-white/50' : 'text-white/75'
              }`}>
                {task.description}
              </p>

              {/* Resources */}
              {task.resources && task.resources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {task.resources.map((resource, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className={`text-xs h-7 px-2 ${
                        isCompleted ? 'opacity-50 cursor-default' : 'hover:bg-blue/20'
                      }`}
                      disabled={isCompleted}
                    >
                      📌 {resource}
                    </Button>
                  ))}
                </div>
              )}

              {/* Prerequisite indicator */}
              {task.prerequisite && (
                <p className="text-xs text-amber-400 mt-2">
                  ⚠️ Requiere completar tareas anteriores
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {taskDetail && (
        <TaskDetailModal
          task={taskDetail}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}
