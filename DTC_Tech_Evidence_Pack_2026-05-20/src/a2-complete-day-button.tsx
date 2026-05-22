'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface A2CompleteDayButtonProps {
  dayNumber: number
  onCompleted?: () => void
}

export function A2CompleteDayButton({ dayNumber, onCompleted }: A2CompleteDayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCompleteDay = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/a2/complete-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to complete day')
      }

      const result = await response.json()
      
      toast({
        title: 'Éxito',
        description: `Día ${dayNumber} marcado como completado!`,
      })

      // Revalidate progress
      fetch('/api/a2/progress').then(() => {
        window.location.reload()
      })

      onCompleted?.()
    } catch (error) {
      console.error('[v0] Error completing day:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al completar el día',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCompleteDay}
      disabled={isLoading}
      className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Completando...
        </>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Marcar Día {dayNumber} como Completado
        </>
      )}
    </Button>
  )
}
