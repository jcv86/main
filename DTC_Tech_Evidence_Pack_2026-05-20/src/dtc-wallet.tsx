'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Coins, TrendingUp, TrendingDown, Gift, History } from 'lucide-react'
import { formatDTC } from '@/lib/gamification/calculations'

interface DTCTransaction {
  id: string
  amount: number
  type: 'earn' | 'spend'
  description: string
  created_at: string
  metadata?: Record<string, any>
}

interface DTCWalletData {
  balance: number
  lifetime_earned: number
  lifetime_spent: number
  recent_transactions: DTCTransaction[]
}

interface DTCWalletProps {
  userId?: string
}

export function DTCWallet({ userId }: DTCWalletProps) {
  const [data, setData] = useState<DTCWalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)

        const res = await fetch(`/api/dtc/wallet?${params}`)
        if (!res.ok) throw new Error('Failed to fetch wallet')

        const result = await res.json()
        setData(result)
        setError(null)
      } catch (err) {
        console.error('[v0] Error fetching DTC wallet:', err)
        setError('Failed to load wallet')
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [userId])

  if (loading) {
    return <Card className="h-80 animate-pulse bg-muted" />
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-red-800">{error}</CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No wallet data available
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Coins className="h-6 w-6 text-amber-600" />
                DTC Wallet
              </CardTitle>
              <CardDescription>Your digital training coins balance</CardDescription>
            </div>
            <Gift className="h-6 w-6 text-amber-600 opacity-50" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Current Balance</div>
            <div className="text-5xl font-bold text-amber-600">{formatDTC(data.balance)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Available to spend on premium features and tips
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
            <div>
              <div className="flex items-center gap-1 text-green-700 font-medium mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Earned</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                +{formatDTC(data.lifetime_earned)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-red-700 font-medium mb-1">
                <TrendingDown className="h-4 w-4" />
                <span>Spent</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                -{formatDTC(data.lifetime_spent)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Your recent DTC activity ({data.recent_transactions.length} transactions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.recent_transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Start earning DTC by completing challenges!
            </div>
          ) : (
            <div className="space-y-3">
              {data.recent_transactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    tx.type === 'earn'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === 'earn'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      {tx.type === 'earn' ? (
                        <TrendingUp
                          className={`h-5 w-5 ${
                            tx.type === 'earn'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()} at{' '}
                        {new Date(tx.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge
                      variant={tx.type === 'earn' ? 'default' : 'secondary'}
                      className={
                        tx.type === 'earn'
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }
                    >
                      {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Earn DTC */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">How to Earn DTC</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-fit">+250</span>
              <span>DTC for completing your first interview</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-fit">+100</span>
              <span>DTC for each completed interview</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-fit">+50</span>
              <span>DTC for perfect score on any assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-fit">+25</span>
              <span>DTC daily bonus for maintaining a streak</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
