'use client'

import React, { useState } from 'react'
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
  const [dtcBalance, setDtcBalance] = useState(0)
  const [showPremiumOption, setShowPremiumOption] = useState(false)

  const canUseFreeTip = freeTipsUsed < 3
  const canUsePremiumTip = dtcBalance >= 150

  const generateTip = async (isPremium: boolean) => {
    if (!canUseFreeTip && !isPremium) {
      setShowPremiumOption(true)
      return
    }

    if (isPremium && !canUsePremiumTip) {
      alert('Insufficient DTC balance. You need 150 DTC points for a premium tip.')
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
        alert(data.error || 'Failed to generate tip')
        return
      }

      setCurrentTip(data.tip)
      if (isPremium) {
        setPremiumTipsUsed(premiumTipsUsed + 1)
        setDtcBalance(dtcBalance - 150)
      } else {
        setFreeTipsUsed(freeTipsUsed + 1)
      }

      onTipGenerated?.(data.tip)
    } catch (error) {
      console.error('Error generating tip:', error)
      alert('Failed to generate tip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="space-y-6">
        {/* Tips Counter */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">
                Free Tips: <span className="font-bold">{freeTipsUsed}/3</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">
                Premium: <span className="font-bold">{premiumTipsUsed}</span>
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold text-indigo-700">
            DTC Balance: {dtcBalance}
          </div>
        </div>

        {/* Current Tip Display */}
        {currentTip && (
          <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-sm mb-2 text-gray-900">AI Coach Tip:</h4>
            <p className="text-sm text-gray-700">{currentTip}</p>
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
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Free Tip ({freeTipsUsed}/3)
              </>
            )}
          </Button>

          <Button
            onClick={() => generateTip(true)}
            disabled={!canUsePremiumTip || loading}
            variant="secondary"
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Premium Tip (150 DTC)
              </>
            )}
          </Button>
        </div>

        {/* Information */}
        {!canUseFreeTip && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              You&apos;ve used all 3 free tips. Get premium tips with DTC points or earn more tips by completing interviews!
            </p>
          </div>
        )}

        {!canUsePremiumTip && premiumTipsUsed === 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              Don&apos;t have enough DTC points? Check out the DTC Shop to purchase points!
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
