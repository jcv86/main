'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Zap, Sparkles } from 'lucide-react'

interface DTCPackage {
  id: string
  dtcAmount: number
  price: number
  bonus: number
  popular?: boolean
  label?: string
}

const DTC_PACKAGES: DTCPackage[] = [
  {
    id: 'starter',
    dtcAmount: 150,
    price: 4.99,
    bonus: 0,
    label: 'Single Premium Tip'
  },
  {
    id: 'basic',
    dtcAmount: 600,
    price: 14.99,
    bonus: 100,
    popular: true,
    label: 'Most Popular'
  },
  {
    id: 'pro',
    dtcAmount: 1500,
    price: 29.99,
    bonus: 300,
    label: 'Best Value'
  },
  {
    id: 'elite',
    dtcAmount: 3600,
    price: 59.99,
    bonus: 900,
    label: 'Premium Package'
  }
]

interface DTCShopProps {
  userId: string
  currentBalance: number
  onPurchaseComplete?: (amount: number) => void
}

export function DTCShop({ userId, currentBalance, onPurchaseComplete }: DTCShopProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const handlePurchase = async (pkg: DTCPackage) => {
    setLoading(true)
    setSelectedPackage(pkg.id)

    try {
      // In a real app, this would call Stripe or a payment endpoint
      const response = await fetch('/api/gamification/dtc-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          packageId: pkg.id,
          dtcAmount: pkg.dtcAmount + pkg.bonus,
          price: pkg.price
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Purchase failed')
        return
      }

      alert('Purchase successful! DTC points added to your account.')
      onPurchaseComplete?.(pkg.dtcAmount + pkg.bonus)
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to process purchase')
    } finally {
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-amber-500" />
          <h1 className="text-4xl font-bold text-gray-900">DTC Points Shop</h1>
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <p className="text-gray-600 mb-4">
          Unlock premium interview tips and accelerate your career growth
        </p>
        <div className="inline-block bg-blue-50 rounded-lg px-4 py-2">
          <p className="text-lg font-semibold text-blue-700">
            Current Balance: {currentBalance} DTC Points
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {DTC_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative p-6 flex flex-col transition-all ${
              pkg.popular ? 'ring-2 ring-blue-500 lg:scale-105' : ''
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Package Info */}
            <div className="flex-1 mb-6">
              {pkg.label && (
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  {pkg.label}
                </p>
              )}

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-900">
                    {pkg.dtcAmount + pkg.bonus}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  DTC Points
                  {pkg.bonus > 0 && (
                    <span className="block text-green-600 font-semibold">
                      +{pkg.bonus} bonus
                    </span>
                  )}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {Math.floor((pkg.dtcAmount + pkg.bonus) / 150)} premium tips
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Lifetime access</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Never expires</span>
                </div>
              </div>
            </div>

            {/* Price & Button */}
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                ${pkg.price}
              </div>
              <Button
                onClick={() => handlePurchase(pkg)}
                disabled={loading && selectedPackage === pkg.id}
                variant={pkg.popular ? 'default' : 'outline'}
                className="w-full"
              >
                {loading && selectedPackage === pkg.id ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Premium Tips?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold text-gray-900 mb-2">AI-Powered Coaching</div>
            <p className="text-sm text-gray-700">
              Get personalized, context-aware tips from our advanced AI interviewer coach
            </p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-2">Immediate Improvement</div>
            <p className="text-sm text-gray-700">
              Apply tips in real-time and see measurable score improvements
            </p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-2">Duolingo-Style Progress</div>
            <p className="text-sm text-gray-700">
              Track streaks, unlock badges, and celebrate your interview mastery journey
            </p>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: 'How do I earn free DTC points?',
              a: 'Complete interviews to earn 3 free tips per interview. Additional bonus points available through achievements and streaks.'
            },
            {
              q: 'Can I use DTC points outside interviews?',
              a: 'Currently, DTC points are designed for premium interview tips. More uses coming soon!'
            },
            {
              q: 'Do DTC points expire?',
              a: 'No! Your DTC points never expire. Use them whenever you need premium tips.'
            },
            {
              q: 'What if Im not satisfied?',
              a: 'We offer a 7-day money-back guarantee for all DTC purchases if youre not satisfied.'
            }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
              <p className="text-sm text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
