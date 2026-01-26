import { useState, useEffect } from 'react'

interface CIPSettings {
  threshold_optimal: number
  threshold_warning: number
  a1_base_capacity: number
  recovery_rate: number
  fatigue_multiplier: number
}

const DEFAULT_SETTINGS: CIPSettings = {
  threshold_optimal: 68,
  threshold_warning: 15,
  a1_base_capacity: 50,
  recovery_rate: 5,
  fatigue_multiplier: 1.2,
}

export function useCIPSettings() {
  const [settings, setSettings] = useState<CIPSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cip-settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading CIP settings:', e)
      }
    }
    setLoaded(true)
  }, [])

  return { settings, loaded }
}

export function getThresholdStatus(capacity: number, settings: CIPSettings): 'critical' | 'warning' | 'optimal' {
  if (capacity <= settings.threshold_warning) return 'critical'
  if (capacity <= settings.threshold_optimal) return 'warning'
  return 'optimal'
}

export function getThresholdMessage(capacity: number, settings: CIPSettings): string {
  const status = getThresholdStatus(capacity, settings)
  
  if (status === 'critical') {
    return `Capacidad crítica (${capacity.toFixed(1)}% ≤ ${settings.threshold_warning}%). Descansa y reduce carga.`
  }
  if (status === 'warning') {
    return `En zona de compromiso (${capacity.toFixed(1)}%). Mantén este ritmo para sostenibilidad.`
  }
  return `Capacidad sostenible (${capacity.toFixed(1)}% > ${settings.threshold_optimal}%). Excelente ritmo.`
}
