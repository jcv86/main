'use client'

import { useState } from 'react'
import { useRouteState } from '@/lib/route-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, RefreshCw, Trash2, Zap } from 'lucide-react'
import { seedTravisCompleteRoute, seedTravisForDay } from '@/lib/route-seeds'

/**
 * Developer Debug Panel for Route State Management
 * Only visible in travis_dev and qa_test modes
 * Provides inspection and control over route state
 */
export function DevRouteDebugPanel() {
  const { state, updateState, isDev } = useRouteState()
  const [isOpen, setIsOpen] = useState(false)
  const [seedUntilDay, setSeedUntilDay] = useState(30)

  // Don't render if not in dev mode
  if (!isDev) return null

  const modeConfig = {
    production: { color: 'bg-slate-600', label: 'Production' },
    travis_dev: { color: 'bg-blue-600', label: 'Travis Dev' },
    qa_test: { color: 'bg-orange-600', label: 'QA Test' },
    demo: { color: 'bg-purple-600', label: 'Demo' },
  }

  const config = modeConfig[state.mode as keyof typeof modeConfig] || modeConfig.production

  const handleSeedFull = () => {
    const seeded = seedTravisCompleteRoute()
    updateState(seeded)
    console.log('[v0] Route state seeded to completion')
  }

  const handleSeedUntilDay = () => {
    const seeded = seedTravisForDay(seedUntilDay)
    updateState(seeded)
    console.log('[v0] Route state seeded until day', seedUntilDay)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all route state?')) {
      // Reset would be handled by parent context provider
      console.log('[v0] Route state reset requested')
    }
  }

  const getMissingData = () => {
    const missing: string[] = []
    if (!state.c1) missing.push('C1')
    if (!state.a1) missing.push('A1')
    if (!state.c2) missing.push('C2')
    if (!state.a2) missing.push('A2')
    if (!state.a3) missing.push('A3')
    return missing
  }

  const missing = getMissingData()
  const completionPercent = Math.round(
    ((state.a2?.totalDaysCompleted || 0) / 90) * 100
  )

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Panel Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${config.color} rounded-full p-3 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2`}
      >
        <Zap className="w-4 h-4" />
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-slate-950 border border-[rgb(80,160,170)] rounded-lg p-4 w-80 shadow-xl space-y-4 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4" /> Dev Debug Panel
            </h3>
            <Badge className={`${config.color} text-white`}>{config.label}</Badge>
          </div>

          {/* Current State Summary */}
          <div className="bg-slate-900/50 rounded p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">User ID:</span>
              <span className="text-white font-mono">{state.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-white capitalize">{state.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">A2 Progress:</span>
              <span className="text-emerald-400 font-semibold">{completionPercent}%</span>
            </div>
            {state.a2 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Days Complete:</span>
                <span className="text-white">{state.a2.totalDaysCompleted}/90</span>
              </div>
            )}
            {state.a3 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Modules Certified:</span>
                <span className="text-white">{state.a3.completedModuleCount}/10</span>
              </div>
            )}
          </div>

          {/* Data Quality Indicators */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase">Module Status</p>
            <div className="flex flex-wrap gap-1">
              {(['c1', 'a1', 'c2', 'a2', 'a3'] as const).map(module => (
                <Badge
                  key={module}
                  className={`${
                    state[module] ? 'bg-emerald-600/50 text-emerald-200' : 'bg-slate-700/50 text-slate-400'
                  } uppercase text-xs`}
                >
                  {module}
                </Badge>
              ))}
            </div>
            {missing.length > 0 && (
              <p className="text-xs text-orange-400">Missing: {missing.join(', ')}</p>
            )}
          </div>

          {/* Seeding Controls */}
          <div className="space-y-2 border-t border-[rgb(80,160,170)] pt-3">
            <p className="text-xs font-semibold text-slate-400 uppercase">Seed Data</p>
            
            <Button
              onClick={handleSeedFull}
              size="sm"
              className="w-full bg-emerald-600/70 hover:bg-emerald-600/90 text-white text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Seed Full Route
            </Button>

            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="90"
                value={seedUntilDay}
                onChange={(e) => setSeedUntilDay(Math.min(90, Math.max(1, parseInt(e.target.value))))}
                className="flex-1 bg-slate-800 border border-[rgb(80,160,170)] rounded px-2 py-1 text-xs text-white"
                placeholder="Day number"
              />
              <Button
                onClick={handleSeedUntilDay}
                size="sm"
                className="bg-blue-600/70 hover:bg-blue-600/90 text-white text-xs"
              >
                Seed to Day
              </Button>
            </div>
          </div>

          {/* Reset Control */}
          <div className="border-t border-[rgb(80,160,170)] pt-3">
            <Button
              onClick={handleReset}
              size="sm"
              className="w-full bg-[rgba(80,160,170,0.5)]/40 hover:bg-[rgba(80,160,170,0.6)]-600/60 text-[rgb(80,160,170)] text-xs border border-[rgb(80,160,170)]/40"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Reset All
            </Button>
          </div>

          {/* Debug Info */}
          <div className="bg-slate-900/50 rounded p-2 text-xs text-slate-500 border border-[rgb(80,160,170)] space-y-1">
            <p>Mode: {state.mode}</p>
            {state.seededDataUsed && <p className="text-blue-400">Using seeded data</p>}
            <p>Last updated: {state.lastUpdated?.toLocaleTimeString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
