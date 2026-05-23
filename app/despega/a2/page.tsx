'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Filter, Search, Calendar, Target, Zap, Lock, Unlock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { A2_DAYS } from '@/lib/a2-days-config'

type PhaseFilter = 'all' | 'clarity' | 'material' | 'real-action' | 'refinement'

export default function A2DashboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<PhaseFilter>('all')
  const [search, setSearch] = useState('')
  const [unlockedDays, setUnlockedDays] = useState<Set<number>>(new Set([1, 2, 3]))

  const phaseName = {
    clarity: 'Claridad',
    material: 'Material',
    'real-action': 'Acción Real',
    refinement: 'Refinamiento'
  }

  const phaseColor = {
    clarity: 'bg-blue-600/10 text-blue-400 border-blue-500/30',
    material: 'bg-purple-600/10 text-purple-400 border-purple-500/30',
    'real-action': 'bg-green-600/10 text-green-400 border-green-500/30',
    refinement: 'bg-amber-600/10 text-amber-400 border-amber-500/30'
  }

  const filteredDays = Object.entries(A2_DAYS)
    .filter(([_, day]) => {
      if (filter !== 'all' && day.phase !== filter) return false
      if (search && !day.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))

  const daysCompleted = 3
  const progressPercent = (daysCompleted / 90) * 100

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tu Roadmap de 90 Días</h1>
          <p className="text-slate-400">Transforma tu carrera en 90 días. Día a día.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-950 border border-[rgb(80,160,170)] rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Tu Progreso</h2>
              <p className="text-slate-400 text-sm">{daysCompleted} de 90 días completados</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">{Math.round(progressPercent)}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-sm text-slate-400">
            <div>Claridad: 1-10</div>
            <div>Material: 11-30</div>
            <div>Acción: 31-60</div>
            <div>Refinamiento: 61-90</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar día..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-[rgb(80,160,170)] rounded px-4 py-2 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {['all', 'clarity', 'material', 'real-action', 'refinement'].map((phase) => (
              <button
                key={phase}
                onClick={() => setFilter(phase as PhaseFilter)}
                className={`px-4 py-2 rounded whitespace-nowrap text-sm font-medium transition-colors ${
                  filter === phase
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-950'
                }`}
              >
                {phase === 'all' ? 'Todos' : phaseName[phase as keyof typeof phaseName]}
              </button>
            ))}
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredDays.map(([dayNum, day]) => {
            const diaNum = parseInt(dayNum)
            const isUnlocked = unlockedDays.has(diaNum)
            const isCompleted = diaNum <= daysCompleted

            return (
              <button
                key={diaNum}
                onClick={() => isUnlocked && router.push(`/despega/a2/dia-${diaNum}`)}
                disabled={!isUnlocked}
                className={`relative group text-left transition-all duration-200 ${
                  isUnlocked
                    ? 'cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 hover:-translate-y-1'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className={`bg-slate-950 border rounded-lg p-4 h-full ${
                  isUnlocked
                    ? 'border-[rgb(80,160,170)] hover:border-cyan-500'
                    : 'border-[rgb(80,160,170)]'
                }`}>
                  {/* Day number & status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-cyan-400">Día {diaNum}</span>
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    {!isUnlocked && <Lock className="w-4 h-4 text-slate-600" />}
                  </div>

                  {/* Phase badge */}
                  <Badge className={`mb-3 border ${phaseColor[day.phase as keyof typeof phaseColor]}`}>
                    {phaseName[day.phase as keyof typeof phaseName]}
                  </Badge>

                  {/* Title */}
                  <h3 className="font-bold text-white mb-1 line-clamp-2">{day.title}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{day.subtitle}</p>

                  {/* A3 Module Unlock */}
                  {day.unlocksA3Module && (
                    <div className="bg-green-600/10 border border-green-600/30 rounded px-2 py-1 mb-3">
                      <p className="text-green-400 text-xs font-medium flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        Desbloquea: {day.unlocksA3Module}
                      </p>
                    </div>
                  )}

                  {/* Time estimate */}
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {day.estimatedHours}h
                    </span>
                    {isUnlocked && (
                      <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Phase Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { phase: 'clarity', days: '1-10', title: 'Claridad Profesional', color: 'from-blue-600 to-cyan-600' },
            { phase: 'material', days: '11-30', title: 'Material Profesional', color: 'from-purple-600 to-pink-600' },
            { phase: 'real-action', days: '31-60', title: 'Acción Real e Interviews', color: 'from-green-600 to-emerald-600' },
            { phase: 'refinement', days: '61-90', title: 'Refinamiento y Crecimiento', color: 'from-amber-600 to-orange-600' }
          ].map((p) => (
            <div key={p.phase} className="bg-slate-950 border border-[rgb(80,160,170)] rounded-lg p-4">
              <div className={`w-full h-1 rounded-full bg-gradient-to-r ${p.color} mb-3`}></div>
              <p className="text-slate-400 text-xs font-medium mb-1">Fase {p.days}</p>
              <h3 className="text-white font-bold text-sm mb-2">{p.title}</h3>
              <p className="text-slate-400 text-xs">
                {p.phase === 'clarity' && 'Establece bases sólidas: visión, mercado, marca personal'}
                {p.phase === 'material' && 'Construye material profesional: CV, portfolio, entrevistas'}
                {p.phase === 'real-action' && 'Búsqueda activa: networking, aplicaciones, entrevistas reales'}
                {p.phase === 'refinement' && 'Integración y crecimiento en nuevo rol o avance final'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
