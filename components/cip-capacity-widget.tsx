'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface CapacityWidget {
  effective_capacity: number
  success_probability: number
}

export default function CIPCapacityWidget() {
  const [capacity, setCapacity] = useState<CapacityWidget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCapacity()
  }, [])

  const fetchCapacity = async () => {
    try {
      const response = await fetch('/api/cip/daily')
      if (response.ok) {
        const data = await response.json()
        setCapacity(data.today)
      }
    } catch (error) {
      console.error('Error fetching capacity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !capacity) {
    return null
  }

  const getStatusColor = (cap: number) => {
    if (cap <= 15) return 'from-red-500 to-red-600'
    if (cap <= 68) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  return (
    <Link href="/cip-dashboard">
      <Card className="p-4 bg-gradient-to-br hover:shadow-lg transition-shadow cursor-pointer" style={{
        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`
      }}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Tu Capacidad Hoy</span>
            <span className="text-xs px-2 py-1 bg-white bg-opacity-30 rounded-full text-gray-700">CIP</span>
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
