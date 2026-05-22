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
      <div className="rounded-[28px] p-4 cursor-not-allowed" style={{ backgroundColor: 'rgba(30, 32, 42, 0.8)', border: `1px solid rgba(90, 90, 150, 0.2)`, opacity: 0.6 }}>
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'rgba(90, 90, 150, 0.3)' }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                Día {task.day}: {task.title}
              </h4>
            </div>
            <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>Completa el día anterior para desbloquear</p>
          </div>
        </div>
      </div>
    )
  }

  const handleCardClick = () => {
    // Navigate to the individual day page
    router.push(`/despega/a2/dia-${task.day}`)
  }

  // Active (current) day styling - most saturated and bright
  const activeStyle = {
    backgroundColor: 'rgba(90, 90, 150, 0.4)',
    border: `2px solid rgba(90, 90, 150, 0.6)`,
  }

  // Completed day styling - medium highlight
  const completedStyle = {
    backgroundColor: 'rgba(90, 90, 150, 0.15)',
    border: `1.5px solid rgba(90, 90, 150, 0.6)`,
  }

  // Non-completed, non-active day styling
  const defaultStyle = {
    backgroundColor: 'rgba(30, 32, 42, 0.8)',
    border: `1px solid rgba(90, 90, 150, 0.3)`,
  }

  const cardStyle = completed ? completedStyle : defaultStyle

  return (
    <>
      <div className={`transition-all duration-200`}>
        <div 
          className="rounded-[28px] p-4 hover:border-opacity-100 transition group cursor-pointer"
          style={cardStyle}
          onClick={handleCardClick}
        >
          <div className="flex items-start gap-3">
            {/* Completion checkbox */}
            <button
              onClick={handleComplete}
              className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
            >
              {completed ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: 'rgba(80, 160, 170, 0.8)' }} />
              ) : (
                <Circle className="w-6 h-6 group-hover:text-white/80" style={{ color: 'rgba(90, 90, 150, 0.4)' }} />
              )}
            </button>

            {/* Task content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`font-semibold text-sm transition-all`} style={{ color: completed ? 'rgba(255, 255, 255, 0.8)' : 'rgb(255, 255, 255)', textDecoration: 'none' }}>
                    Día {task.day}: {task.title}
                  </h4>
                  <Badge className="text-xs whitespace-nowrap" style={{ backgroundColor: completed ? 'rgba(90, 90, 150, 0.5)' : 'rgba(90, 90, 150, 0.6)', color: '#ffffff' }}>
                    {typeInfo.label}
                  </Badge>
                </div>

                {/* Time estimate */}
                <span className="text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1" style={{ backgroundColor: completed ? 'rgba(90, 90, 150, 0.5)' : 'rgba(90, 90, 150, 0.3)', color: '#ffffff' }}>
                  <Clock className="w-3 h-3" />
                  {hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`}
                </span>
              </div>

              {/* Description */}
              <p className={`text-sm mt-2 transition-all`} style={{ color: completed ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.65)' }}>
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
                      className={`text-xs h-7 px-2`}
                      style={{
                        borderColor: completed ? 'rgba(90, 90, 150, 0.6)' : 'rgba(90, 90, 150, 0.3)',
                        color: completed ? 'rgba(255, 255, 255, 0.9)' : 'rgb(90, 90, 150)',
                        backgroundColor: completed ? 'rgba(90, 90, 150, 0.2)' : 'transparent'
                      }}
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
