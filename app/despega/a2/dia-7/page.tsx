'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day7Experience } from '@/components/a2-day7-experience'

const DIA_NUM = 7

export default function Dia7Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay7Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 7 submission received (A3 CHECKPOINT):', submission)

      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dayNumber: 7,
            submission,
          }),
        })

        if (!apiResponse.ok) {
          const error = await apiResponse.json()
          throw new Error(error.error || 'Failed to complete day')
        }

        const result = await apiResponse.json()
        console.log('[v0] Day 7 completion result:', result)
        console.log('[v0] A3 unlocks triggered:', result.a3_unlocks)
        console.log('[v0] CHECKPOINT: A3 "espejo-de-carrera" module unlocked!')
      }

      // Wait a moment for Supabase to sync, then navigate
      await new Promise(resolve => setTimeout(resolve, 500))

      // Navigate to A2 progress dashboard with anchor to día-8
      console.log('[v0] Navigating to /despega/a2-routes#dia-8')
      router.push('/despega/a2-routes#dia-8')
    } catch (err) {
      console.error('[v0] Error in handleDay7Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day7Experience onComplete={handleDay7Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
