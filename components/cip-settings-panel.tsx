'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CIPConfig {
  threshold_optimal: number
  threshold_critical: number
  a1_base_default: number
  capacity_variance_max: number
  success_probability_multiplier: number
}

export default function CIPSettingsPanel() {
  const [config, setConfig] = useState<CIPConfig>({
    threshold_optimal: 68,
    threshold_critical: 15,
    a1_base_default: 50,
    capacity_variance_max: 40,
    success_probability_multiplier: 0.85,
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleChange = (key: keyof CIPConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/cip/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!response.ok) throw new Error('Failed to save config')

      setMessage({ type: 'success', text: 'Configuración actualizada correctamente' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al guardar' 
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Umbrales CIP</CardTitle>
          <CardDescription>Ajusta los parámetros del sistema de capacidad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Umbral Óptimo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Umbral Óptimo (%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="100"
                value={config.threshold_optimal}
                onChange={(e) => handleChange('threshold_optimal', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-green-600 min-w-12">{config.threshold_optimal}%</span>
            </div>
            <p className="text-xs text-gray-500">Capacidad ideal para sostenibilidad</p>
          </div>

          {/* Umbral Crítico */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Umbral Crítico (%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max={config.threshold_optimal - 1}
                value={config.threshold_critical}
                onChange={(e) => handleChange('threshold_critical', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-red-600 min-w-12">{config.threshold_critical}%</span>
            </div>
            <p className="text-xs text-gray-500">Capacidad mínima antes de alerta crítica</p>
          </div>

          {/* A1 Base Default */}
          <div className="space-y-2">
            <label className="text-sm font-medium">A1 Base por Defecto (%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="90"
                value={config.a1_base_default}
                onChange={(e) => handleChange('a1_base_default', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-blue-600 min-w-12">{config.a1_base_default}%</span>
            </div>
            <p className="text-xs text-gray-500">Capacidad base inicial para nuevos usuarios</p>
          </div>

          {/* Varianza de Capacidad */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Varianza de Capacidad Máxima (±%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="50"
                value={config.capacity_variance_max}
                onChange={(e) => handleChange('capacity_variance_max', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-purple-600 min-w-12">±{config.capacity_variance_max}%</span>
            </div>
            <p className="text-xs text-gray-500">Rango de fluctuación permitida diaria</p>
          </div>

          {/* Multiplicador de Probabilidad */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Multiplicador P(éxito)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={config.success_probability_multiplier}
                onChange={(e) => handleChange('success_probability_multiplier', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-2xl font-bold text-indigo-600 min-w-16">{config.success_probability_multiplier.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Factor para calcular probabilidad de éxito (0.5-1.0)</p>
          </div>

          {/* Guardar */}
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6"
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </CardContent>
      </Card>

      {/* Información de Zonas */}
      <Card>
        <CardHeader>
          <CardTitle>Zonas de Capacidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="font-medium text-red-900">Crítica: 0 - {config.threshold_critical}%</p>
            <p className="text-sm text-red-700">Reduce carga, toma descansos frecuentes</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="font-medium text-yellow-900">Alerta: {config.threshold_critical}% - {config.threshold_optimal}%</p>
            <p className="text-sm text-yellow-700">Mantén este nivel para sostenibilidad</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="font-medium text-green-900">Óptima: {config.threshold_optimal}% - 100%</p>
            <p className="text-sm text-green-700">Capacidad sostenible a largo plazo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
