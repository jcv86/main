'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function RadarTesisEditor() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    tesis_estrategica: '',
    delta_estrategico: '',
    nivel_energía: 'Confirmación' as const,
    que_descuento_mercado: '',
    consensus_score: 0.5,
    tension_narrativa: '',
    ritmo_narrativo: 'Estabilizado' as const,
    impacto_plazo: 'Mediano' as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('despega_radar_tesis_dia').insert([
        {
          fecha: new Date().toISOString().split('T')[0],
          ...formData,
        },
      ])

      if (error) throw error

      // Reset form
      setFormData({
        tesis_estrategica: '',
        delta_estrategico: '',
        nivel_energía: 'Confirmación',
        que_descuento_mercado: '',
        consensus_score: 0.5,
        tension_narrativa: '',
        ritmo_narrativo: 'Estabilizado',
        impacto_plazo: 'Mediano',
      })

      alert('Tesis del día creada exitosamente')
    } catch (error) {
      console.error('[v0] Error:', error)
      alert('Error al crear tesis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Tesis del Día</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tesis Estratégica */}
          <div>
            <label className="text-sm font-semibold">Tesis Estratégica</label>
            <Textarea
              placeholder="Síntesis estratégica de 4-6 líneas"
              value={formData.tesis_estrategica}
              onChange={(e) => setFormData({ ...formData, tesis_estrategica: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Delta vs Ayer */}
          <div>
            <label className="text-sm font-semibold">Delta vs Ayer</label>
            <Textarea
              placeholder="¿Qué cambió desde ayer?"
              value={formData.delta_estrategico}
              onChange={(e) => setFormData({ ...formData, delta_estrategico: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Grid de Selectores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Nivel de Energía</label>
              <Select value={formData.nivel_energía} onValueChange={(value: any) =>
                setFormData({ ...formData, nivel_energía: value })
              }>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Confirmación">Confirmación</SelectItem>
                  <SelectItem value="Contexto">Contexto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold">Ritmo Narrativo</label>
              <Select value={formData.ritmo_narrativo} onValueChange={(value: any) =>
                setFormData({ ...formData, ritmo_narrativo: value })
              }>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acelerando">Acelerando</SelectItem>
                  <SelectItem value="Estabilizado">Estabilizado</SelectItem>
                  <SelectItem value="Perdiendo fuerza">Perdiendo fuerza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Impacto Plazo */}
          <div>
            <label className="text-sm font-semibold">Impacto Plazo</label>
            <Select value={formData.impacto_plazo} onValueChange={(value: any) =>
              setFormData({ ...formData, impacto_plazo: value })
            }>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corto">Corto Plazo</SelectItem>
                <SelectItem value="Mediano">Mediano Plazo</SelectItem>
                <SelectItem value="Largo">Largo Plazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Qué Descuenta el Mercado */}
          <div>
            <label className="text-sm font-semibold">Qué Descuenta el Mercado</label>
            <Textarea
              placeholder="Las expectativas implícitas que el mercado ya tiene precificadas"
              value={formData.que_descuento_mercado}
              onChange={(e) => setFormData({ ...formData, que_descuento_mercado: e.target.value })}
              required
              className="mt-2"
            />
          </div>

          {/* Tensión Narrativa */}
          <div>
            <label className="text-sm font-semibold">Tensión Narrativa (Opcional)</label>
            <Textarea
              placeholder="Dónde están las colisiones interpretativas"
              value={formData.tension_narrativa}
              onChange={(e) => setFormData({ ...formData, tension_narrativa: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Consensus Score */}
          <div>
            <label className="text-sm font-semibold">Consenso ({Math.round(formData.consensus_score * 100)}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.consensus_score * 100}
              onChange={(e) => setFormData({ ...formData, consensus_score: parseInt(e.target.value) / 100 })}
              className="w-full mt-2"
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear Tesis del Día'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
