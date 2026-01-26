'use client'

interface CIPCapacityIndicatorProps {
  capacity: number
}

export default function CIPCapacityIndicator({ capacity }: CIPCapacityIndicatorProps) {
  // Determine zones
  const isOptimal = capacity > 68
  const isWarning = capacity > 15 && capacity <= 68
  const isCritical = capacity <= 15

  // Calculate positions
  const optimalWidth = Math.max(0, Math.min(100 - 68, capacity - 68)) * (32 / 32)
  const warningWidth = Math.max(0, Math.min(68 - 15, capacity - 15)) * (53 / 53)
  const criticalWidth = Math.max(0, Math.min(15, capacity)) * (15 / 15)

  return (
    <div className="space-y-4">
      {/* Main Indicator Bar */}
      <div className="space-y-2">
        <div className="flex items-end gap-1 h-32 bg-gray-100 p-4 rounded-lg border border-gray-200">
          {/* Critical Zone */}
          <div className="flex-1 bg-red-500 rounded-sm opacity-30 hover:opacity-50 transition" style={{ height: `${Math.max(20, isCritical ? 100 : capacity > 0 ? (capacity / 15) * 100 : 0)}%` }}>
            <div className="text-xs text-red-700 font-bold text-center pt-1">0-15%</div>
          </div>

          {/* Warning Zone */}
          <div className="flex-1 bg-yellow-500 rounded-sm opacity-30 hover:opacity-50 transition" style={{ height: `${isWarning || capacity > 15 ? 100 : 0}%` }}>
            <div className="text-xs text-yellow-700 font-bold text-center pt-1">15-68%</div>
          </div>

          {/* Optimal Zone */}
          <div className="flex-1 bg-green-500 rounded-sm opacity-30 hover:opacity-50 transition" style={{ height: `${isOptimal ? 100 : 0}%` }}>
            <div className="text-xs text-green-700 font-bold text-center pt-1">68-100%</div>
          </div>

          {/* Current Position Indicator */}
          <div className="absolute right-8 flex flex-col items-center">
            <div className="text-2xl font-bold text-gray-800">{capacity.toFixed(1)}%</div>
            <div className="h-1 w-1 bg-gray-800 rounded-full mt-1"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-red-50 rounded border border-red-200">
            <div className="font-semibold text-red-700">Crítica</div>
            <div className="text-xs text-red-600">0-15%: Frustración alta</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="font-semibold text-yellow-700">Compromiso Fuerte</div>
            <div className="text-xs text-yellow-600">15-68%: Objetivo</div>
          </div>
          <div className="p-2 bg-green-50 rounded border border-green-200">
            <div className="font-semibold text-green-700">Sostenible</div>
            <div className="text-xs text-green-600">68-100%: Óptimo</div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          {isCritical && 'Tu capacidad está en zona crítica. Considera reducir carga.'}
          {isWarning && 'Tu capacidad está en zona de compromiso. Mantén este nivel para sostenibilidad.'}
          {isOptimal && 'Tu capacidad está en zona óptima. Sostenible a largo plazo.'}
        </p>
      </div>
    </div>
  )
}
