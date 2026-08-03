'use client'

import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { DTCShop } from '@/components/dtc-shop'
import { Loader2 } from 'lucide-react'

export default function DTCShopPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const [dtcBalance, setDtcBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/gamification/dtc-balance')
        const data = await response.json()

        if (response.ok) {
          setDtcBalance(data.balance || 0)
        }
      } catch (error) {
        console.error('[v0] Error fetching DTC balance:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchBalance()
  }, [user?.id])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-training/50" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DTCShop currentBalance={dtcBalance} />
    </main>
  )
}
