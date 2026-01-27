'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface CapacityData {
  effective_capacity: number
  success_probability: number
}

interface CIPCapacityWidgetProps {
  userId: string
}

export function CIPCapacityWidget({ userId }: CIPCapacityWidgetProps) {
  const [capacity, setCapacity] = useState<CapacityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCapacity()
  }, [userId])

  const fetchCapacity = async () => {
    try {
      const response = await fetch(`/api/cip/daily?userId=${userId}`)
      
      if (response.ok) {
        const result = await response.json()
        console.log('[v0] CIP API response:', result)
        
        // Handle response structure
        if (result.data) {
          const capacityData = result.data.today || result.data
          
          // Usar valores por defecto si no hay datos reales
          setCapacity({
            effective_capacity: capacityData?.effective_capacity || 60,
            success_probability: capacityData?.success_probability || 50,
          })
        }
      } else {
        console.error('[v0] API error:', response.status)
        // Set default capacity if fetch fails
        setCapacity({
          effective_capacity: 60,
          success_probability: 50,
        })
      }
    } catch (error) {
      console.error('[v0] Error fetching capacity:', error)
      // Set default capacity on error
      setCapacity({
        effective_capacity: 60,
        success_probability: 50,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading || !capacity) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  const getStatusColor = (cap: number) => {
    if (cap <= 15) return 'from-red-500 to-red-600'
    if (cap <= 68) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  const getStatusText = (cap: number) => {
    if (cap <= 15) return 'Crítica'
    if (cap <= 68) return 'Alerta'
    return 'Óptima'
  }

  return (
    <Link href="/cip-dashboard">
      <Card className="p-4 bg-gradient-to-br hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Tu Capacidad Hoy</span>
            <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${
              capacity.effective_capacity <= 15 ? 'bg-red-500' :
              capacity.effective_capacity <= 68 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              {getStatusText(capacity.effective_capacity)}
            </span>
          </div>
          
          <div className="text-3xl font-bold text-gray-800">
            {capacity.effective_capacity.toFixed(0)}%
          </div>
          
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getStatusColor(capacity.effective_capacity)} transition-all`}
              style={{ width: `${Math.min(capacity.effective_capacity, 100)}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-600 pt-1">
            Prob. éxito: {(capacity.success_probability * 100).toFixed(0)}%
          </div>
        </div>
      </Card>
    </Link>
  )
}
