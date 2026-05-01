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
  const [tipHistory, setTipHistory] = useState<Array<{ tip: string; isPremium: boolean; index: number }>>([])
  const [currentTipIndex, setCurrentTipIndex] = useState<number | null>(null)
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

      // Add tip to history
      const newTipEntry = {
        tip: data.tip,
        isPremium,
        index: tipHistory.length
      }
      setTipHistory([...tipHistory, newTipEntry])
      setCurrentTipIndex(tipHistory.length) // Show the newly generated tip

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

  const currentTip = currentTipIndex !== null ? tipHistory[currentTipIndex] : null
  const canNavigateBack = currentTipIndex !== null && currentTipIndex > 0
  const canNavigateNext = currentTipIndex !== null && currentTipIndex < tipHistory.length - 1

  return (
    <Card className="p-6 bg-background">
      <div className="space-y-6">
        {/* Tips Counter */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange" />
              <span className="text-sm">
                Tips Gratis: <span className="font-bold">{freeTipsUsed}/3</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue/50" />
              <span className="text-sm">
                Premium: <span className="font-bold">{premiumTipsUsed}</span>
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Saldo DTC: {dtcBalance !== null ? dtcBalance : '...'} 
            {dtcBalance !== null && dtcBalance < 150 && !canUseFreeTip && (
              <span className="text-red ml-2">({150 - dtcBalance} para premium)</span>
            )}
          </div>
        </div>

        {/* All Tips Visual Indicator */}
        {tipHistory.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-xs font-semibold text-white/80">Tips obtenidos:</span>
            <div className="flex gap-1">
              {tipHistory.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTipIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTipIndex === idx
                      ? 'bg-blue/70 w-6'
                      : 'bg-muted/50 dark:bg-muted/40'
                  }`}
                  title={`Tip ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Current Tip Display with Navigation */}
        {currentTip && (
          <div className="space-y-3">
            <div className="p-4 bg-slate-900/50 rounded-[28px] border-l-4 border-blue/70">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-sm text-white">
                  Consejo IA {currentTip.isPremium ? '(Premium)' : '(Gratis)'}:
                </h4>
                <span className="text-xs bg-muted/40 dark:bg-slate-700 px-2 py-1 rounded text-white/90">
                  {(currentTipIndex || 0) + 1}/{tipHistory.length}
                </span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{currentTip.tip}</p>
            </div>

            {/* Navigation buttons */}
            {tipHistory.length > 1 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentTipIndex((currentTipIndex || 0) - 1)}
                  disabled={!canNavigateBack}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  ← Anterior
                </Button>
                <Button
                  onClick={() => setCurrentTipIndex((currentTipIndex || 0) + 1)}
                  disabled={!canNavigateNext}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Siguiente →
                </Button>
              </div>
            )}
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
          <div className="p-4 bg-yellow/60 dark:bg-yellow/70 rounded-[28px] border-2 border-yellow/60 dark:border-yellow/70">
            <div className="flex gap-2 items-start">
              <div className="text-yellow/80 dark:text-yellow/90 text-lg flex-shrink-0"></div>
              <p className="text-sm text-yellow/10 dark:text-yellow/10 font-semibold leading-relaxed">
                Usaste los 3 tips gratis. Obtén tips premium con puntos DTC o gana más tips completando entrevistas.
              </p>
            </div>
          </div>
        )}

        {dtcBalance !== null && !canUsePremiumTip && premiumTipsUsed === 0 && canUseFreeTip && (
          <div className="p-4 bg-blue-950/60 dark:bg-blue-950/70 rounded-[28px] border-2 border-blue/60 dark:border-blue/70">
            <div className="flex gap-2 items-start">
              <div className="text-blue/80 dark:text-blue/90 text-lg flex-shrink-0">💳</div>
              <p className="text-sm text-blue-100 dark:text-blue-100 font-semibold leading-relaxed">
                Después de usar los 3 tips gratis, puedes comprar puntos DTC en la tienda para tips premium.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
