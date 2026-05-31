'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Plus, Trash2, Loader } from 'lucide-react'
import { MarketSignal } from '@/lib/supabase/a2-market-and-board'

interface Day3JobSearchProps {
  marketSignals: MarketSignal[]
  onAddJobPosting: (data: Omit<MarketSignal, 'id' | 'user_id' | 'day_number' | 'created_at'>) => Promise<void>
  isLoading: boolean
  onNext: () => void
  jobsCount: number
}

export function Day3JobSearch({
  marketSignals,
  onAddJobPosting,
  isLoading,
  onNext,
  jobsCount,
}: Day3JobSearchProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    job_url: '',
    salary_range: '',
    location: '',
    industry: '',
    requirements: '',
    fears_skills: '',
    strengths_needed: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onAddJobPosting({
      job_title: formData.job_title,
      company_name: formData.company_name,
      job_url: formData.job_url || undefined,
      salary_range: formData.salary_range || undefined,
      location: formData.location || undefined,
      industry: formData.industry || undefined,
      requirements: formData.requirements.split(',').map((s) => s.trim()),
      fears_skills: formData.fears_skills.split(',').map((s) => s.trim()),
      strengths_needed: formData.strengths_needed.split(',').map((s) => s.trim()),
    })
    setFormData({
      job_title: '',
      company_name: '',
      job_url: '',
      salary_range: '',
      location: '',
      industry: '',
      requirements: '',
      fears_skills: '',
      strengths_needed: '',
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Buscar Vacantes Reales</h2>
        <p className="text-white/70">
          Encuentra 3 vacantes en tu industria. Puedes buscar en LinkedIn, Indeed, o tu bolsa de trabajo favorita.
        </p>
      </div>

      {marketSignals.length > 0 && (
        <div className="space-y-3">
          {marketSignals.map((signal, idx) => (
            <div
              key={signal.id}
              className="rounded-lg p-4 border border-purple-500/40"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">{signal.job_title}</p>
                  <p className="text-cyan-300 text-sm">{signal.company_name}</p>
                </div>
                <button
                  onClick={() => {}}
                  className="p-2 hover:bg-[rgba(80,160,170,0.6)]-500/20 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 text-[rgb(80,160,170)]" />
                </button>
              </div>
              {signal.location && (
                <p className="text-white/60 text-xs">Ubicación: {signal.location}</p>
              )}
              {signal.salary_range && (
                <p className="text-white/60 text-xs">Salario: {signal.salary_range}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
          <div>
            <label className="block text-white/80 text-sm mb-2">Título del Puesto</label>
            <input
              type="text"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
              placeholder="ej: Senior Data Engineer"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Empresa</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
              placeholder="ej: Google"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/80 text-sm mb-2">URL (opcional)</label>
              <input
                type="url"
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40"
                style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40"
                style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
                placeholder="ej: Madrid, España"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Requisitos (separa por comas)</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40 resize-none"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
              placeholder="Python, SQL, 5+ años de experiencia"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Miedos/Blockers implícitos</label>
            <textarea
              value={formData.fears_skills}
              onChange={(e) => setFormData({ ...formData, fears_skills: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40 resize-none"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
              placeholder="Necesitan alguien que no fracase rápido, que sea independiente"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Fortalezas que necesitan</label>
            <textarea
              value={formData.strengths_needed}
              onChange={(e) => setFormData({ ...formData, strengths_needed: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white placeholder:text-white/40 resize-none"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.5)' }}
              placeholder="Liderazgo técnico, comunicación clara, autonomía"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Guardar Vacante
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 px-3 rounded-lg text-white border border-purple-500/40 font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-purple-500/40 text-white/70 hover:text-white hover:border-purple-500/60 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Vacante
        </button>
      )}

      <Button
        onClick={onNext}
        disabled={jobsCount < 3 || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{
          backgroundColor: jobsCount >= 3 ? 'rgba(90, 90, 150, 0.8)' : 'rgba(90, 90, 150, 0.4)',
        }}
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Extrayendo señales...
          </>
        ) : (
          <>
            Analizar Señales del Mercado ({jobsCount}/3)
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
