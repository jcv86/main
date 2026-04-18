'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lightbulb, Loader2, Lock, Zap } from 'lucide-react'

interface InterviewTipsProps {
  questionText: string
  userResponse?: string
  questionContext?: string
  difficulty: string
  sessionId: string
  userId: string
  onTipGenerated?: (tip: string) => void
}

export function InterviewTips({
  questionText,
  userResponse,
  questionContext,
  difficulty,
  sessionId,
  userId,
  onTipGenerated
}: InterviewTipsProps) {
  const [freeTipsUsed, setFreeTipsUsed] = useState(0)
  const [premiumTipsUsed, setPremiumTipsUsed] = useState(0)
  const [currentTip, setCurrentTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dtcBalance, setDtcBalance] = useState<number | null>(null)
  const [showPremiumOption, setShowPremiumOption] = useState(false)

  // Fetch DTC balance on mount and when userId changes
  useEffect(() => {
    const fetchDTCBalance = async () => {
      try {
        console.log('[v0] Fetching DTC balance for user:', userId)
        const response = await fetch(`/api/gamification/dtc-balance?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setDtcBalance(data.balance || 0)
          console.log('[v0] DTC balance:', data.balance)
        } else {
          console.error('[v0] Failed to fetch DTC balance')
          setDtcBalance(0)
        }
      } catch (error) {
        console.error('[v0] Error fetching DTC balance:', error)
        setDtcBalance(0)
      }
    }

    if (userId) {
      fetchDTCBalance()
    }
  }, [userId])

  const canUseFreeTip = freeTipsUsed < 3
  const canUsePremiumTip = dtcBalance !== null && dtcBalance >= 150

  const generateTip = async (isPremium: boolean) => {
    if (!canUseFreeTip && !isPremium) {
      setShowPremiumOption(true)
      return
    }

    if (isPremium && !canUsePremiumTip) {
      alert('No tienes suficientes puntos DTC. Necesitas 150 DTC para un tip premium.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/interview/generate-ai-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          questionText,
          userResponse,
          questionContext,
          difficulty,
          isPremium,
          sessionId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Fallo al generar tip')
        return
      }

      setCurrentTip(data.tip)
      if (isPremium) {
        setPremiumTipsUsed(premiumTipsUsed + 1)
        // Update DTC balance after purchase
        if (dtcBalance !== null) {
          setDtcBalance(dtcBalance - 150)
        }
      } else {
        setFreeTipsUsed(freeTipsUsed + 1)
      }

      onTipGenerated?.(data.tip)
    } catch (error) {
      console.error('[v0] Error generating tip:', error)
      alert('Fallo al generar tip. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="space-y-6">
        {/* Tips Counter */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">
                Tips Gratis: <span className="font-bold">{freeTipsUsed}/3</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">
                Premium: <span className="font-bold">{premiumTipsUsed}</span>
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Saldo DTC: {dtcBalance !== null ? dtcBalance : '...'} 
            {dtcBalance !== null && dtcBalance < 150 && !canUseFreeTip && (
              <span className="text-red-600 ml-2">({150 - dtcBalance} para premium)</span>
            )}
          </div>
        </div>

        {/* Current Tip Display */}
        {currentTip && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Consejo IA:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{currentTip}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => generateTip(false)}
            disabled={!canUseFreeTip || loading}
            variant={canUseFreeTip ? 'default' : 'outline'}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Tip Gratis ({freeTipsUsed}/3)
              </>
            )}
          </Button>

          <Button
            onClick={() => generateTip(true)}
            disabled={!canUsePremiumTip || loading}
            variant={canUsePremiumTip ? 'secondary' : 'outline'}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Tip Premium (150 DTC)
              </>
            )}
          </Button>
        </div>

        {/* Information */}
        {!canUseFreeTip && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Usaste los 3 tips gratis. Obtén tips premium con puntos DTC o gana más tips completando entrevistas.
            </p>
          </div>
        )}

        {dtcBalance !== null && !canUsePremiumTip && premiumTipsUsed === 0 && canUseFreeTip && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Después de usar los 3 tips gratis, puedes comprar puntos DTC en la tienda para tips premium.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
