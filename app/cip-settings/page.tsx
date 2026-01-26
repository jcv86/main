'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CIPSettings {
  threshold_optimal: number
  threshold_warning: number
  a1_base_capacity: number
  recovery_rate: number
  fatigue_multiplier: number
}

export default function CIPSettingsPage() {
  const [settings, setSettings] = useState<CIPSettings>({
    threshold_optimal: 68,
    threshold_warning: 15,
    a1_base_capacity: 50,
    recovery_rate: 5,
    fatigue_multiplier: 1.2,
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem('cip-settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      localStorage.setItem('cip-settings', JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSettings({
      threshold_optimal: 68,
      threshold_warning: 15,
      a1_base_capacity: 50,
      recovery_rate: 5,
      fatigue_multiplier: 1.2,
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Configuración CIP</h1>
          <p className="text-gray-600">Personaliza los parámetros del sistema de capacidad efectiva</p>
        </div>

        <Tabs defaultValue="thresholds" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="thresholds">Umbrales</TabsTrigger>
            <TabsTrigger value="capacity">Capacidad</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* Thresholds Tab */}
          <TabsContent value="thresholds" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Umbrales de Alerta</h2>

              {/* Optimal Threshold */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Umbral Óptimo (Zona Verde)
                  </label>
                  <span className="text-lg font-bold text-green-600">{settings.threshold_optimal}%</span>
                </div>
                <Slider
                  min={50}
                  max={100}
                  step={1}
                  value={[settings.threshold_optimal]}
                  onValueChange={(value) =>
                    setSettings({ ...settings, threshold_optimal: value[0] })
                  }
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Capacidad por encima de este valor = sostenible a largo plazo
                </p>
              </div>

              {/* Warning Threshold */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Umbral de Alerta (Zona Roja)
                  </label>
                  <span className="text-lg font-bold text-red-600">{settings.threshold_warning}%</span>
                </div>
                <Slider
                  min={5}
                  max={30}
                  step={1}
                  value={[settings.threshold_warning]}
                  onValueChange={(value) =>
                    setSettings({ ...settings, threshold_warning: value[0] })
                  }
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Capacidad por debajo de este valor = zona de frustración
                </p>
              </div>

              {/* Zone Visualization */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-3">Visualización de Zonas</div>
                <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-red-500 flex-shrink-0" 
                    style={{ width: `${settings.threshold_warning}%` }}
                  />
                  <div 
                    className="bg-yellow-400 flex-shrink-0" 
                    style={{ width: `${settings.threshold_optimal - settings.threshold_warning}%` }}
                  />
                  <div className="bg-green-500 flex-grow" />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>0% Crítica</span>
                  <span>{settings.threshold_warning}% Alerta</span>
                  <span>{settings.threshold_optimal}% Óptima</span>
                  <span>100%</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Capacity Tab */}
          <TabsContent value="capacity" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Parámetros de Capacidad Base</h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad Base A1 (%)
                </label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    min={10}
                    max={100}
                    value={settings.a1_base_capacity}
                    onChange={(e) =>
                      setSettings({ ...settings, a1_base_capacity: parseInt(e.target.value) })
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">Tu capacidad base teórica</span>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de Recuperación (% por día)
                </label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    step={0.5}
                    value={settings.recovery_rate}
                    onChange={(e) =>
                      setSettings({ ...settings, recovery_rate: parseFloat(e.target.value) })
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">Cómo se recupera tu capacidad</span>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-sm">
                  💡 Aumenta la tasa de recuperación si descansas bien. Disminuye si tienes poco descanso.
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Parámetros Avanzados</h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiplicador de Fatiga
                </label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    min={0.8}
                    max={2}
                    step={0.1}
                    value={settings.fatigue_multiplier}
                    onChange={(e) =>
                      setSettings({ ...settings, fatigue_multiplier: parseFloat(e.target.value) })
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">Cómo afecta la fatiga a tu capacidad</span>
                </div>
              </div>

              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800 text-sm">
                  ⚠️ No modifiques estos valores a menos que entiendas completamente el modelo CIP
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Restaurar Predeterminados
          </Button>
        </div>

        {/* Success Message */}
        {saved && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800 text-sm">
              ✓ Configuración guardada exitosamente
            </AlertDescription>
          </Alert>
        )}

        {/* Info Footer */}
        <Card className="p-4 mt-8 bg-gray-50 border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Objetivo CIP:</strong> Mantener tu capacidad entre el umbral de alerta y óptima para sostenibilidad.</p>
            <p><strong>Zona Roja (&lt;15%):</strong> Capacidad crítica. Descansa y reduce carga.</p>
            <p><strong>Zona Amarilla (15-68%):</strong> Compromiso fuerte. Mantén este ritmo.</p>
            <p><strong>Zona Verde (&gt;68%):</strong> Sostenible a largo plazo. Ideal.</p>
          </div>
        </Card>
      </div>
    </main>
  )
}
