'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Module, Milestone } from '@/app/despega/a3/data/mock-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Lock, Play, CheckCircle2, Clock } from 'lucide-react'

interface ModuleCardProps {
  module: Module
  onStart?: () => void
}

export function ModuleCard({ module, onStart }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500/20 to-green-500/10'
      case 'in_progress':
        return 'from-training/20 to-training/10'
      case 'available':
        return 'from-blue-500/20 to-blue-500/10'
      default:
        return 'from-gray-500/20 to-gray-500/10'
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">Completado</span>
      case 'in_progress':
        return <span className="text-xs font-semibold text-training bg-training/20 px-2 py-1 rounded">En progreso</span>
      case 'available':
        return <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-2 py-1 rounded">Disponible</span>
      default:
        return <span className="text-xs font-semibold text-gray-400 bg-gray-500/20 px-2 py-1 rounded">Bloqueado</span>
    }
  }
  
  const getButtonState = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Ver feedback', disabled: false }
      case 'in_progress':
        return { label: 'Continuar', disabled: false }
      case 'available':
        return { label: 'Comenzar', disabled: false }
      default:
        return { label: 'Bloqueado', disabled: true }
    }
  }

  const handleStartModule = () => {
    if (onStart) {
      onStart()
    } else {
      // Default navigation - route to the module
      if (module.id) {
        console.log('[v0] Navigating to module:', module.id)
        router.push(`/despega/a3/modulo/${module.id}`)
      } else {
        console.log('[v0] No module ID provided')
      }
    }
  }
  
  const buttonState = getButtonState(module.status)
  const completedMilestones = module.milestones?.filter(m => m.completed).length || 0
  const totalMilestones = module.milestones?.length || 0
  const hasMilestones = totalMilestones > 0
  
  return (
    <Card className={`border border-white/10 bg-gradient-to-br ${getStatusColor(module.status)} hover:border-white/20 transition overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg text-white mb-1">{module.title}</CardTitle>
              <p className="text-sm text-white/70">{module.description}</p>
            </div>
            {getStatusBadge(module.status)}
          </div>
          
          {/* Progress bar for in-progress or completed modules */}
          {(module.status === 'in_progress' || module.status === 'completed') && (
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-training to-training/60 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(module.progress || 0, 100)}%` }}
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* XP and progress info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white/60">XP Disponible:</span>
            <span className="font-mono font-semibold text-purple-400">{module.xp} / {module.maxXp}</span>
          </div>
          {module.status === 'in_progress' && (
            <span className="text-white/60">{Math.round(module.progress || 0)}% completado</span>
          )}
        </div>
        
        {/* Milestones section if available */}
        {hasMilestones && (
          <div className="space-y-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full p-2 rounded hover:bg-white/5 transition text-sm text-white/80"
            >
              <span>Hitos ({completedMilestones}/{totalMilestones})</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {expanded && (
              <div className="space-y-1.5 pl-2 border-l border-purple-500/30 mt-2">
                {module.milestones?.map((milestone) => (
                  <div key={milestone.id} className="flex items-start gap-2 text-sm">
                    <div className={`mt-1 ${milestone.completed ? 'text-green-400' : 'text-white/30'}`}>
                      {milestone.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className={milestone.completed ? 'text-white/80 line-through' : 'text-white/60'}>{milestone.title}</p>
                    </div>
                    <span className="text-xs font-mono text-purple-400/70">+{milestone.xp}XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Unlock text if locked */}
        {module.status === 'locked' && module.unlockText && (
          <p className="text-xs text-white/50 italic p-2 bg-white/5 rounded">{module.unlockText}</p>
        )}
        
        {/* Action button */}
        <Button
          onClick={handleStartModule}
          disabled={buttonState.disabled}
          className={`w-full transition ${
            buttonState.disabled
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          <Play className="w-4 h-4 mr-2" />
          {buttonState.label}
        </Button>
      </CardContent>
    </Card>
  )
}
