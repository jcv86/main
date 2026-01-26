'use client'

import { useEffect, useState } from 'react'
import { ConversationalLearning } from '@/components/conversational-learning'
import { CIPCapacityWidget } from '@/components/cip-capacity-widget'
import { createClient } from '@/app/utils/supabase/client'

export default function PersonalizedLearningPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      {/* CIP Capacity Widget */}
      {userId && (
        <div className="max-w-md mx-auto">
          <CIPCapacityWidget userId={userId} />
        </div>
      )}
      
      {/* Main Learning Component */}
      <ConversationalLearning />
    </div>
  )
}
