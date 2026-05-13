'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Clock, BookOpen, Wrench, Users, ClipboardList, Trophy, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
  locked?: boolean
}

const taskTypeIcons = {
  learning: { icon: <BookOpen className="w-6 h-6" />, label: 'Aprender', color: 'text-blue/40' },
  practice: { icon: <Wrench className="w-6 h-6" />, label: 'Practicar', color: 'text-yellow-400' },
  networking: { icon: <Users className="w-6 h-6" />, label: 'Conectar', color: 'text-pink-400' },
  planning: { icon: <ClipboardList className="w-6 h-6" />, label: 'Planificar', style: { color: 'rgb(90, 90, 150)' } },
  milestone: { icon: <Trophy className="w-6 h-6" />, label: 'Hito', color: 'text-emerald-400' },
}

const taskTypeEmojis = {
  learning: '',
  practice: '🛠️',
  networking: '',
  planning: '📋',
  milestone: '🏆',
}

export function TaskCard({ task, completed = false, onComplete, taskId, locked = false }: TaskCardProps) {
  const router = useRouter()
  const typeInfo = taskTypeIcons[task.type]
  const emoji = taskTypeEmojis[task.type]

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (locked) return
    onComplete?.(taskId)
  }

  const hours = Math.round(task.timeEstimate / 60)
  const minutes = task.timeEstimate % 60

  if (locked) {
    return (
      <div className="bg-muted/10 border-2 border-muted/20 rounded-[28px] p-4 opacity-50 cursor-not-allowed">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-muted/40 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-white/40">
                Día {task.day}: {task.title}
              </h4>
            </div>
            <p className="text-xs text-white/30 mt-1">Completa el día anterior para desbloquear</p>
          </div>
        </div>
      </div>
    )
  }

  const handleCardClick = () => {
    // Navigate to the individual day page
    router.push(`/despega/a2/dia-${task.day}`)
  }

  return (
    <>
      <div className={`transition-all duration-200 ${completed ? 'opacity-60' : ''}`}>
        <div 
          className={`bg-muted/20 border-2 ${
            completed ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-muted/40'
          } rounded-[28px] p-4 hover:border-muted/60 transition group cursor-pointer`}
          onClick={handleCardClick}
        >
          <div className="flex items-start gap-3">
            {/* Completion checkbox */}
            <button
              onClick={handleComplete}
              className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
            >
              {completed ? (
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
                    completed ? 'text-white/60 line-through' : 'text-white'
                  }`}>
                    Día {task.day}: {task.title}
                  </h4>
                  <Badge className="text-xs whitespace-nowrap" style={{ backgroundColor: 'rgba(90, 90, 150, 0.3)', color: 'rgb(90, 90, 150)' }}>
                    {typeInfo.label}
                  </Badge>
                </div>

                {/* Time estimate */}
                <span className="text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1" style={{ backgroundColor: 'rgba(90, 90, 150, 0.3)', color: 'rgb(90, 90, 150)' }}>
                  <Clock className="w-3 h-3" />
                  {hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mt-2 transition-all ${
                completed ? 'text-white/50' : 'text-white/75'
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
                        completed ? 'opacity-50 cursor-default' : 'hover:bg-blue/20'
                      }`}
                      disabled={completed}
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
